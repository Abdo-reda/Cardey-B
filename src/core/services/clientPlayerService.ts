import type { IPlayer } from '../interfaces/playerInterface';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IClientService } from '../interfaces/clientServiceInterface';
import { MessageMethodsEnum } from '../enums/methodsEnum';
import { MESSAGES_MAP } from '../constants/messagesMap';
import { BasePlayerService } from './basePlayerService';
import { message } from 'ant-design-vue'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'
import type { ChannelsEnum } from '../enums/channelsEnum';

export class ClientPlayerService extends BasePlayerService<IClientService> {
	constructor(clientService: IClientService, player: IPlayer) {
		super(clientService, player);
		// this.setupListeners(); hopefully I don't need to do this
	}

	setupListeners(): void {
		console.log('--- setting up client listeners');

		this.service.onRecievedMessage = (channel: ChannelsEnum, message: IMessage<any>) => {
			console.log('----- Client recieved message from host: ', message);
			this.handleMessage(message);
			// callback(message);
		};

		this.service.onDataChannelOpen = () => {
			console.log('----- Client on Data channel open');
			this.sendJoinGame();
		};

		this.service.onDataChannelClosed = () => {
			this.disconnect();
			router.push({ name: RoutesEnum.HOME });
			message.error('Lost Connection To Host!');
		};
	}

	sendMessage<E extends MessageMethodsEnum>(message: IMessage<E>): void {
		console.log('---- Client sending message: ', message);
		this.service.sendMessageToHost(message);
	}

	async joinGameAsync(): Promise<void> {
		const id = await this.service.createJoinRequestAsync(this.player.roomId);
		this.player.id = id;
	}

	private sendJoinGame(): void {
		const msg = MESSAGES_MAP.get(MessageMethodsEnum.JOIN_GAME)!;
		msg.init(this.player.id, this.player);
		this.sendMessage(msg);
	}
}
