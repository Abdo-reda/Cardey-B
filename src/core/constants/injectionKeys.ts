import type { InjectionKey } from 'vue';
import type { IHostService } from '../interfaces/hostServiceInterface';
import type { IClientService } from '../interfaces/clientServiceInterface';
import type { IGameService } from '../interfaces/gameServiceInterface';
import type { IPlayerService } from '../interfaces/playerServiceInterface';

export const HostServiceKey = Symbol() as InjectionKey<IHostService>;
export const ClientServiceKey = Symbol() as InjectionKey<IClientService>;
export const GameServiceKey = Symbol() as InjectionKey<IGameService>;
export const HostPlayerServiceKey = Symbol() as InjectionKey<IPlayerService>;
export const ClientPlayerServiceKey = Symbol() as InjectionKey<IPlayerService>;
