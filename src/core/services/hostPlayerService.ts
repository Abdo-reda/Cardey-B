import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import { MessageMethodsEnum } from '../enums/methodsEnum';
import { MESSAGES_MAP } from '../constants/messagesMap';
import { BasePlayerService } from './basePlayerService';

export class HostPlayerService extends BasePlayerService<IHostService> {
	constructor(hostService: IHostService, player: IPlayer) {
		super(hostService, player);
	}

	setupListeners(): void {
		console.log('--- setting up host listeners');
		this.service.onRecievedMessage = (playerId: string, message: IMessage<any>) => {
			console.log('--- Message recieved from player (client): ', playerId, message);
			this.handleMessage(message);
		};
	}

	sendMessage<E extends MessageMethodsEnum>(message: IMessage<E>): void {
		console.log('---- Host sending message: ', message);
		this.service.sendMessageToAllExcept(message, []);
	}

	async joinGameAsync(): Promise<void> {
		const roomId = await this.service.createNewRoomAsync();
		this.player.id = roomId;
		this.player.roomId = roomId;
	}

	syncGameState(gameState: IGameState): void {
		const msg = MESSAGES_MAP.get(MessageMethodsEnum.SYNC)!;
		msg.init(this.player.id, gameState);
		this.sendMessage(msg);
	}
}
