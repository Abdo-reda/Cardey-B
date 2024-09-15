import { reactive, type Reactive } from 'vue'
import type { IPlayer } from '../interfaces/playerInterface'
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface'
import type { IPlayerService } from '../interfaces/playerServiceInterface'
import type { IGameState } from '../interfaces/gameStateInterface'
import { MessageMethodsEnum } from '../enums/methodsEnum'
import { type MessageMethodPayloadMap, MESSAGES_MAP } from '../constants/messagesMap'
import { GameState } from '@/core/models/gameState'
import { SessionStorageEnum } from '@/core/enums/sesionStorageEnum'
import { Player } from '@/core/models/player'
import { RoutesEnum } from '@/core/enums/routesEnum'

export class BasePlayerService<T> implements IPlayerService {
	protected player: Reactive<IPlayer>;
	service: T;

	constructor(service: T, player: IPlayer) {
		this.player = reactive(player);
		this.service = service;
		this.setupListeners();
	}

	setupListeners(): void {}

	sendMessage<E extends MessageMethodsEnum>(message: IMessage<E>): void {}

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

	public executeAndSendMessage<E extends MessageMethodsEnum>(
		method: E,
		data: MessageMethodPayloadMap[E]
	) {
		this.executeMessage(method, this.player.id, data);
		this.sendMessage(MESSAGES_MAP.get(method)!);
	}
	
	public disconnect(): void{
		const newGameState = new GameState()
		newGameState.currentRoute = RoutesEnum.HOME;
		this.executeMessage(MessageMethodsEnum.SYNC, this.player.id, new GameState());
		const newPlayer = new Player();
		newPlayer.name = this.player.name;
		Object.assign(this.player, newPlayer);
		sessionStorage.removeItem(SessionStorageEnum.PLAYER_STATE);
	}
}
