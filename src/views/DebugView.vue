<script setup lang="ts">
import useGameState from '@/core/composables/useGameState';
import { Button, Collapse, CollapsePanel, FormItem, Input, Tag, TypographyTitle } from 'ant-design-vue';
import { ApiOutlined, BugOutlined, BuildOutlined, SendOutlined, ExperimentOutlined } from '@ant-design/icons-vue';
import { computed, inject, ref } from 'vue';
import usePlayer from '@/core/composables/usePlayer';
import { GameServiceKey } from '@/core/constants/injectionKeys';

const gameService = inject(GameServiceKey)!;
const { getGameState } = useGameState();
const { currentPlayer, playerService } = usePlayer();

const testMsg = ref('');

const peerConnectionState = computed(() => {
    return playerService.value.getPlayerRTCConnectionState();
});

const dataChannelState = computed(() => {
    return playerService.value.getDataChannelState();
});

const playerConnections = computed(() => {
    return playerService.value.getPlayersConnections();
});

function sendTestMsg() {
    gameService.testMessage(testMsg.value);
}

</script>

<template>
    <div class="h-full flex flex-col gap-y-4 overflow-scroll">
        {{ }}
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
                    <Tag :color="peerConnectionState == 'connected' ? 'success' : 'error'"> Peer Connection: {{
                        peerConnectionState ?? 'N/A' }}
                    </Tag>
                    <Tag :color="dataChannelState == 'open' ? 'success' : 'error'"> Data Channel: {{ dataChannelState ?? 'N/A' }}
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
                        <TypographyTitle :level="5"> Test Messages </TypographyTitle>
                        <div class="flex gap-x-4 my-4 items-center">
                            <FormItem class="m-0 flex" name="msg" label="Send msg to all players">
                                <Input placeholder="msg" v-model:value="testMsg" />
                            </FormItem>
                            <Button @click="sendTestMsg" type="primary" class="flex justify-center items-center">
                                <template #icon>
                                    <SendOutlined />
                                </template>
                                Send
                            </Button>
                        </div>
                    </div>
                    <div>
                        <TypographyTitle :level="5">
                            <ExperimentOutlined /> Execute & Send
                        </TypographyTitle>
                        <div class="flex gap-x-4 my-4 items-center">
                            <!-- ADD COMMON MESSAGES HERE -->
                            <!-- <FormItem class="m-0 flex" name="msg">
                            </FormItem>
                            <Button danger :disabled="!isConnected" @click="sendTestMsg" type="primary"
                                class="flex justify-center items-center">
                                Execute & Send
                            </Button> -->
                        </div>
                    </div>
                    <div>
                        <TypographyTitle :level="5"> Room [{{ currentPlayer.roomId ? currentPlayer.roomId : '-' }}]
                        </TypographyTitle>
                    </div>
                    <div>
                        <div class="flex gap-x-2">
                            <TypographyTitle class="!m-0" :level="5"> Player
                                [{{ currentPlayer.name ? currentPlayer.name : '-' }}]
                            </TypographyTitle>
                            <Tag :color="currentPlayer.isHost ? 'success' : 'processing'">
                                {{ currentPlayer.isHost ? 'HOST' : 'CLIENT'
                                }}
                            </Tag>
                        </div>
                        <pre> {{ currentPlayer }}</pre>
                    </div>
                    <div>
                        <TypographyTitle :level="5"> Connected Players {{ 0 }} </TypographyTitle>
                    </div>
                </div>
            </CollapsePanel>
        </Collapse>

        <Collapse v-if="currentPlayer.isHost" class="bg-white dark:bg-gray-800">
            <CollapsePanel>
                <template #header>
                    <div class="flex gap-x-2">
                        <BuildOutlined />
                        <TypographyTitle class="!m-0" :level="5">Connections </TypographyTitle>
                    </div>
                </template>
                <pre>{{ playerConnections }}</pre>
            </CollapsePanel>
        </Collapse>
    </div>
</template>