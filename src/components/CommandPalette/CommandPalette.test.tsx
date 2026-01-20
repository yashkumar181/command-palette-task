// src/components/CommandPalette/CommandPalette.test.tsx

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CommandPalette } from './CommandPalette';
import { Command } from '../../types';

// Mock Commands
const mockCommands: Command[] = [
  { id: '1', label: 'Command One', action: vi.fn() },
  { id: '2', label: 'Command Two', action: vi.fn() },
  { 
    id: '3', 
    label: 'Async Command', 
    fetchSubCommands: async (query) => {
        if (!query) return [];
        return [{ id: 'sub-1', label: `Result: ${query}`, action: vi.fn() }];
    } 
  }
];

describe('CommandPalette', () => {
  it('does not render initially (hidden)', () => {
    render(<CommandPalette commands={mockCommands} />);
    // Should not find the input because it's closed
    const input = screen.queryByPlaceholderText(/Type a command/i);
    expect(input).not.toBeInTheDocument();
  });

  it('opens when Cmd+K is pressed', () => {
    render(<CommandPalette commands={mockCommands} />);
    
    // Simulate Cmd+K
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    
    // Check if open
    const input = screen.getByPlaceholderText(/Type a command/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('closes when Escape is pressed', () => {
    render(<CommandPalette commands={mockCommands} />);
    
    // Open it
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close it
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('filters commands when typing', () => {
    render(<CommandPalette commands={mockCommands} />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });

    const input = screen.getByPlaceholderText(/Type a command/i);
    
    // Type "Two"
    fireEvent.change(input, { target: { value: 'Two' } });

    // Should see Command Two, but NOT Command One
    expect(screen.getByText('Command Two')).toBeInTheDocument();
    expect(screen.queryByText('Command One')).not.toBeInTheDocument();
  });

  it('navigates with arrow keys and selects with Enter', () => {
    render(<CommandPalette commands={mockCommands} />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });

    // Initially, first item selected (index 0 -> Command One)
    // Press Arrow Down -> Selects index 1 (Command Two)
    fireEvent.keyDown(window, { key: 'ArrowDown' });

    // Press Enter to execute
    fireEvent.keyDown(window, { key: 'Enter' });

    // Verify action was called
    expect(mockCommands[1].action).toHaveBeenCalled();
  });

// ... inside CommandPalette.test.tsx

  it('handles Async Parameterized Search (Real Timers)', async () => {
    // 1. Render without fake timers (Real browser behavior)
    render(<CommandPalette commands={mockCommands} />);
    
    // 2. Open the Palette
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    
    // 3. Navigate to the Async Command (Index 2)
    // Down -> Down -> Enter
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'Enter' });

    // 4. Verify we are in the sub-command
    const input = screen.getByPlaceholderText(/Type to search/i);
    expect(input).toBeInTheDocument();

    // 5. Type "Test"
    fireEvent.change(input, { target: { value: 'Test' } });

    // 6. Wait for the result (Real 300ms debounce + render)
    // waitFor will keep checking until it passes or times out (1000ms)
    await waitFor(() => {
        expect(screen.getByText('Result: Test')).toBeInTheDocument();
    }, { timeout: 1000 });

    // 7. Check Accessibility Update
    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toHaveTextContent(/1 results available/i);
  });

// ... end of describe block
});