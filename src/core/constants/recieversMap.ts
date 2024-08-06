import { MethodsEnum } from '../enums/methodsEnum';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IJoinTeam } from '../interfaces/messageInterfaces/joinTeamInterface';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IPlayerWords } from '../interfaces/messageInterfaces/playerWordsInterface';
import type { IPlayer } from '../interfaces/playerInterface';

export const MESSAGES_MAP = new Map<MethodsEnum, IMessage<any>>([]);

export type MethodsEnumTypeMap = {
	[MethodsEnum.JOIN_GAME]: IPlayer;
	[MethodsEnum.JOIN_TEAM]: IJoinTeam;
	[MethodsEnum.SYNC]: IGameState;
	[MethodsEnum.UPDATE_WORDS]: IPlayerWords;
};

//there will be an issue if the recievers will do something else, 5er enaha te5ayer fe el state
