import { reactive, type Reactive } from 'vue';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import { MessageMethodsEnum } from '../enums/methodsEnum';
import { MESSAGES_MAP } from '../constants/messagesMap';

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

	sendMessage<E extends MessageMethodsEnum>(message: IMessage<E>): void {
		console.log('---- Host sending message: ', message);
		this.hostService.sendMessageToAllExcept(message, []);
	}

	async joinGameAsync(): Promise<void> {
		const roomId = await this.hostService.createNewRoomAsync();
		this.player.id = roomId;
		this.player.roomId = roomId;
	}

	syncGameState(gameState: IGameState): void {
		const msg = MESSAGES_MAP.get(MessageMethodsEnum.SYNC)!;
		msg.init(this.player.id, gameState);
		this.sendMessage(msg);
	}
}
