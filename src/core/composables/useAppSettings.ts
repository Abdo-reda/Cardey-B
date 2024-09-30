import { reactive, watch } from "vue";
import { LocalStorageEnum } from "../enums/localStorageEnum";
import type { IAppSettings } from "../interfaces/appSettingsInterface";
import { AppSettings } from "../models/appSettings";

const appSettings = reactive<IAppSettings>(new AppSettings());

function initSettingsState() {
	const savedAppSettings = localStorage.getItem(LocalStorageEnum.APP_SETTINGS);
	if (!savedAppSettings) return;
	const appSettingsState = JSON.parse(savedAppSettings) as IAppSettings;
	console.log('--- app settings found', appSettingsState);
	Object.assign(appSettings, appSettingsState);
}

export default function useAppSettings() {

	watch(
		() => appSettings,
		(newState, _) => {
			localStorage.setItem(LocalStorageEnum.APP_SETTINGS, JSON.stringify(newState));
		},
		{ deep: true }
	);
	
	return {
		appSettings,
		initSettingsState
	};
}