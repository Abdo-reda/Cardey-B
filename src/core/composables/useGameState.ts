import { computed, ref } from 'vue';
import { GameState } from '@/core/models/gameState';
import type { IPlayer } from '../interfaces/playerInterface';
import type { ITeam } from '../interfaces/teamInterface';
import { ColorsEnum } from '../enums/colorsEnum';
import type { RoutesEnum } from '../enums/routesEnum';
import { GAME_PHASES, GAME_PHASES_DESCRIPTIONS } from '../enums/gamePhasesEnum';

const gameState = ref(new GameState());

export default function useGameState() {
	//---- computed values
	const isPaused = computed(() => gameState.value.isPaused);
	const currentRoute = computed<RoutesEnum>({
		get: () => gameState.value.currentRoute,
		set: (newRoute) => (gameState.value.currentRoute = newRoute)
	});
	const gameSettings = computed(() => gameState.value.gameSettings);
	const gamePhase = computed(() => gameState.value.gamePhase);
	const unreadyPlayers = computed<IPlayer[]>(() => {
		return gameState.value.players.filter((p) => !p.words.length);
	});
	const remainingWords = computed(() => gameState.value.words.remaining);

	//---- getters
	function getPlayer(id: string): IPlayer {
		return gameState.value.players.find((player) => player.id === id)!;
	}

	function getTeam(id: string): ITeam {
		return gameState.value.teams.find((team) => team.id === id)!;
	}

	//---- setters
	function updateGameState(newGameState: GameState): void {
		gameState.value = newGameState;
	}

	function togglePause(): void {
		gameState.value.isPaused = !gameState.value.isPaused;
	}

	function addPlayer(player: IPlayer) {
		gameState.value.players.push(player);
	}

	function scoreWord(teamId: string): void {
		const curWord = gameState.value.words.remaining.shift()!;
		gameState.value.words.scored.push(curWord);
		const team = getTeam(teamId);
		team.score++;
	}

	function skipWord(): void {
		const curWord = gameState.value.words.remaining.shift()!;
		gameState.value.words.skipped.push(curWord);
	}

	function initWords(): void {
		const allWords = gameState.value.players.flatMap((p) => p.words);
		const shuffledWords = [];
		while (allWords.length !== 0) {
			const randomIndex = Math.floor(Math.random() * allWords.length);
			const removedWord = allWords.splice(randomIndex, 1)[0];
			shuffledWords.push(removedWord);
		}
		gameState.value.words.remaining = shuffledWords;
	}

	function resetWords(): void {
		const remainingWords = [
			...gameState.value.words.remaining,
			...gameState.value.words.skipped
		];
		const shuffledWords: string[] = [];
		while (remainingWords.length !== 0) {
			const randomIndex = Math.floor(Math.random() * remainingWords.length);
			const removedWord = remainingWords.splice(randomIndex, 1)[0];
			shuffledWords.push(removedWord);
		}
		gameState.value.words.remaining = shuffledWords;
		gameState.value.words.skipped = [];

		// the next line should be in its won function?
		gameState.value.turns.currentPlayerIndex =
			(gameState.value.turns.currentPlayerIndex + 1) %
			gameState.value.turns.playersOrder.length;
	}

	function initTeams(): void {
		const colors = Object.values(ColorsEnum);
		for (let i = 0; i < gameSettings.value.numberOfTeams; i++) {
			const teamId = i + 1;
			gameState.value.teams.push({
				id: teamId.toString(),
				score: 0,
				color: colors[teamId],
				players: []
			});
		}
	}

	function initTurns(): void {
		const teamPlayersStack = gameState.value.teams.map((t) => t.players);
		const totalPlayers = gameState.value.teams.flatMap((t) => t.players).length;
		const totalTeamsCount = gameState.value.teams.length;
		const playersOrder = [];
		let currentTeamIndex = 0;
		let pushedPlayers = 0;
		while (pushedPlayers < totalPlayers) {
			const currentPlayer = teamPlayersStack[currentTeamIndex].shift();
			if (currentPlayer) {
				playersOrder.push(currentPlayer);
				pushedPlayers++;
			}
			currentTeamIndex = (currentTeamIndex + 1) % totalTeamsCount;
		}
		gameState.value.turns.playersOrder = playersOrder;
	}

	function nextPhase(): void {
		gameState.value.gamePhase.index++;
		const curPhase = GAME_PHASES[gameState.value.gamePhase.index];
		gameState.value.gamePhase.phase = curPhase;
		gameState.value.gamePhase.description = GAME_PHASES_DESCRIPTIONS.get(curPhase) ?? '';
	}

	return {
		isPaused,
		currentRoute,
		gamePhase,
		unreadyPlayers,
		remainingWords,
		updateGameState,
		togglePause,
		addPlayer,
		getPlayer,
		getTeam,
		scoreWord,
		skipWord,
		initTurns,
		initTeams,
		initWords,
		resetWords,
		nextPhase
	};
}
