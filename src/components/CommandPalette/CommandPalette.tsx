// src/components/CommandPalette/CommandPalette.tsx

import { useState, useEffect, useMemo, useRef } from 'react';
import { fuzzySearch } from './utils/fuzzySearch';
import { useFocusTrap } from './hooks/useFocusTrap';
import { Command } from '../../types';

interface CommandPaletteProps {
  commands: Command[];
}

export const CommandPalette = ({ commands }: CommandPaletteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Breadcrumbs for navigation (e.g., [Main] -> [Settings] -> [Profile])
  const [navigationPath, setNavigationPath] = useState<Command[]>([]); 
  
  // State for Async Actions & Dynamic Searching
  const [loading, setLoading] = useState(false);
  const [dynamicResults, setDynamicResults] = useState<Command[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Identify the Current Context
  // Are we at the root, or deep in a sub-menu?
  const activeCommand = navigationPath.length > 0 ? navigationPath[navigationPath.length - 1] : null;
  
  // 2. Check if the current context is "Dynamic" (needs to fetch data from API)
  const isDynamic = !!activeCommand?.fetchSubCommands;

  // 3. Dynamic Data Fetching (Debounced)
  useEffect(() => {
    // Only run if we are in a dynamic command context
    if (!isDynamic || !activeCommand?.fetchSubCommands) return;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await activeCommand.fetchSubCommands!(query);
        setDynamicResults(results);
      } catch (err) {
        console.error("Fetch failed", err);
        setDynamicResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce to prevent spamming

    return () => clearTimeout(timeoutId);
  }, [query, isDynamic, activeCommand]);

  // 4. Determine which list of commands to display
  const filteredCommands = useMemo(() => {
    // CASE A: Dynamic Mode -> Show fetched results directly (API handles filtering)
    if (isDynamic) {
        return dynamicResults;
    }

    // CASE B: Static Mode -> Filter the static list locally
    const scope = activeCommand ? (activeCommand.subCommands || []) : commands;
    
    // If query is empty, show all available in this scope
    if (!query) return scope;

    return scope
      .map((cmd) => ({ ...cmd, result: fuzzySearch(query, cmd.label) }))
      .filter((item) => item.result.matches)
      .sort((a, b) => b.result.score - a.result.score);
  }, [query, activeCommand, commands, isDynamic, dynamicResults]);

  // Reset selection index when the list changes
  useEffect(() => { setSelectedIndex(0); }, [filteredCommands]);

  // 5. Global Keyboard Toggle (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
            if (!prev) {
                // Reset state on open
                setQuery('');
                setNavigationPath([]);
                setLoading(false);
                setDynamicResults([]);
            }
            return !prev;
        });
      }
      if (e.key === 'Escape') {
        if (isOpen && !loading) {
             // Go back one level if deep in menu, else close
             if (navigationPath.length > 0) {
                 setNavigationPath((prev) => prev.slice(0, -1));
                 setQuery(''); 
                 setDynamicResults([]);
             } else {
                 setIsOpen(false);
             }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, navigationPath, loading]);

  // 6. Connect Focus Trap
  useFocusTrap(containerRef, isOpen);

  // 7. Helper to Execute Commands
  const runCommand = async (cmd: Command) => {
    // If command has sub-commands (Static OR Dynamic), dive deeper
    if (cmd.subCommands || cmd.fetchSubCommands) {
        setNavigationPath((prev) => [...prev, cmd]);
        setQuery('');
        setDynamicResults([]); 
        return;
    }

    // Otherwise, execute the action
    if (cmd.action) {
        const result = cmd.action();
        
        // Handle Async Actions (Promises)
        if (result instanceof Promise) {
            setLoading(true);
            try {
                await result;
                setIsOpen(false);
                setNavigationPath([]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            // Synchronous Action
            setIsOpen(false);
            setNavigationPath([]);
        }
    }
  };

  // 8. Internal Navigation (Arrows / Enter)
  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (!isOpen || loading) return; // Block nav during loading

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) runCommand(selected);
      }
    };
    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [isOpen, filteredCommands, selectedIndex, loading]);

  // 9. Accessibility Status Text (for Screen Readers)
  const a11yStatus = loading 
    ? "Searching..." 
    : filteredCommands.length === 0 
      ? "No results found." 
      : `${filteredCommands.length} results available.`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm">
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="w-full max-w-xl flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl relative"
      >
        {/* Header: Breadcrumbs & Input */}
        <div className="flex items-center border-b border-zinc-800 px-4">
            {navigationPath.map((crumb) => (
                <span key={crumb.id} className="mr-2 text-xs text-zinc-500 font-mono">
                    {crumb.label} /
                </span>
            ))}
            <input
              autoFocus
              type="text"
              // Only disable input if we are executing a final action, not while searching
              disabled={loading && !isDynamic} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isDynamic ? "Type to search..." : "Type a command..."}
              className="h-14 flex-1 bg-transparent text-lg text-white placeholder-zinc-500 focus:outline-none"
              aria-expanded="true"
              aria-controls="command-list"
              aria-activedescendant={filteredCommands[selectedIndex]?.id}
            />
        </div>
        
        {/* Body: List or Loading State */}
        <div id="command-list" className="min-h-[100px] max-h-[60vh] overflow-y-auto p-2" role="listbox">
          
          {loading && !isDynamic ? (
             <div className="flex justify-center py-8"><span className="text-zinc-500">Executing...</span></div>
          ) : filteredCommands.length === 0 ? (
             <div className="p-4 text-center text-sm text-zinc-500">
               {loading ? "Searching..." : "No results found."}
             </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <li
                key={cmd.id}
                id={cmd.id}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => runCommand(cmd)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex cursor-pointer items-center justify-between rounded-md px-4 py-3 outline-none ${
                  index === selectedIndex 
                    ? 'bg-zinc-800 text-white ring-1 ring-zinc-700' 
                    : 'text-zinc-400 hover:bg-zinc-800/50'
                }`}
              >
                <span>{cmd.label}</span>
                {/* Visual indicator for sub-menus */}
                {(cmd.subCommands || cmd.fetchSubCommands) && <span className="text-xs text-zinc-600">↵</span>}
              </li>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800 text-xs text-zinc-600 flex justify-between">
            <span>{loading && isDynamic ? 'Fetching...' : '↑↓ to navigate'}</span>
            <span>esc to close</span>
        </div>

        {/* Visually Hidden Live Region for Accessibility */}
        <div role="status" aria-live="polite" className="sr-only">
          {a11yStatus}
        </div>
      </div>
    </div>
  );
};