/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#156B4A",
          hover: "#0F5A3E",
          light: "#E8F5EE",
        },
        background: "#F6F8F7",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        text: {
          primary: "#1F2937",
          secondary: "#6B7280",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        button: "12px",
        input: "12px",
        modal: "24px",
        drawer: "24px",
      },
      boxShadow: {
        premium: "0 4px 20px -2px rgba(21, 107, 74, 0.03), 0 2px 12px -1px rgba(0, 0, 0, 0.02)",
        'premium-hover': "0 10px 30px -4px rgba(21, 107, 74, 0.05), 0 4px 20px -2px rgba(0, 0, 0, 0.03)",
        card: "0 4px 18px 0 rgba(0, 0, 0, 0.02)",
        modal: "0 20px 40px -4px rgba(0, 0, 0, 0.08)",
        drawer: "0 20px 40px -4px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
}