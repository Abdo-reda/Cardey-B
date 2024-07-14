import type { IClientService } from '../interfaces/clientServiceInterface';
import type { IGameService } from '../interfaces/gameServiceInterface';
import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';

export class GameService implements IGameService {
	hostService: IHostService;
	clientService: IClientService;
	gameSettings?: IGameSettings;
	//gameState
	//gameSettings

	constructor(hostService: IHostService, clientService: IClientService) {
		this.hostService = hostService;
		this.clientService = clientService;
		this.setupHostService();
	}

	async CreateGameAsync(gameSettings: IGameSettings): Promise<void> {
		this.gameSettings = gameSettings;
		await this.hostService.createNewRoomAsync();
	}

	private setupHostService(): void {
		this.hostService.onPlayerJoinedDataChannel = (playerId: string) => {
			this.hostService.sendMessageToPlayers('Welcome to the game!', [playerId]);
			this.hostService.sendMessageToPlayers(JSON.stringify(this.gameSettings), [playerId]);
		};
	}
}
