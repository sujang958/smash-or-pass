/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				pretendard: ['Pretendard Variable', 'Inter', 'Helvetica', 'Noto Sans', 'sans-serif']
			}
		}
	},
	plugins: []
};
