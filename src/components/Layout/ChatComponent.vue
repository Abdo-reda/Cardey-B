<script setup lang="ts">
import useGameState from '@/core/composables/useGameState';
import { MessageOutlined, SendOutlined, IeOutlined, CommentOutlined } from '@ant-design/icons-vue';
import { Button, Comment, Divider, Drawer, FloatButton, Mentions, Tooltip, TypographyParagraph, TypographyTitle } from 'ant-design-vue';
import { computed, ref } from 'vue';
import AvatarComponent from '../AvatarComponent.vue';
import usePlayer from '@/core/composables/usePlayer';
import useRoomChat from '@/core/composables/useRoomChat';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { RoutesEnum } from '@/core/enums/routesEnum';
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { AvatarsEnum } from '@/core/enums/avatarsEnum';

dayjs.extend(relativeTime);

const { isChatOpen, chatMessages, unReadMessages } = useRoomChat();
const { currentPlayer, playerService } = usePlayer();
const { currentRoute, playerNames, getPlayer, getTeam } = useGameState();
const isConnectedToRoom = computed(() => currentRoute.value !== RoutesEnum.HOME && currentRoute.value !== RoutesEnum.CREATE_GAME); //depending on the peer connection state, I will do this for now.
const chatMsg = ref('');

const mentions = playerNames.value.map((name: string) => {
    return {
        value: name,
        label: name,
    };
});

const sortedMessages = computed(() => {
    const chatMessagesClone = [...chatMessages.value]
    return chatMessagesClone.sort((a, b) => b.timestamp - a.timestamp)
});

function sendMessage() {
    playerService.value.sendChatMessage(chatMsg.value);
    chatMsg.value = '';
}

</script>

<template>
    <div>
        <FloatButton @click="isChatOpen = true" :badge="{ dot: !!unReadMessages, color: 'blue' }">
            <template #icon>
                <CommentOutlined />
            </template>
        </FloatButton>
        <Drawer class="max-w-lg" :open="isChatOpen" @close="isChatOpen = false">
            <template #title>
                Room [{{currentPlayer.roomId}}] Chat
                <MessageOutlined class="mx-2" />
            </template>
            <template #footer>
                <div class="flex gap-x-4 my-4">
                    <Mentions @keyup.enter.capture="sendMessage" v-model:value="chatMsg" :options="mentions">
                    </Mentions>
                    <Button @click=sendMessage :disabled="!isConnectedToRoom || !chatMsg" type="primary" shape="round"
                        class="flex items-center justify-center">
                        <template #icon>
                            <SendOutlined />
                        </template>
                    </Button>
                </div>
            </template>
            <template #default>
                <div class="h-full">
                    <template v-if="!isConnectedToRoom">
                        <div class="flex flex-col items-center justify-center h-full">
                            <TypographyTitle :level="1">
                                <IeOutlined />
                            </TypographyTitle>
                            <Divider :dashed="true" />
                            <TypographyParagraph :strong="true"> You are not connected to a room
                            </TypographyParagraph>
                        </div>
                    </template>
                    <template v-else>
                        <div v-auto-animate class="h-full flex flex-col-reverse overflow-y-scroll">
                            <Comment v-for="chatMsg in sortedMessages" :key="chatMsg.timestamp"
                                :author="getPlayer(chatMsg.senderId)?.name ?? 'DISCONNECTED'">
                                <template #content>
                                    <TypographyParagraph>
                                        {{ chatMsg.message }} </TypographyParagraph>
                                </template>
                                <template #avatar>
                                    <AvatarComponent
                                        :avatar-icon="getPlayer(chatMsg.senderId)?.avatar ?? AvatarsEnum.BIRD"
                                        :color="getTeam(getPlayer(chatMsg.senderId)?.teamId ?? '')?.color ?? ColorsEnum.GRAY"
                                        :color-border="currentPlayer.id === chatMsg.senderId"
                                        :show-border="currentPlayer.id === chatMsg.senderId" />
                                </template>
                                <template #datetime>
                                    <Tooltip :title="dayjs.unix(chatMsg.timestamp).format('YYYY-MM-DD HH:mm:ss')">
                                        <span>{{ dayjs.unix(chatMsg.timestamp).fromNow() }}</span>
                                    </Tooltip>
                                </template>
                            </Comment>
                        </div>
                    </template>
                </div>
            </template>
        </Drawer>
    </div>
</template>