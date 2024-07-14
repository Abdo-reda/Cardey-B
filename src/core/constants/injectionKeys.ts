import type { InjectionKey } from 'vue';
import type { IHostService } from '../interfaces/hostServiceInterface';

export const HostServiceKey = Symbol() as InjectionKey<IHostService>;
