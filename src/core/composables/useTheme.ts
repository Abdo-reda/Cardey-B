import { ref } from 'vue';
import { theme } from 'ant-design-vue';

export default function useTheme() {
	const isDark = ref(localStorage.getItem('theme') === 'dark');
	const currentThemeAlgorithm = ref(theme.defaultAlgorithm);

	function switchTheme() {
		isDark.value = !isDark.value;
		setTheme();
	}

	function setTheme() {
		currentThemeAlgorithm.value = isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm; //make this a computed value?
		const addTheme = isDark.value ? 'dark' : 'light';
		const removeTheme = isDark.value ? 'light' : 'dark';
		document.documentElement.classList.remove(removeTheme);
		document.documentElement.classList.add(addTheme);
		document.body.classList.remove(`body-${removeTheme}`);
		document.body.classList.add(`body-${addTheme}`);
		localStorage.setItem('theme', addTheme);
	}

	return {
		isDark,
		currentThemeAlgorithm,
		switchTheme,
		setTheme
	};
}
