import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';
let THEMES;
export default {
    content: [],
    theme: {
        extend: {},
    },
    plugins: [daisyui],
    daisyui: {
        themes: THEMES,
    },
} satisfies Config;