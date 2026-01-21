import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { Command } from './types';

function App() {
  const commands: Command[] = [
    { 
        id: '1', 
        label: 'Toggle Dark Mode', 
        action: () => alert('Dark Mode Toggled') 
    },
    
    //async ,dynamic command
    {
        id: 'user-search',
        label: 'Search Users...',
        // This runs every time the user types inside this command
        fetchSubCommands: async (query) => {
            if (!query) return []; 
            await new Promise(r => setTimeout(r, 500));
            //mock data
            const users = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
            return users
                .filter(u => u.toLowerCase().includes(query.toLowerCase()))
                .map(u => ({
                    id: u.toLowerCase(),
                    label: `User: ${u}`,
                    action: () => alert(`Selected User: ${u}`)
                }));
        }
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
        id: '3', 
        label: 'Git...', 
        subCommands: [
            { id: '3-1', label: 'Git Checkout', action: () => alert('Git: Checkout') },
            { id: '3-2', label: 'Git Commit', action: () => alert('Git: Commit') },
        ]
    },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-400 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Command Palette Demo</h1>
      <p className="mb-8">Press <kbd className="bg-zinc-800 px-2 py-1 rounded text-white">Cmd + K</kbd> to open</p>
      <CommandPalette commands={commands} />
    </div>
  );
}

export default App;