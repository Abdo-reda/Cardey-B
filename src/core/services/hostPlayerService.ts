import { reactive, type Reactive } from 'vue';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IJoinTeam } from '../interfaces/messageInterfaces/joinTeamInterface';
import { SyncMessage } from '../models/messages/syncMessage';

export class HostPlayerService implements IPlayerService {
	player: Reactive<IPlayer>;
	hostService: IHostService;

	constructor(hostService: IHostService, player: IPlayer) {
		this.hostService = hostService;
		this.player = reactive(player);
	}

	setupListeners(callback: (message: IMessage<any>) => void): void {
		this.hostService.onRecievedMessage = (playerId: string, message: IMessage<any>) => {
			console.log('--- Message recieved from player (client): ', playerId, message);
			callback(message);
		};
	}

	sendMessage<T>(message: IMessage<T>): void {
		this.hostService.sendMessageToAllExcept(message, []);
	}

	async joinGameAsync(): Promise<void> {
		const roomId = await this.hostService.createNewRoomAsync();
		this.player.id = roomId;
		this.player.roomId = roomId;
	}

	joinTeam(gameState: IGameState, data: IJoinTeam): void {
		this.syncGameState(gameState);
	}

	syncGameState(gameState: IGameState): void {
		this.sendMessage(new SyncMessage(this.player.id, gameState));
	}
}
