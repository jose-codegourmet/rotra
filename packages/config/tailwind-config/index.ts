import type { Config } from 'tailwindcss'

const config: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background scale
        'bg-base': '#0B0B0C',
        'bg-surface': '#1A1A1D',
        'bg-elevated': '#2A2A2E',
        'bg-overlay': '#3A3A3F',

        // Text scale
        'text-primary': '#F0F0F2',
        'text-secondary': '#9090A0',
        'text-disabled': '#4A4A55',

        // Accent
        accent: '#00FF88',
        'accent-dim': '#00CC6A',
        'accent-subtle': 'rgba(0, 255, 136, 0.13)',

        // Semantic
        error: '#FF4D4D',
        warning: '#FFB800',
        border: '#2A2A2E',
        'border-strong': '#404048',
      },

      fontFamily: {
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        display: ['28px', { lineHeight: '1.2', letterSpacing: '-0.5px', fontWeight: '700' }],
        title: ['22px', { lineHeight: '1.3', letterSpacing: '-0.3px', fontWeight: '600' }],
        heading: ['18px', { lineHeight: '1.4', letterSpacing: '-0.2px', fontWeight: '600' }],
        body: ['15px', { lineHeight: '1.5', letterSpacing: '0px', fontWeight: '400' }],
        small: ['13px', { lineHeight: '1.4', letterSpacing: '0.1px', fontWeight: '400' }],
        label: ['12px', { lineHeight: '1.2', letterSpacing: '0.5px', fontWeight: '500' }],
        micro: ['10px', { lineHeight: '1.2', letterSpacing: '0.8px', fontWeight: '500' }],
      },

      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
      },

      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        full: '9999px',
      },

      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.4)',
        modal: '0 8px 32px rgba(0,0,0,0.6)',
        accent: '0 0 16px rgba(0,255,136,0.25)',
      },

      transitionDuration: {
        fast: '100ms',
        default: '200ms',
        slow: '350ms',
        spring: '400ms',
      },
    },
  },
}

export default config
