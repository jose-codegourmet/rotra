import type { Meta, StoryObj } from '@storybook/react'
import { BottomNav } from './BottomNav'

const meta: Meta<typeof BottomNav> = {
  title: 'Navigation/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  argTypes: {
    activeItem: {
      control: 'select',
      options: ['home', 'clubs', 'sessions', 'profile'],
    },
  },
}

export default meta
type Story = StoryObj<typeof BottomNav>

export const Default: Story = {
  args: {
    activeItem: 'home',
  },
}

export const ActiveClubs: Story = {
  args: {
    activeItem: 'clubs',
  },
}

export const ActiveSessions: Story = {
  args: {
    activeItem: 'sessions',
  },
}

export const ActiveProfile: Story = {
  args: {
    activeItem: 'profile',
  },
}
