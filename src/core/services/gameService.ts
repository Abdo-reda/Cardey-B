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
import { MESSAGES_MAP, type MethodsEnumTypeMap } from '../constants/recieversMap';
import router from '@/plugins/router';
import { RoutesEnum } from '../enums/routesEnum';
import { GAME_PHASES_DESCRIPTIONS, type GamePhasesEnum } from '../enums/gamePhasesEnum';
import { MethodsEnum } from '../enums/methodsEnum';

export class GameService implements IGameService {
	playerService!: IPlayerService;
	gameState: Ref<IGameState>;

	constructor() {
		this.gameState = ref(new GameState());
	}

	private executeAndSendMessage<E extends MethodsEnum>(method: E, data: MethodsEnumTypeMap[E]) {
		const msg = MESSAGES_MAP.get(method)!;
		msg.init(this.playerService.player.id, data);
		msg.handle(this.gameState);
		this.playerService.sendMessage(msg);
		this.playerService.syncGameState(this.gameState.value);
	}

	private executeAndHandleMessage<E extends MethodsEnum>(
		method: E,
		senderId: string,
		data: MethodsEnumTypeMap[E]
	) {
		const msg = MESSAGES_MAP.get(method)!;
		msg.init(senderId, data);
		msg.handle(this.gameState);
		this.playerService.syncGameState(this.gameState.value);
	}

	async joinGameAsync(): Promise<void> {
		await this.playerService.joinGameAsync();
		this.gameState.value.players.push(this.playerService.player);
		this.initTeams(this.gameState.value.gameSettings.numberOfTeams);
	}

	joinTeam(teamId: string): void {
		this.executeAndSendMessage(MethodsEnum.JOIN_TEAM, {
			teamId: teamId,
			playerId: this.playerService.player.id
		});
	}

	goToGamePhase(): void {
		this.switchAndUpdateRoute(RoutesEnum.GAME_PHASE);
		this.syncGameState();
	}

	goToStartGame(): void {
		this.switchAndUpdateRoute(RoutesEnum.BEGIN_GAME);
		this.syncGameState();
	}

	updateWords(reset: boolean = false, words: string[] = []): void {
		this.executeAndSendMessage(MethodsEnum.UPDATE_WORDS, {
			reset: reset,
			words: words
		});
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

	private syncGameState() {
		this.playerService.syncGameState(this.gameState.value);
	}

	private switchAndUpdateRoute(route: RoutesEnum) {
		this.gameState.value.currentRoute = route;
		router.push({ name: route });
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

	private handleMessage = (message: IMessage<any>): void => {
		console.log('--- handling message', message);
		this.executeAndHandleMessage(message.method, message.senderId, message.data);
	};
}
