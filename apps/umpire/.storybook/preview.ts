import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
  parameters: {
    backgrounds: { disable: true },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) ?? 'dark'
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.documentElement.style.backgroundColor =
        theme === 'dark' ? '#0b0b0c' : '#ffffff'
      return Story()
    },
  ],
}

export default preview
