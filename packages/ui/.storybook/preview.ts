import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      // ROTRA is dark-mode-only — lock the background
      default: 'dark',
      values: [{ name: 'dark', value: '#0B0B0C' }],
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // Always apply the dark class so ROTRA tokens render correctly
  decorators: [
    (Story) => {
      document.documentElement.classList.add('dark')
      return Story()
    },
  ],
}

export default preview
