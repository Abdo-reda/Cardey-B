import { MessageMethodsEnum } from '../enums/methodsEnum';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IJoinTeam } from '../interfaces/messageInterfaces/joinTeamInterface';
import type { IMessage } from '../interfaces/messageInterfaces/messageInterface';
import type { IPlayerWords } from '../interfaces/messageInterfaces/playerWordsInterface';
import type { IPlayWord } from '../interfaces/messageInterfaces/playWordInterface';
import type { IUpdateTurn } from '../interfaces/messageInterfaces/updateTurnInterface';
import type { IPlayer } from '../interfaces/playerInterface';

export const MESSAGES_MAP = new Map<MessageMethodsEnum, IMessage<any>>([]);

export type MessageMethodPayloadMap = {
	[MessageMethodsEnum.JOIN_GAME]: IPlayer;
	[MessageMethodsEnum.JOIN_TEAM]: IJoinTeam;
	[MessageMethodsEnum.SYNC]: IGameState;
	[MessageMethodsEnum.UPDATE_WORDS]: IPlayerWords;
	[MessageMethodsEnum.PLAY_WORD]: IPlayWord;
	[MessageMethodsEnum.UPDATE_TURN]: IUpdateTurn;
	[MessageMethodsEnum.UPDATE_PHASE]: void;
};
