import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import { MessageMethodsEnum } from '../enums/methodsEnum';
import { MESSAGES_MAP } from '../constants/messagesMap';
import { BasePlayerService } from './basePlayerService';
import { ChannelsEnum } from '../enums/channelsEnum';

export class HostPlayerService extends BasePlayerService<IHostService> {
	constructor(hostService: IHostService, player: IPlayer) {
		super(hostService, player);
	}

	setupListeners(): void {
		console.log('--- setting up host listeners');
		this.service.onRecievedMessage = (
			channel: ChannelsEnum,
			playerId: string,
			message: IMessage<any>
		) => {
			console.log('--- Message recieved from player (client): ', playerId, message);
			this.handleMessage(message);
			if (channel === ChannelsEnum.CHAT) {
				this.service.sendChatMessage(message, [playerId]); //forward chat message to all players
			}
		};
		this.service.onPlayerDisconnected = (playerId: string) => {
			this.executeAndSendMessage(MessageMethodsEnum.PLAYER_DISCONNECTED, playerId);
		};
	}

	sendGameMessage<E extends MessageMethodsEnum>(message: IMessage<E>): void {
		console.log('---- Host sending message: ', message);
		this.service.sendMessageToAllExcept(ChannelsEnum.GAME_DATA, message);
	}

	async joinGameAsync(): Promise<void> {
		const roomId = await this.service.createNewRoomAsync();
		this.player.id = roomId;
		this.player.roomId = roomId;
	}

	syncGameState(gameState: IGameState): void {
		const msg = MESSAGES_MAP.get(MessageMethodsEnum.SYNC)!;
		msg.init(this.player.id, gameState);
		this.sendGameMessage(msg);
	}
}
