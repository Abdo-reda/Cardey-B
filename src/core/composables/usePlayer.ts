import { computed, reactive } from 'vue';
import type { IPlayer } from '../interfaces/playerInterface';
import { Player } from '../models/player';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import { ClientService } from '../services/clientService';
import { HostService } from '../services/hostService';
import { ClientPlayerService } from '../services/clientPlayerService';
import { HostPlayerService } from '../services/hostPlayerService';

const player = reactive<IPlayer>(new Player());

const clientService = new ClientService();
const hostService = new HostService();

const clientPlayerService = new ClientPlayerService(clientService, player);
const hostPlayerService = new HostPlayerService(hostService, player);

const playerService = computed<IPlayerService>(() => {
	if (player.isHost) {
		return hostPlayerService;
	} else {
		return clientPlayerService;
	}
});

export default function usePlayer() {
	return {
		player,
		playerService
	};
}
