import { ref, type Reactive, type Ref } from 'vue';
import type { IGameService } from '../interfaces/gameServiceInterface';
import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import { GameStateService } from '../services/gameStateService';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import { ColorsEnum } from '../enums/colorsEnum';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import { HostPlayerService } from './hostPlayerService';
import { HostService } from './hostService';
import { ClientPlayerService } from './clientPlayerService';
import { ClientService } from './clientService';
import { MESSAGES_MAP, type MessageMethodPayloadMap } from '../constants/messagesMap';
import router from '@/plugins/router';
import { RoutesEnum } from '../enums/routesEnum';
import { GAME_PHASES_DESCRIPTIONS, type GamePhasesEnum } from '../enums/gamePhasesEnum';
import { MessageMethodsEnum } from '../enums/methodsEnum';
import type { PlayWordType } from '../interfaces/messageInterfaces/playWordInterface';

export class GameService implements IGameService {
	playerService!: IPlayerService;
	gameState: Ref<IGameState>;

	constructor() {
		this.gameState = ref(new GameStateService());
	}

	private executeAndSendMessage<E extends MessageMethodsEnum>(
		method: E,
		data: MessageMethodPayloadMap[E]
	) {
		const msg = MESSAGES_MAP.get(method)!;
		msg.init(this.playerService.player.id, data);
		msg.handle(this.gameState);
		this.playerService.sendMessage(msg);
		this.playerService.syncGameState(this.gameState.value);
	}

	private executeAndHandleMessage<E extends MessageMethodsEnum>(
		method: E,
		senderId: string,
		data: MessageMethodPayloadMap[E]
	) {
		const msg = MESSAGES_MAP.get(method)!;
		msg.init(senderId, data);
		msg.handle(this.gameState);
		this.syncGameState();
	}

	async joinGameAsync(): Promise<void> {
		await this.playerService.joinGameAsync();
		this.gameState.value.players.push(this.playerService.player);
		this.initTeams(this.gameState.value.gameSettings.numberOfTeams);
	}

	joinTeam(teamId: string): void {
		this.executeAndSendMessage(MessageMethodsEnum.JOIN_TEAM, {
			teamId: teamId,
			playerId: this.playerService.player.id
		});
		this.playerService.player.teamId = teamId;
	}

	playWord(type: PlayWordType): void {
		this.executeAndSendMessage(MessageMethodsEnum.PLAY_WORD, {
			type: type,
			teamId: this.playerService.player.teamId,
			playerId: this.playerService.player.id
		});
	}

	updateTurn(): void {
		this.executeAndSendMessage(MessageMethodsEnum.UPDATE_TURN, {});
	}

	goToGamePhase(): void {
		this.switchAndUpdateRoute(RoutesEnum.GAME_PHASE);
		this.syncGameState();
	}

	goToBeginGame(): void {
		this.switchAndUpdateRoute(RoutesEnum.BEGIN_GAME);
		this.syncGameState();
	}

	goToPlayingWord(): void {
		this.initWords();
		this.initTurns();
		this.switchAndUpdateRoute(RoutesEnum.PLAYING_WORD);
		this.syncGameState();
	}

	updateWords(reset: boolean = false, words: string[] = []): void {
		this.executeAndSendMessage(MessageMethodsEnum.UPDATE_WORDS, {
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

	private initWords() {
		const allWords = this.gameState.value.players.flatMap((p) => p.words);
		const shuffledWords = [];
		while (allWords.length !== 0) {
			const randomIndex = Math.floor(Math.random() * allWords.length);
			const removedWord = allWords.splice(randomIndex, 1)[0];
			shuffledWords.push(removedWord);
		}
		this.gameState.value.words.remaining = shuffledWords;
	}

	private initTurns() {
		const teamPlayersStack = this.gameState.value.teams.map((t) => t.players);
		const totalPlayers = this.gameState.value.teams.flatMap((t) => t.players).length;
		const totalTeamsCount = this.gameState.value.teams.length;
		const playerOrder = [];
		let currentTeamIndex = 0;
		let pushedPlayers = 0;
		while (pushedPlayers < totalPlayers) {
			const currentPlayer = teamPlayersStack[currentTeamIndex].shift();
			if (currentPlayer) {
				playerOrder.push(currentPlayer);
				pushedPlayers++;
			}
			currentTeamIndex = (currentTeamIndex + 1) % totalTeamsCount;
		}
		this.gameState.value.turns.playersOrder = playerOrder;
	}

	private syncGameState() {
		console.log('--- syncing game state', this.gameState.value);
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
