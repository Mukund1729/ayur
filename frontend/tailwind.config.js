/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        accent: {
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#C4935F',
          400: '#D4A574',
          300: '#E5C39C',
          200: '#F3E2C7',
          100: '#FDF4E3',
          50: '#FFFBF5',
        },
        cream: {
          900: '#8B7355',
          800: '#A0926D',
          700: '#B5A88A',
          600: '#C9BEA3',
          500: '#DDD3BA',
          400: '#E8DFCC',
          300: '#F0E8D8',
          200: '#F5F0E8',
          100: '#FAF7F2',
          50: '#FDFCFA',
        },
        vata: { main: '#2D5A7B', light: '#E8F4F8', dark: '#1A3A52' },
        pitta: { main: '#B8754C', light: '#FDF0E8', dark: '#8B5A3C' },
        kapha: { main: '#4A7C6F', light: '#E8F5EE', dark: '#2D5248' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 8px 40px rgba(15, 23, 42, 0.08)',
        'glow': '0 0 40px rgba(196, 147, 95, 0.15)',
      },
    },
  },
  plugins: [],
}
