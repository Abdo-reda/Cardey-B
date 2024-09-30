import { computed, ref, watch } from 'vue';
import { GameState } from '@/core/models/gameState';
import type { IPlayer } from '../interfaces/playerInterface';
import type { ITeam } from '../interfaces/teamInterface';
import { ColorsEnum } from '../enums/colorsEnum';
import { RoutesEnum } from '../enums/routesEnum';
import { GAME_PHASES, GAME_PHASES_DESCRIPTIONS } from '../enums/gamePhasesEnum';
import type { IGameState } from '../interfaces/gameStateInterface';

const gameState = ref(new GameState());

//---- computed values
const isPaused = computed(() => gameState.value.isPaused);
const currentRoute = computed<RoutesEnum>({
	get: () => gameState.value.currentRoute,
	set: (newRoute) => (gameState.value.currentRoute = newRoute)
});
const gamePhaseDetails = computed(() => gameState.value.gamePhase);
const currentPhase = computed(() => gameState.value.gamePhase.phase);
const unreadyPlayers = computed<IPlayer[]>(() => {
	return gameState.value.players.filter((p) => !p.words.length);
});
const teams = computed(() => gameState.value.teams);
const playersNotInATeam = computed(() => {
	return gameState.value.players.filter((p) => !p.teamId);
});

const activeWord = computed<string>(() => {
	return gameState.value.words.remaining[0];
});
const remainingWords = computed(() => gameState.value.words.remaining);
const skippedWords = computed(() => gameState.value.words.skipped);
const currentPlayerTurn = computed(() => {
	const currentPlayerId =
		gameState.value.turns.playersOrder[gameState.value.turns.currentPlayerIndex];
	return gameState.value.players.find((player) => player.id === currentPlayerId)!;
});
const isNewTurn = computed({
	get: () => gameState.value.turns.newTurn,
	set: (value) => (gameState.value.turns.newTurn = value)
});

const teamLeaderboard = computed(() => {
	return gameState.value.teams.sort((a, b) => b.score - a.score);
});

//--- settings
const gameSettings = computed(() => gameState.value.gameSettings);
const wordsPerPlayer = computed({
	get: () => gameState.value.gameSettings.wordsPerPlayer,
	set: (value) => (gameState.value.gameSettings.wordsPerPlayer = value)
});
const numberOfPlayers = computed({
	get: () => gameState.value.gameSettings.numberOfPlayers,
	set: (value) => (gameState.value.gameSettings.numberOfPlayers = value)
});
const numberOfTeams = computed({
	get: () => gameState.value.gameSettings.numberOfTeams,
	set: (value) => (gameState.value.gameSettings.numberOfTeams = value)
});
const timePerRound = computed({
	get: () => gameState.value.gameSettings.timePerRound,
	set: (value) => (gameState.value.gameSettings.timePerRound = value)
});

const playerNames = computed(() => gameState.value.players.map((p) => p.name));

export default function useGameState() {
	let onGameStateChangeHandler: ((newGameState: GameState) => void) | undefined;

	watch(
		gameState,
		(newGameState) => {
			if (onGameStateChangeHandler) {
				onGameStateChangeHandler(newGameState);
			}
		},
		{ deep: true }
	);

	//---- getters
	function getGameState(): IGameState {
		return gameState.value;
	}

	function getPlayer(id: string): IPlayer {
		return gameState.value.players.find((player) => player.id === id)!;
	}

	function getTeam(id: string): ITeam {
		return gameState.value.teams.find((team) => team.id === id)!;
	}

	function addPlayerToTeam(playerId: string, newTeamId: string): void {
		const player = getPlayer(playerId);
		const currentTeam = player.teamId;

		if (currentTeam) {
			const oldTeam = gameState.value.teams.find((t) => t.id === currentTeam)!;
			oldTeam.players = oldTeam.players.filter((playerId) => playerId !== player.id);
		}

		const team = gameState.value.teams.find((t) => t.id === newTeamId)!;
		team.players.push(player.id);
		player.teamId = newTeamId;
	}

	//---- setters
	function onGameStateChange(callback: (newGameState: GameState) => void) {
		onGameStateChangeHandler = callback;
	}

	function syncGameState(newGameState: GameState): void {
		gameState.value = newGameState;
	}

	function togglePause(): void {
		gameState.value.isPaused = !gameState.value.isPaused;
	}

	function addPlayer(player: IPlayer) {
		if (getPlayer(player.id)) return;
		gameState.value.players.push(player);
	}

	function setPlayerWords(playerId: string, words: string[]): void {
		const player = getPlayer(playerId);
		player.words = words;
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
	}

	function nextTurn(): void {
		gameState.value.turns.currentPlayerIndex =
			(gameState.value.turns.currentPlayerIndex + 1) %
			gameState.value.turns.playersOrder.length;
		gameState.value.turns.newTurn = true;
	}

	function initTeams(): void {
		gameState.value.teams = [];
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
		if (gameState.value.turns.playersOrder.length) return;
		const teamPlayersStack = gameState.value.teams.map((t) => [...t.players]);
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

	function restartGame(): void {
		const oldSetting = gameState.value.gameSettings;
		const oldPlayers = gameState.value.players;
		const oldTeams = gameState.value.teams;
		gameState.value = new GameState();
		gameState.value.gameSettings = oldSetting;
		gameState.value.players = oldPlayers;
		gameState.value.teams = oldTeams.map((t) => {
			t.score = 0;
			return t;
		});
	}

	function obliteratePlayer(playerId: string): void {
		// Update game state
		// Remove from players array
		// If Current player, new turn

		// Update turn if i am current player
		if (currentPlayerTurn.value != null && currentPlayerTurn.value.id === playerId) {
			nextTurn();
		}

		// Remove from playersOrder
		gameState.value.turns.playersOrder = gameState.value.turns.playersOrder.filter(
			(player) => player !== playerId
		);

		// Remove from teams
		gameState.value.teams.forEach((team) => {
			team.players = team.players.filter((player) => player !== playerId);
		});

		// Remove from players
		gameState.value.players = gameState.value.players.filter(
			(player) => player.id !== playerId
		);
	}

	function terminateGame(): void {
		gameState.value = new GameState();
	}

	function randomiseTeams(): void {
		const players = gameState.value.players;
		const teams = gameState.value.teams;

		const shuffledPlayers = players.sort(() => Math.random() - 0.5);

		teams.forEach((team) => (team.players = []));

		shuffledPlayers.forEach((player, index) => {
			const teamIndex = index % teams.length; // Assign players to teams in round-robin fashion
			teams[teamIndex].players.push(player.id);
			player.teamId = teams[teamIndex].id;
		});
	}

	return {
		activeWord,
		teams,
		currentPlayerTurn,
		isNewTurn,
		isPaused,
		playersNotInATeam,
		currentRoute,
		wordsPerPlayer,
		numberOfPlayers,
		numberOfTeams,
		timePerRound,
		gamePhaseDetails,
		currentPhase,
		teamLeaderboard,
		unreadyPlayers,
		remainingWords,
		skippedWords,
		playerNames,
		onGameStateChange,
		getGameState,
		syncGameState,
		togglePause,
		setPlayerWords,
		addPlayer,
		nextTurn,
		addPlayerToTeam,
		getPlayer,
		getTeam,
		scoreWord,
		skipWord,
		initTurns,
		restartGame,
		initTeams,
		initWords,
		resetWords,
		nextPhase,
		obliteratePlayer,
		terminateGame,
		randomiseTeams
	};
}
