import { ref, type Ref } from 'vue';
import type { IClientService } from '../interfaces/clientServiceInterface';
import type { IGameService } from '../interfaces/gameServiceInterface';
import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IHostService } from '../interfaces/hostServiceInterface';
import { GameState } from '../models/gameState';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import { ColorsEnum } from '../enums/colorsEnum';
import type { IMessage } from '../interfaces/messageInterface';
import { MethodsEnum } from '../enums/methodsEnum';
import type { IJoinTeam } from '../interfaces/dataMessagesInterfaces/joinTeamInterface';

export class GameService implements IGameService {
	hostService: IHostService;
	clientService: IClientService;
	playerService: IPlayerService;
	gameState: Ref<IGameState>;

	constructor(
		hostService: IHostService,
		clientService: IClientService,
		playerService: IPlayerService
	) {
		this.hostService = hostService;
		this.clientService = clientService;
		this.playerService = playerService;
		this.gameState = ref(new GameState());
		this.setupListenerHost();
		this.setupListnerClient();
		// this.initTeams(5); //todo: remove this
	}

	joinTeam(teamId: string): void {
		const player = this.playerService.player;
		this.pushPlayerToTeam(player, teamId);
		if (player.isHost) {
			this.sendSyncGameState();
		} else {
			this.playerService.sendMessage<IJoinTeam>({
				method: MethodsEnum.JOIN_TEAM,
				senderId: player.id,
				data: {
					playerId: player.id,
					teamId: teamId
				}
			});
		}
	}

	private pushPlayerToTeam(player: IPlayer, teamId: string): void {
		const currentTeam = player.teamId;

		if (currentTeam) {
			const oldTeam = this.gameState.value.teams.find((t) => t.id === currentTeam)!;
			oldTeam.players = oldTeam.players.filter((playerId) => playerId !== player.id);
		}

		const team = this.gameState.value.teams.find((t) => t.id === teamId);
		team?.players.push(player.id);
		player.teamId = teamId;
	}

	async createGameAsync(gameSettings: IGameSettings): Promise<void> {
		this.gameState.value.gameSettings = gameSettings;
		const roomId = await this.hostService.createNewRoomAsync();
		this.playerService.player.id = roomId;
		this.playerService.player.isHost = true;
		this.gameState.value.players.push(this.playerService.player);
		this.initTeams(gameSettings.numberOfTeams);
	}

	private setupListenerHost(): void {
		this.hostService.onRecievedMessage = (playerId: string, message: IMessage<any>) => {
			console.log('--- Message recieved from player (client): ', playerId, message);
			console.log('==== host', message.method);
			if (message.method === MethodsEnum.JOIN_GAME) {
				this.playerJoinedGame(message.data);
			}

			if (message.method === MethodsEnum.JOIN_TEAM) {
				this.pushPlayerToTeam(
					this.gameState.value.players.find(
						(player) => player.id === message.data.playerId
					)!,
					message.data.teamId
				);
			}
			this.sendSyncGameState();
		};
	}

	private setupListnerClient(): void {
		this.clientService.onRecievedMessage = (message: IMessage<any>) => {
			console.log('--- Message recieved from host: ', message);
			console.log('==== client', message.method);
			if (message.method === MethodsEnum.SYNC) {
				this.syncLocalGameState(message.data);
			}
		};

		this.clientService.onDataChannelOpen = () => {
			this.playerService.sendMessage<IPlayer>({
				method: MethodsEnum.JOIN_GAME,
				senderId: this.playerService.player.id,
				data: this.playerService.player
			});
		};
	}

	private playerJoinedGame(data: IPlayer): void {
		console.log('==== beforeeeee player joining game', data, this.gameState.value);
		//we need to update game state ... player service? w need game service? circular dependency?
		this.gameState.value.players.push(data);
		console.log('==== afterplayer joining game', data, this.gameState.value);
	}

	//TODO: move it to host service
	private sendSyncGameState(): void {
		const message: IMessage<IGameState> = {
			senderId: this.playerService.player.id,
			method: MethodsEnum.SYNC,
			data: this.gameState.value
		};
		this.hostService.sendMessageToAllExcept(message, []);
	}

	private syncLocalGameState(data: IGameState): void {
		console.log('--- client before', this.gameState, data);
		this.gameState.value = data;
		console.log('--- client after', this.gameState);
	}

	getSettings(): IGameSettings {
		return this.gameState.value.gameSettings;
	}

	addPlayer(player: IPlayer) {
		this.gameState.value.players.push(player);
		//sync game state
	}

	getPlayer(playerId: string): IPlayer {
		return this.gameState.value.players.find((player) => player.id === playerId)!;
	}

	private initTeams(numberOfTeams: number): void {
		const colors = Object.values(ColorsEnum);
		for (let i = 0; i < numberOfTeams; i++) {
			const teamId = i + 1;
			this.gameState.value.teams.push({
				id: teamId.toString(),
				score: 0,
				color: colors[teamId],
				players: []
			});
		}
	}

	// getPlayer(): IPlayer {
	// 	return this.gameState.teams.flatMap((team) => team.players).find((player) => player.isHost);
	// }
}
