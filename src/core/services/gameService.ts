import { reactive, watchEffect, type Reactive } from 'vue';
import type { IClientService } from '../interfaces/clientServiceInterface';
import type { IGameService } from '../interfaces/gameServiceInterface';
import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';
import { GameState } from '../models/gameState';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IPlayer } from '../interfaces/playerInterface';

export class GameService implements IGameService {
	hostService: IHostService;
	clientService: IClientService;
	playerService: IPlayerService;
	gameState: Reactive<IGameState>; //make it reactive? ¯\_(ツ)_/¯

	constructor(
		hostService: IHostService,
		clientService: IClientService,
		playerService: IPlayerService
	) {
		this.hostService = hostService;
		this.clientService = clientService;
		this.playerService = playerService;
		this.gameState = reactive(new GameState());
		this.setupHostService();
	}

	async createGameAsync(gameSettings: IGameSettings): Promise<void> {
		this.gameState.gameSettings = gameSettings;
		const roomId = await this.hostService.createNewRoomAsync();
		this.playerService.player.id = roomId;
		this.playerService.player.isHost = true;
		this.gameState.players.push(this.playerService.player);
	}

	private setupHostService(): void {
		this.hostService.onPlayerJoinedDataChannel = (playerId: string) => {
			this.hostService.sendMessageToPlayers('Welcome to the game!', [playerId]);
			this.hostService.sendMessageToPlayers(JSON.stringify(this.gameState.gameSettings), [
				playerId
			]);
		};
	}

	getSettings(): IGameSettings {
		return this.gameState.gameSettings;
	}

	addPlayer(player: IPlayer) {
		this.gameState.players.push(player);
		//sync game state
	}

	// getPlayer(): IPlayer {
	// 	return this.gameState.teams.flatMap((team) => team.players).find((player) => player.isHost);
	// }
}
