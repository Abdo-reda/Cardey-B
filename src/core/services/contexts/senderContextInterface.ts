import type { IHostSender } from '@/core/interfaces/host/messageSenders/hostSender.interface'
import type { IClientsSender } from '@/core/interfaces/client/messageSenders/clientSenderInterface'

export interface ISenderContext {
  getClientSender(): IClientsSender;
  getHostSender(): IHostSender;
}