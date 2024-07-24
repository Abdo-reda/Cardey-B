import { reactive, type Reactive } from 'vue';
import type { IPlayer } from '../../../interfaces/game/entities/playerInterface';
import { AvatarsEnum } from '../../../enums/avatarsEnum';
import type { IMessage } from '../../../interfaces/common/messageInterface';
import type { IHostService } from '../../../interfaces/host/webRTC/hostServiceInterface';
import type { IClientService } from '../../../interfaces/client/webRTC/clientServiceInterface';
import type { IPlayerService } from '../../../interfaces/game/player/playerServiceInterface';

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
