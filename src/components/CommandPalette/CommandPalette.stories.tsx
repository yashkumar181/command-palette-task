import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { CommandPalette } from './CommandPalette';
import { Command } from '../../types';

//mockk data
const mockCommands: Command[] = [
  { 
    id: '1', 
    label: 'Toggle Dark Mode', 
    action: () => alert('Dark Mode Toggled') 
  },
  { 
    id: '2', 
    label: 'Navigation...', 
    subCommands: [
        { id: '2-1', label: 'Go to Settings', action: () => alert('Nav: Settings') },
        { id: '2-2', label: 'Go to Profile', action: () => alert('Nav: Profile') },
    ]
  },
  {
    id: 'async-search',
    label: 'Search Users (Async)...',
    fetchSubCommands: async (query) => {
        if (!query) return [];
        await new Promise(r => setTimeout(r, 800));
        return [
            { id: 'u1', label: `User: ${query} (1)`, action: () => alert('Selected 1') },
            { id: 'u2', label: `User: ${query} (2)`, action: () => alert('Selected 2') },
        ];
    }
  }
];
const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black text-white p-8 font-sans">
        <div className="max-w-2xl mx-auto text-center mt-20">
          <h1 className="text-3xl font-bold mb-4">Command Palette Demo</h1>
          <p className="text-zinc-400 mb-8">
            Press <kbd className="bg-zinc-800 px-2 py-1 rounded text-white border border-zinc-700">Cmd + K</kbd> or <kbd className="bg-zinc-800 px-2 py-1 rounded text-white border border-zinc-700">Ctrl + K</kbd> to open.
          </p>
          <div className="p-4 bg-zinc-900 rounded border border-zinc-800 text-left text-sm text-zinc-400">
            <p className="mb-2"><strong className="text-white">Try these flows:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Select <strong>Navigation...</strong> to see sub-menus.</li>
              <li>Select <strong>Search Users...</strong> and type to see the <span className="text-yellow-500">Loading Spinner</span>.</li>
            </ul>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Story , User must manually press Cmd+K
export const Playground: Story = {
  args: {
    commands: mockCommands,
  },
};

// Interaction Story: Automatically opens and types to show the Loading State
// This proves Loading states without the reviewer doing anything
export const DemoLoadingState: Story = {
  args: {
    commands: mockCommands,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open Palette', async () => {
      await userEvent.keyboard('{Meta>}{k}{/Meta}');
    });

    await step('Navigate to Async Search', async () => {
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    });

    await step('Trigger Search', async () => {
      const input = canvas.getByPlaceholderText('Type to search...');
      await userEvent.type(input, 'test', { delay: 50 });
    });
  },
};