import type { PlayWordType } from './messageInterfaces/playWordInterface';

export interface IGameService {
	togglePause(): void;
	joinGameAsync: () => void;
	joinTeam: (teamId: string) => void;
	playWord: (type: PlayWordType) => void;
	updateTurn: (isNewTurn: boolean) => void;
	goToNextGamePhase: () => void;
	goToBeginGame: () => void;
	randomiseTeams: () => void;
	goToPlayingWord: () => void;
	restartGame: () => void;
	updateWords: (reset: boolean, words: string[]) => void;
	testMessage: (message: string) => void;
	quitGame: () => void;
}
