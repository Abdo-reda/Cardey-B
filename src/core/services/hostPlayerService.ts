import { reactive, type Reactive } from 'vue';
import type { IMessage } from '../interfaces/messageInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';
import { SyncMessage } from '../models/messages/syncMessage';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IJoinTeam } from '../interfaces/dataMessagesInterfaces/joinTeamInterface';

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

			// console.log('==== host', message.method);
			// if (message.method === MethodsEnum.JOIN_GAME) {
			// 	// this.playerJoinedGame(message.data);
			// 	console.log('--- host handling join game');
			// }

			// if (message.method === MethodsEnum.JOIN_TEAM) {
			// 	console.log('--- host handling join team');
			// 	// this.pushPlayerToTeam(
			// 	// 	this.gameState.value.players.find(
			// 	// 		(player) => player.id === message.data.playerId
			// 	// 	)!,
			// 	// 	message.data.teamId
			// 	// );
			// }
			console.log('--- syncing game');
			// this.sendSyncGameState();
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
		this.sendSyncGameState(gameState);
	}

	private sendSyncGameState(gameState: IGameState): void {
		this.sendMessage(new SyncMessage(this.player.id, gameState));
	}
}
