import { MethodsEnum } from '../enums/methodsEnum';
import type { IReciever } from '../interfaces/recieverInterface';
import { JoinGameReciever } from '../models/recievers/joinGameReciever';
import { JoinTeamReciever } from '../models/recievers/JoinTeamReciever';
import { SyncReciever } from '../models/recievers/syncReciever';

export const RECIEVERS_MAP = new Map<MethodsEnum, IReciever<any>>([
	[MethodsEnum.JOIN_GAME, new JoinGameReciever()],
	[MethodsEnum.JOIN_TEAM, new JoinTeamReciever()],
	[MethodsEnum.SYNC, new SyncReciever()]
]);
