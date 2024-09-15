<script setup lang="ts">
import useGameState from '@/core/composables/useGameState';
import { Button, Collapse, CollapsePanel, FormItem, Input, Tag, TypographyTitle } from 'ant-design-vue';
import { ApiOutlined, BugOutlined, BuildOutlined, SendOutlined } from '@ant-design/icons-vue';
import { computed, inject, ref } from 'vue';
import usePlayer from '@/core/composables/usePlayer';
import { GameServiceKey } from '@/core/constants/injectionKeys';

const gameService = inject(GameServiceKey)!;
const { getGameState } = useGameState();
const { player, playerService } = usePlayer();

const testMsg = ref('');
const isConnected = computed(() => {
    return navigator.onLine;
});

function sendTestMsg() {
    gameService.testMessage(testMsg.value);
}

//connected if:
//- there is internet connection
//- the room is not null and exists in firebase

</script>

<template>
    <div class="h-full flex flex-col gap-y-4 overflow-scroll">
        <TypographyTitle :level="2">
            <BugOutlined /> Debugging
        </TypographyTitle>
        <Collapse class="bg-white dark:bg-gray-800">
            <CollapsePanel>
                <template #header>
                    <div class="flex gap-x-2">
                        <BuildOutlined />
                        <TypographyTitle class="!m-0" :level="5"> Game State </TypographyTitle>
                    </div>
                </template>
                <pre>{{ getGameState() }}</pre>
            </CollapsePanel>
        </Collapse>
        <Collapse class="bg-white dark:bg-gray-800">
            <CollapsePanel>
                <template #extra>
                    <Tag :color="isConnected ? 'success' : 'error'"> {{ isConnected ? 'connected' : 'disconnected' }}
                    </Tag>
                </template>
                <template #header>
                    <div class="flex gap-x-2">
                        <ApiOutlined />
                        <TypographyTitle class="!m-0" :level="5"> Test Connection </TypographyTitle>
                    </div>
                </template>
                <div class="space-y-4">
                    <div>
                        <TypographyTitle :level="5"> Test Message </TypographyTitle>
                        <div class="flex gap-x-4">
                            <FormItem class="m-0 flex" name="msg" label="Send msg to all players">
                                <Input :disabled="!isConnected" placeholder="msg" v-model:value="testMsg" />
                            </FormItem>
                            <Button :disabled="!isConnected" @click="sendTestMsg" type="primary"
                                class="flex justify-center items-center">
                                <template #icon>
                                    <SendOutlined />
                                </template>
                                Send
                            </Button>
                        </div>
                    </div>
                    <div>
                        <TypographyTitle :level="5"> Room [{{ player.roomId ? player.roomId : '-' }}] </TypographyTitle>
                    </div>
                    <div>
                        <div class="flex gap-x-2">
                            <TypographyTitle class="!m-0" :level="5"> Player [{{ player.name ? player.name : '-' }}]
                            </TypographyTitle>
                            <Tag :color="player.isHost ? 'success' : 'processing'"> {{ player.isHost ? 'HOST' : 'CLIENT'
                                }}
                            </Tag>
                        </div>
                        <pre> {{ player }}</pre>
                    </div>
                    <div>
                        <TypographyTitle :level="5"> Connected Players {{ 0 }} </TypographyTitle>
                    </div>
                </div>
            </CollapsePanel>
        </Collapse>
    </div>
</template>