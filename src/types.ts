export type CommandAction = () => void | Promise<void>;

export interface Command {
  id: string;      //identifier
  label: string;     //displayed to user
  action?: CommandAction;   //func to execute
  subCommands?: Command[];
  fetchSubCommands?: (query: string) => Promise<Command[]>;
}