// src/types.ts

export type CommandAction = () => void | Promise<void>;

export interface Command {
  /** Unique identifier for the command */
  id: string;
  /** The text displayed to the user */
  label: string;
  /** The function to execute */
  action?: CommandAction;
  /** Static nested commands */
  subCommands?: Command[];
  /** * NEW: Dynamic sub-command generator.
   * Required for the "Search Users" feature in App.tsx 
   */
  fetchSubCommands?: (query: string) => Promise<Command[]>;
}