import { reactive, type Reactive } from 'vue';
import type { IPlayer } from '../interfaces/playerInterface';
import { AvatarsEnum } from '../enums/avatarsEnum';
import type { IMessage } from '../interfaces/messageInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';
import type { IClientService } from '../interfaces/clientServiceInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';

export class PlayerService implements IPlayerService {
	player: Reactive<IPlayer>;
	hostService: IHostService;
	clientService: IClientService;

	constructor(hostService: IHostService, clientService: IClientService) {
		this.player = reactive({
			id: '',
			name: '',
			avatar: AvatarsEnum.BIRD,
			isHost: false,
			roomId: '',
			teamId: ''
		});
		this.hostService = hostService;
		this.clientService = clientService;
	}

	sendMessage<T>(message: IMessage<T>): void {
		if (this.player.isHost) {
			this.hostService.sendMessageToAllExcept(message, []);
		} else {
			this.clientService.sendMessageToHost(message);
		}
	}

	async joinGameAsync(): Promise<void> {
		const id = await this.clientService.createJoinRequestAsync(this.player.roomId);
		this.player.id = id;
	}
}
