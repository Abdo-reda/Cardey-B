import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				origami: ['Origami', 'sans-serif']
			},
			colors: {
				danger: colors.red,
				gray: colors.zinc,
				info: colors.blue,
				primary: '#1677ff',
				success: colors.green,
				warning: colors.amber
			}
		}
	},
	plugins: []
};
