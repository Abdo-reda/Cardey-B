import { reactive, type Reactive } from 'vue';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import { MessageMethodsEnum } from '../enums/methodsEnum';
import { type MessageMethodPayloadMap, MESSAGES_MAP } from '../constants/messagesMap';
import type { IBaseWebRTCService } from '../interfaces/baseWebRTCServiceInterface';

export class BasePlayerService<T extends IBaseWebRTCService> implements IPlayerService {
	protected player: Reactive<IPlayer>;
	service: T;

	constructor(service: T, player: IPlayer) {
		this.player = reactive(player);
		this.service = service;
		this.setupListeners();
	}

	setupListeners(): void {}

	async joinGameAsync(): Promise<void> {}

	syncGameState(gameState: IGameState): void {}

	protected handleMessage(message: IMessage<any>): void {
		console.log('--- handling message', message);
		this.executeMessage(message.method, message.senderId, message.data);
	}

	protected executeMessage<E extends MessageMethodsEnum>(
		method: E,
		senderId: string,
		data: MessageMethodPayloadMap[E]
	) {
		const msg = MESSAGES_MAP.get(method)!;
		msg.init(senderId, data);
		msg.handle();
	}

	sendMessage<E extends MessageMethodsEnum>(message: IMessage<E>): void {}

	public executeAndSendMessage<E extends MessageMethodsEnum>(
		method: E,
		data: MessageMethodPayloadMap[E]
	) {
		this.executeMessage(method, this.player.id, data);
		this.sendMessage(MESSAGES_MAP.get(method)!);
	}

	private resetPlayer() {
		this.player.teamId = '';
		this.player.words = [];
		this.player.isHost = false;
	}

	public sendChatMessage(message: string) {
		console.log(`${this.player.isHost ? 'host' : 'client'} player ${this.player.id} - ${this.player.name} sending chat message ${message}`);
		this.service.sendChatMessage(message);
	}

	public disconnect(): void {
		this.service.disconnect();
		this.executeMessage(MessageMethodsEnum.QUIT_GAME, this.player.id, undefined);
		this.resetPlayer(); //TODO: this should be in the fucking message
	}
}
