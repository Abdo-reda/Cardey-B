import { computed, reactive, watch } from 'vue';
import type { IPlayer } from '../interfaces/playerInterface';
import { Player } from '../models/player';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import { ClientService } from '../services/clientService';
import { HostService } from '../services/hostService';
import { ClientPlayerService } from '../services/clientPlayerService';
import { HostPlayerService } from '../services/hostPlayerService';
import { SessionStorageEnum } from '../enums/sesionStorageEnum';

const currentPlayer = reactive<IPlayer>(new Player());
const clientService = new ClientService();
const hostService = new HostService();

const clientPlayerService = new ClientPlayerService(clientService, currentPlayer);
const hostPlayerService = new HostPlayerService(hostService, currentPlayer);

const playerService = computed<IPlayerService>(() => {
	if (currentPlayer.isHost) {
		return hostPlayerService;
	} else {
		return clientPlayerService;
	}
});

watch(
	() => currentPlayer,
	(newState, _) => {
		sessionStorage.setItem(SessionStorageEnum.PLAYER_STATE, JSON.stringify(newState));
	},
	{ deep: true }
);

function initPlayerState() {
	const sessionState = sessionStorage.getItem(SessionStorageEnum.PLAYER_STATE);
	if (!sessionState) return;
	const playerSessionState = JSON.parse(sessionState) as IPlayer;
	console.log('--- player state found', playerSessionState);
	Object.assign(currentPlayer, playerSessionState);
}

export default function usePlayer() {
	return {
		currentPlayer,
		playerService,
		initPlayerState
	};
}
