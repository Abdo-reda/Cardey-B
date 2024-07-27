import { reactive, type Reactive } from 'vue';
import type { IPlayer } from '../interfaces/playerInterface';
import type { IMessage } from '../interfaces/messageInterface';
import type { IClientService } from '../interfaces/clientServiceInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';

export class ClientPlayerService implements IPlayerService {
	player: Reactive<IPlayer>;
	clientService: IClientService;

	constructor(clientService: IClientService, player: IPlayer) {
		this.player = reactive(player);
		this.clientService = clientService;
	}
	setupListeners() : void {
		this.clientService.onRecievedMessage = (message: IMessage<any>) => {
			console.log('--- Message recieved from host: ', message);
			console.log('==== client', message.method);
			// if (message.method === MethodsEnum.SYNC) {
			// 	this.syncLocalGameState(message.data);
			// }
		};

		this.clientService.onDataChannelOpen = () => {
			console.log("----- Client on Data channel open")
			// this.playerService.sendMessage<IPlayer>({
			// 	method: MethodsEnum.JOIN_GAME,
			// 	senderId: this.playerService.player.id,
			// 	data: this.playerService.player
			// });
		};
	}

	sendMessage<T>(message: IMessage<T>): void {
		this.clientService.sendMessageToHost(message);
	}

	async joinGameAsync(): Promise<void> {
		const id = await this.clientService.createJoinRequestAsync(this.player.roomId);
		this.player.id = id;
	}
}
