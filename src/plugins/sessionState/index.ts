import usePlayer from '@/core/composables/usePlayer';

const { initPlayerState } = usePlayer();

const sessionState = {
	install() {
		initPlayerState();
	}
};

export default sessionState;
