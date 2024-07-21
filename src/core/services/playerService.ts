import { reactive, type Reactive } from 'vue';
import type { IPlayer } from '../interfaces/playerInterface';
import { AvatarsEnum } from '../enums/avatarsEnum';

export class PlayerService {
	player: Reactive<IPlayer>;

	constructor() {
		this.player = reactive({
			id: '',
			name: '',
			avatar: AvatarsEnum.BIRD,
			isHost: false,
			roomId: ''
		});
	}
}
