import type { Reactive } from 'vue';
import type { IPlayer } from './playerInterface';

export interface IPlayerService {
	player: Reactive<IPlayer>;
}
