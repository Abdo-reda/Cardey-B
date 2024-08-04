import { ref, type Reactive, type Ref } from 'vue';
import type { IGameService } from '../interfaces/gameServiceInterface';
import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import { GameState } from '../models/gameState';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import { ColorsEnum } from '../enums/colorsEnum';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import { HostPlayerService } from './hostPlayerService';
import { HostService } from './hostService';
import { ClientPlayerService } from './clientPlayerService';
import { ClientService } from './clientService';
import { RECIEVERS_MAP } from '../constants/recieversMap';
import router from '@/plugins/router';
import { RoutesEnum } from '../enums/routesEnum';
import { GAME_PHASES_DESCRIPTIONS, type GamePhasesEnum } from '../enums/gamePhasesEnum';

export class GameService implements IGameService {
	playerService!: IPlayerService;
	gameState: Ref<IGameState>;

	constructor() {
		this.gameState = ref(new GameState());
	}

	async joinGameAsync(): Promise<void> {
		console.log('------join game method - gameState: ', this.gameState.value);
		await this.playerService.joinGameAsync();
		this.gameState.value.players.push(this.playerService.player);
		this.initTeams(this.gameState.value.gameSettings.numberOfTeams);
	}

	joinTeam(teamId: string): void {
		const player = this.playerService.player;
		this.pushPlayerToTeam(player, teamId);
		this.playerService.joinTeam(this.gameState.value, {
			teamId: teamId,
			playerId: player.id
		});
	}

	startGame(): void {
		this.gameState.value.currentRoute = RoutesEnum.GAME_PHASE;
		router.push({ name: RoutesEnum.GAME_PHASE });
		this.playerService.syncGameState(this.gameState.value);
	}

	setPlayerService(player: IPlayer) {
		if (player.isHost) {
			this.playerService = new HostPlayerService(new HostService(), player);
		} else {
			this.playerService = new ClientPlayerService(new ClientService(), player);
		}
		this.playerService.setupListeners(this.handleMessage);
	}

	getSettings(): IGameSettings {
		return this.gameState.value.gameSettings;
	}

	getCurrentPlayer(): Reactive<IPlayer> {
		return this.playerService.player;
	}

	getPlayer(playerId: string): IPlayer {
		return this.gameState.value.players.find((player) => player.id === playerId)!;
	}

	private switchPhase(phase: GamePhasesEnum): void {
		this.gameState.value.gamePhase.phase = phase;
		this.gameState.value.gamePhase.description = GAME_PHASES_DESCRIPTIONS.get(phase)!;
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

	private handleMessage = (message: IMessage<any>): void => {
		console.log('--- handling message', message);
		RECIEVERS_MAP.get(message.method)!.handle(this.gameState, message);
		this.playerService.syncGameState(this.gameState.value);
	};
}
