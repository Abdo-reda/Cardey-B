import { BaseMessage } from '@/core/models/messages/baseMessage'
import { MessageMethodsEnum } from '@/core/enums/methodsEnum'
import router from '@/plugins/router'
import { RoutesEnum } from '@/core/enums/routesEnum'

export class DestroyGameMessage extends BaseMessage<MessageMethodsEnum.DESTROY_GAME> {
  constructor() {
    super(MessageMethodsEnum.DESTROY_GAME);
  }

  handle(): void {
    // Route back to home
    router.push({ name: RoutesEnum.HOME });
  }
}
