import type { InjectionKey } from 'vue';
import type { IHostService } from '../interfaces/hostServiceInterface';
import type { IClientService } from '../interfaces/clientServiceInterface';

export const HostServiceKey = Symbol() as InjectionKey<IHostService>;
export const ClientServiceKey = Symbol() as InjectionKey<IClientService>;
