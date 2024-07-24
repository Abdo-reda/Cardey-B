import type { ISenderContext } from '@/core/services/contexts/senderContextInterface'
import type { IClientsSender } from '@/core/interfaces/client/messageSenders/clientSenderInterface'
import type { IHostSender } from '@/core/interfaces/host/messageSenders/hostSender.interface'
import { HostSender } from '@/core/services/host/messageSenders/hostSenderService'
import { ClientSender } from '@/core/services/client/messageSenders/clientSenderService'

export class SenderContext implements ISenderContext{
  getClientSender(): IClientsSender {
    return new ClientSender();
  }

  getHostSender(): IHostSender {
    return new HostSender();
  }
}
