/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#ffffff",
                foreground: "#0a0a0a",
                card: "#ffffff",
                "card-foreground": "#0a0a0a",
                primary: "#1d4ed8",
                "primary-foreground": "#ffffff",
                secondary: "#f5f5f5",
                "secondary-foreground": "#171717",
                muted: "#f5f5f5",
                "muted-foreground": "#737373",
                accent: "#f5f5f5",
                "accent-foreground": "#171717",
                destructive: "#ef4444",
                "destructive-foreground": "#ffffff",
                border: "#e5e5e5",
                input: "#e5e5e5",
                ring: "#1d4ed8",
            },
        },
    },
    plugins: [],
}
