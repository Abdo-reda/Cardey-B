import type { IAppSettings } from '../interfaces/appSettingsInterface';

export class AppSettings implements IAppSettings {
	backgroundAnimation: boolean = true;
	sound: boolean = true;
	vibration: boolean = true;
}
