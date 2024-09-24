<script setup lang="ts">
import useGameState from '@/core/composables/useGameState';
import type { IChatMessage } from '@/core/interfaces/chatMessageInterface';
import { MessageOutlined, SendOutlined, IeOutlined, CommentOutlined } from '@ant-design/icons-vue';
import { Button, Comment, Divider, Drawer, FloatButton, Mentions, TypographyParagraph, TypographyTitle } from 'ant-design-vue';
import { ref } from 'vue';
import AvatarComponent from '../AvatarComponent.vue';
import usePlayer from '@/core/composables/usePlayer';

const { currentPlayer, playerService } = usePlayer();
const isConnectedToRoom = ref(true);
const { playerNames } = useGameState();
const isChatOpen = ref(false);
const unreadMessages = ref(0);
const chatMsg = ref('');
const tempListOfMessages = ref<IChatMessage[]>([
    {
        message: 'Hello',
        senderId: '123',
        timestamp: Date.now() - 1000 * 60 * 60,
    },
    {
        message: 'why',
        senderId: '1223',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
    }
]);

const mentions = playerNames.value.map((name: string) => {
    return {
        value: name,
        label: name,
    };
});

function sendMessage() {
    console.log('send message', chatMsg);
}

</script>

<template>
    <div>
        <FloatButton @click="isChatOpen = true" :badge="{ dot: !!unreadMessages, color: 'blue' }">
            <template #icon>
                <CommentOutlined />
            </template>
        </FloatButton>
        <Drawer :open="isChatOpen" width="70%" @close="isChatOpen = false">
            <template #title>
                Room Chat
                <MessageOutlined class="mx-2" />
            </template>
            <template #default>
                <div class="flex flex-col justify-between h-full">
                    <div class="flex-1">
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
                            <div>

                            </div>
                            <div v-auto-animate>
                                <Comment :class="{ 'flex flex-row-reverse': chatMsg.senderId === currentPlayer.id }"
                                    v-for="chatMsg in tempListOfMessages" :key="chatMsg.timestamp"
                                    :author="chatMsg.senderId">
                                    <template #content>
                                        <TypographyParagraph> {{ chatMsg.message }} </TypographyParagraph>
                                    </template>
                                    <template #avatar>
                                        <!-- <AvatarComponent avatar-icon="" /> -->
                                    </template>
                                    <template #datetime>
                                        <!-- <a-tooltip :title="dayjs().format('YYYY-MM-DD HH:mm:ss')">
                                            <span>{{ dayjs().fromNow() }}</span>
                                        </a-tooltip> -->
                                    </template>
                                </Comment>
                            </div>
                        </template>
                    </div>
                    <div>
                        <Divider />
                        <!-- <FormItem class="flex flex-row items-center"> -->
                        <div class="flex gap-x-4">
                            <Mentions v-model:value="chatMsg" :options="mentions"> </Mentions>
                            <Button @click=sendMessage :disabled="!isConnectedToRoom || !chatMsg" type="primary"
                                shape="round" class="flex items-center justify-center">
                                <template #icon>
                                    <SendOutlined />
                                </template>
                            </Button>
                            <!-- <Mentions :value="chatMsg" :options="mentions"> </Mentions> -->
                        </div>
                        <!-- </FormItem> -->
                    </div>
                </div>
            </template>
        </Drawer>
    </div>
</template>