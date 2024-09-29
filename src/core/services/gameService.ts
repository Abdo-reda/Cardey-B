import type { IGameService } from '../interfaces/gameServiceInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';
import router from '@/plugins/router';
import { RoutesEnum } from '../enums/routesEnum';
import { MessageMethodsEnum } from '../enums/methodsEnum';
import type { PlayWordType } from '../interfaces/messageInterfaces/playWordInterface';
import useGameState from '../composables/useGameState';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { ComputedRef, Reactive } from 'vue';
import usePlayer from '../composables/usePlayer';
import { MESSAGES_MAP } from '@/core/constants/messagesMap';

export class GameService implements IGameService {
	playerServiceContext!: ComputedRef<IPlayerService>;
	useGameState = useGameState();
	player!: Reactive<IPlayer>;

	constructor() {
		this.useGameState.onGameStateChange((newGameState) => {
			this.syncGameState(newGameState); //ENHANCEMENT: The downside: too many syncing. upside: don't need to worry about syncing when game state changes.
		});

		const { currentPlayer, playerService } = usePlayer();
		this.playerServiceContext = playerService;
		this.player = currentPlayer;
	}

	async joinGameAsync(): Promise<void> {
		await this.playerService.joinGameAsync();
		this.useGameState.addPlayer(this.player);
		this.useGameState.initTeams();
		this.switchAndUpdateRoute(RoutesEnum.LOBBY);
	}

	private get playerService() {
		return this.playerServiceContext.value;
	}

	joinTeam(teamId: string): void {
		this.playerService.executeAndSendMessage(MessageMethodsEnum.JOIN_TEAM, {
			teamId: teamId,
			playerId: this.player.id
		});
		this.player.teamId = teamId;
	}

	playWord(type: PlayWordType): void {
		this.playerService.executeAndSendMessage(MessageMethodsEnum.PLAY_WORD, {
			type: type,
			teamId: this.player.teamId,
			playerId: this.player.id
		});
	}

	updateTurn(isNewTurn: boolean): void {
		if (!this.player.isHost) {
			const msg = MESSAGES_MAP.get(MessageMethodsEnum.UPDATE_TURN)!;
			msg.init(this.player.id, {
				newTurn: isNewTurn
			});
			this.playerService.sendGameMessage(msg);
		} else {
			this.playerService.executeAndSendMessage(MessageMethodsEnum.UPDATE_TURN, {
				newTurn: isNewTurn
			});
		}
	}

	goToNextGamePhase(): void {
		this.playerService.executeAndSendMessage(MessageMethodsEnum.UPDATE_PHASE, undefined);
	}

	goToBeginGame(): void {
		this.switchAndUpdateRoute(RoutesEnum.BEGIN_GAME);
		// this.syncGameState();
	}

	goToPlayingWord(): void {
		this.useGameState.initWords();
		this.useGameState.initTurns();
		this.useGameState.nextTurn();
		this.switchAndUpdateRoute(RoutesEnum.PLAYING_WORD);
		// this.syncGameState();
	}

	updateWords(reset: boolean = false, words: string[] = []): void {
		this.playerService.executeAndSendMessage(MessageMethodsEnum.UPDATE_WORDS, {
			reset: reset,
			words: words
		});
	}

	togglePause(): void {
		this.useGameState.togglePause();
		// this.syncGameState();
	}

	restartGame(): void {
		this.useGameState.restartGame();
		this.switchAndUpdateRoute(RoutesEnum.LOBBY);
	}

	testMessage(message: string): void {
		this.playerService.executeAndSendMessage(MessageMethodsEnum.TEST_MESSAGE, message);
	}

	quitGame(): void {
		this.playerService.disconnect();
		router.push({ name: RoutesEnum.HOME });
	}

	private syncGameState(gameState: IGameState): void {
		this.playerService.syncGameState(gameState);
	}

	private switchAndUpdateRoute(route: RoutesEnum) {
		console.log('-- switching and updating route', route);
		this.useGameState.currentRoute.value = route;
		router.push({ name: route });
	}

	randomiseTeams() {
		this.testMessage('Shuffeling Teams!');
		this.useGameState.randomiseTeams();
	}
}
