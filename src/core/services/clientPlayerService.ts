import { reactive, type Reactive } from 'vue';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IClientService } from '../interfaces/clientServiceInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IJoinTeam } from '../interfaces/messageInterfaces/joinTeamInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import { JoinTeamMessage } from '../models/messages/joinTeamMessage';
import { JoinGameMessage } from '../models/messages/joinGameMessage';

export class ClientPlayerService implements IPlayerService {
	player: Reactive<IPlayer>;
	clientService: IClientService;

	constructor(clientService: IClientService, player: IPlayer) {
		this.player = reactive(player);
		this.clientService = clientService;
	}

	joinTeam(gameState: IGameState, data: IJoinTeam) {
		this.sendMessage(new JoinTeamMessage(this.player.id, data));
	}

	setupListeners(callback: (message: IMessage<any>) => void): void {
		this.clientService.onRecievedMessage = (message: IMessage<any>) => {
			console.log('----- Client recieved message from host: ', message);
			callback(message);
		};

		this.clientService.onDataChannelOpen = () => {
			console.log('----- Client on Data channel open');
			this.sendJoinGame();
		};
	}

	sendMessage<T>(message: IMessage<T>): void {
		console.log('---- Client sending message: ', message);
		this.clientService.sendMessageToHost(message);
	}

	async joinGameAsync(): Promise<void> {
		const id = await this.clientService.createJoinRequestAsync(this.player.roomId);
		this.player.id = id;
	}

	syncGameState(gameState: IGameState): void {}

	private sendJoinGame(): void {
		this.sendMessage(new JoinGameMessage(this.player.id, this.player));
	}
}
