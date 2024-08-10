import { reactive, type Reactive } from 'vue';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IClientService } from '../interfaces/clientServiceInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import { MessageMethodsEnum } from '../enums/methodsEnum';
import { MESSAGES_MAP } from '../constants/messagesMap';

export class ClientPlayerService implements IPlayerService {
	player: Reactive<IPlayer>;
	clientService: IClientService;

	constructor(clientService: IClientService, player: IPlayer) {
		this.player = reactive(player);
		this.clientService = clientService;
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

	sendMessage<E extends MessageMethodsEnum>(message: IMessage<E>): void {
		console.log('---- Client sending message: ', message);
		this.clientService.sendMessageToHost(message);
	}

	async joinGameAsync(): Promise<void> {
		const id = await this.clientService.createJoinRequestAsync(this.player.roomId);
		this.player.id = id;
	}

	syncGameState(gameState: IGameState): void {}

	private sendJoinGame(): void {
		const msg = MESSAGES_MAP.get(MessageMethodsEnum.JOIN_GAME)!;
		msg.init(this.player.id, this.player);
		this.sendMessage(msg);
	}
}
