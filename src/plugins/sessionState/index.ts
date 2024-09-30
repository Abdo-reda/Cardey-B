import useAppSettings from '@/core/composables/useAppSettings';
import usePlayer from '@/core/composables/usePlayer';

const { initPlayerState } = usePlayer();
const { initSettingsState } = useAppSettings();

const sessionState = {
	install() {
		initPlayerState();
		initSettingsState();
	}
};

export default sessionState;
