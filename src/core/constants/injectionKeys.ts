import type { InjectionKey } from 'vue';
import type { IHostService } from '../interfaces/host/webRTC/hostServiceInterface';
import type { IClientService } from '../interfaces/client/webRTC/clientServiceInterface';
import type { IGameService } from '../interfaces/game/gameState/gameServiceInterface';
import type { IPlayerService } from '../interfaces/game/player/playerServiceInterface';

export const HostServiceKey = Symbol() as InjectionKey<IHostService>;
export const ClientServiceKey = Symbol() as InjectionKey<IClientService>;
export const GameServiceKey = Symbol() as InjectionKey<IGameService>;
export const PlayerServiceKey = Symbol() as InjectionKey<IPlayerService>;
