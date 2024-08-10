import { MethodsEnum } from '../enums/methodsEnum';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IJoinTeam } from '../interfaces/messageInterfaces/joinTeamInterface';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IPlayerWords } from '../interfaces/messageInterfaces/playerWordsInterface';
import type { IPlayWord } from '../interfaces/messageInterfaces/playWordInterface';
import type { IUpdateTurn } from '../interfaces/messageInterfaces/updateTurnInterface';
import type { IPlayer } from '../interfaces/playerInterface';

export const MESSAGES_MAP = new Map<MethodsEnum, IMessage<any>>([]);

export type MethodsEnumTypeMap = {
	[MethodsEnum.JOIN_GAME]: IPlayer;
	[MethodsEnum.JOIN_TEAM]: IJoinTeam;
	[MethodsEnum.SYNC]: IGameState;
	[MethodsEnum.UPDATE_WORDS]: IPlayerWords;
	[MethodsEnum.PLAY_WORD]: IPlayWord;
	[MethodsEnum.UPDATE_TURN]: IUpdateTurn;
};

//there will be an issue if the recievers will do something else, 5er enaha te5ayer fe el state
