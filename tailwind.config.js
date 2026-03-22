/** @type {import('tailwindcss').Config} */

import { title } from 'node:process';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        background: "var(--color-background)",
        card: "var(--color-card)",
        navbar: "var(--gradient-navbar)",
        title: "var(--color-title)"
      },
      fontFamily: {
        inter: ["var(--font-family)"],
      },
      fontSize: {
        title: "var(--text-title)",
        subtitle: "var(--text-subtitle)",
        cardtitle: "var(--text-card-title)",
        cardsubtitle: "var(--text-card-subtitle)",
        content: "var(--text-content)",
      },
      fontWeight: {
        light: "var(--font-light)",       // 300
        regular: "var(--font-regular)",   // 400
        semibold: "var(--font-semibold)", // 600
        bold: "var(--font-bold)",         // 700
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      // boxShadow: {
      //   sm: "var(--shadow-sm)",
      //   md: "var(--shadow-md)",
      //   long: "var(--shadow-lg)",
      // },
      transitionDuration: {
        fast: "0.2s",
        normal: "0.3s",
      },
    },
  },
  plugins: [],
};