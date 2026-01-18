import { useState, useEffect, useMemo, useRef } from 'react';
import { fuzzySearch } from './utils/fuzzySearch';
import { useFocusTrap } from './hooks/useFocusTrap';

interface Command {
  id: string;
  label: string;
  action: () => void;
}

const COMMANDS: Command[] = [
  { id: '1', label: 'Toggle Dark Mode', action: () => alert('Dark Mode Toggled') },
  { id: '2', label: 'Go to Settings', action: () => alert('Navigating to Settings...') },
  { id: '3', label: 'Create New File', action: () => alert('New File Created') },
  { id: '4', label: 'Git Checkout', action: () => alert('Git checkout triggered') },
];

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = useMemo(() => {
    return COMMANDS
      .map((cmd) => ({ ...cmd, result: fuzzySearch(query, cmd.label) }))
      .filter((item) => item.result.matches)
      .sort((a, b) => b.result.score - a.result.score);
  }, [query]);

  // Connect the Focus Trap
  useFocusTrap(containerRef, isOpen);

  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [isOpen, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm">
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl"
      >
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          className="h-14 flex-1 bg-transparent px-4 text-lg text-white placeholder-zinc-500 focus:outline-none border-b border-zinc-800"
        />
        
        <ul className="max-h-[60vh] overflow-y-auto p-2" role="listbox">
          {filteredCommands.length === 0 ? (
             <div className="p-4 text-center text-sm text-zinc-500">
               No results found.
             </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <li
                key={cmd.id}
                role="option"
                aria-selected={index === selectedIndex}
                tabIndex={0} 
                onClick={() => { cmd.action(); setIsOpen(false); }}
                onMouseEnter={() => setSelectedIndex(index)}
                
                // FIX 4: When Tab moves focus here, update the visual selection!
                onFocus={() => setSelectedIndex(index)}

                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    cmd.action();
                    setIsOpen(false);
                  }
                }}
                className={`flex cursor-pointer items-center justify-between rounded-md px-4 py-3 outline-none ${
                  index === selectedIndex 
                    ? 'bg-zinc-800 text-white ring-1 ring-zinc-700' 
                    : 'text-zinc-400 hover:bg-zinc-800/50'
                }`}
              >
                <span>{cmd.label}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};