import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

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
	plugins: [
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					'font-stroke': (value) => ({
						'-webkit-text-stroke-width': value
					})
				},
				{
					values: {
						...theme('borderWidth'),
						thin: 'thin',
						medium: 'medium',
						thick: 'thick'
					}
				}
			);
		}),
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					'font-stroke': (value) => ({
						'-webkit-text-stroke-color': value
					})
				},
				{
					values: flattenColorPalette(theme('colors'))
				}
			);
		})
	]
};
