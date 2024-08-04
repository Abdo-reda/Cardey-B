<script setup lang="ts">
import { Form, FormItem, Button, type FormInstance, Input, TypographyTitle, Tag, Card } from 'ant-design-vue';
import { computed, inject, reactive, ref } from 'vue';
import router from '@/plugins/router';
import { RoutesEnum } from '@/core/enums/routesEnum';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import type { IPlayer } from '@/core/interfaces/playerInterface';
import { ColorsEnum } from '@/core/enums/colorsEnum';

const gameService = inject(GameServiceKey)!;

interface IWordField {
    value: string;
    key: number;
}

const formRef = ref<FormInstance>();
const wordsFieldList = reactive<{ words: IWordField[] }>({
    words: []
});
const readyState = ref(false);

const maxNumOfPlayerInList = 5;
const unreadyPlayerLists = computed(() => {
    const playerLists: IPlayer[][] = [];
    const unReadyPlayers = gameService.gameState.value.players.filter(p => !p.teamId); //TODO: fix this filtering
    for (let i = 0; i < unReadyPlayers.length; i += maxNumOfPlayerInList) {
        playerLists.push(unReadyPlayers.slice(i, i + maxNumOfPlayerInList));
    }
    return playerLists;
});

function readyUp() {
    formRef.value!
        .validate()
        .then(() => {
            console.log('values', wordsFieldList.words);
            readyState.value = true;
        })
        .catch(error => {
            console.log('error', error);
        });
};

function unready() {
    readyState.value = false;
}

function resetForm() {
    formRef.value!.resetFields();
    readyState.value = false;
};

// watchEffect(() => {
//     //if all players are ready, then switch to the next view
// });

function initWords(numberOfWords: number): void {
    for (let i = 0; i < numberOfWords; i++) {
        wordsFieldList.words.push({
            value: '',
            key: i,
        });
    }
};

function nextTemp() {
    console.log('next temp');
    router.push({ name: RoutesEnum.GAME_PHASE });
}

initWords(gameService.gameState.value.gameSettings.wordsPerPlayer);

</script>

<template>
    <div class="grid row-span-12 p-4 gap-y-4">
        <div class="row-span-2 text-center">
            <TypographyTitle :level="2"> Input your words </TypographyTitle>
        </div>
        <div class="row-span-8 overflow-hidden w-full flex gap-x-4 justify-center">
            <!-- <Card class="h-fit" size="small" title="Waiting for players ...">
                <AvatarGroup v-for="(playerList, index) in unreadyPlayerLists" :key="index"
                    :max-count="maxNumOfPlayerInList">
                    <div v-for="player in playerList" :key="player.id">
                        <AvatarComponent class="size-10" :avatar-icon="player.avatar" :color="ColorsEnum.GRAY"
                            :tooltip="player.name">
                        </AvatarComponent>
                    </div>
                </AvatarGroup>
            </Card> -->
            <Card title="Words" class="w-full flex flex-col max-w-sm"
                :body-style="{ 'overflow': 'auto', 'flex': '1 1 0%' }">
                <template #extra>
                    <Tag v-if="readyState" color="success">
                        <template #icon>
                            <CheckCircleOutlined />
                        </template>
                        Ready!
                    </Tag>
                    <Tag v-else>
                        <template #icon>
                            <ClockCircleOutlined />
                        </template>
                        Not Ready
                    </Tag>
                </template>
                <template #default>
                    <Form ref="formRef" :model="wordsFieldList">
                        <FormItem v-for="(word, index) in wordsFieldList.words" class="mb-4" :key="word.key"
                            :name="['words', index, 'value']" :rules="{
                                required: true,
                                message: 'word cannot be empty',
                                trigger: 'change',
                            }">
                            <div class="flex items-center justify-center gap-x-4">
                                <Input :placeholder="`word ${index}`" :disabled="readyState"
                                    v-model:value="word.value" />
                            </div>
                        </FormItem>
                    </Form>
                </template>
                <template #actions>
                    <Button @click="resetForm">Reset</Button>
                    <Button v-if="!readyState" type="primary" html-type="submit" @click="readyUp">Ready
                        up</Button>
                    <Button v-else type="dashed" html-type="submit" @click="unready">Edit</Button>
                </template>
            </Card>
        </div>
        <div class="row-span-2 flex justify-center gap-x-8">
            <Button type="primary" @click="nextTemp"> Next Temp </Button>
        </div>
    </div>
</template>