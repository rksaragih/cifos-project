/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.ts",
        "./resources/**/*.tsx",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#16a34a",
                    foreground: "#ffffff",
                },
            },
        },
    },
    plugins: [require("tailwind-scrollbar-hide")],
};
