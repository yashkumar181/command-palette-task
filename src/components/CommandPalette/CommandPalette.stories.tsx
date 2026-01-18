import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette } from './CommandPalette';
import { userEvent } from '@storybook/test';

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  parameters: { layout: 'fullscreen', backgrounds: { default: 'dark' } },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Opened: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const body = canvasElement.ownerDocument.body;
    await new Promise(r => setTimeout(r, 500));
    await userEvent.type(body, '{control}k');
  },
};