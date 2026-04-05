import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
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
  decorators: [
    (Story) => {
      document.documentElement.classList.add('dark')
      return Story()
    },
  ],
}

export default preview
