<script setup lang="ts">
import { Form, FormItem, Button, type FormInstance, Input, TypographyTitle, Tag, Card, Drawer, TypographyParagraph } from 'ant-design-vue';
import { inject, reactive, ref } from 'vue';
import { CheckCircleOutlined, ClockCircleOutlined, RightOutlined, TeamOutlined } from '@ant-design/icons-vue';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { ColorsEnum } from '@/core/enums/colorsEnum';
import AvatarComponent from '@/components/AvatarComponent.vue';
import usePlayer from '@/core/composables/usePlayer';
import useGameState from '@/core/composables/useGameState';

interface IWordField {
    value: string;
    key: number;
}

const gameService = inject(GameServiceKey)!;
const { player } = usePlayer();
const { unreadyPlayers, wordsPerPlayer } = useGameState();

const formRef = ref<FormInstance>();
const wordsFieldList = reactive<{ words: IWordField[] }>({
    words: []
});
const readyState = ref(false);
const isDrawerOpen = ref(false);

function readyUp() {
    formRef.value!
        .validate()
        .then(() => {
            console.log('values', wordsFieldList.words);
            readyState.value = true;
            gameService.updateWords(false, wordsFieldList.words.map(w => w.value));
        })
        .catch(error => {
            console.log('error', error);
        });
};

function unready() {
    readyState.value = false;
    gameService.updateWords(true, []);
}

function resetForm() {
    formRef.value!.resetFields();
    readyState.value = false;
    gameService.updateWords(true, []);
};

function initWords(numberOfWords: number): void {
    for (let i = 0; i < numberOfWords; i++) {
        wordsFieldList.words.push({
            value: '',
            key: i,
        });
    }
};

function StartFirstPhase() {
    gameService.goToNextGamePhase();
}

initWords(wordsPerPlayer.value);

</script>

<template>
    <div class="flex flex-col p-4 gap-y-6">
        <div class="text-center">
            <TypographyTitle :level="2"> Input your words </TypographyTitle>
        </div>
        <div class="flex-1 overflow-hidden w-full flex gap-x-4 justify-center">
            <Card title="Words" class="w-full flex flex-col max-w-sm overflow-x-hidden"
                :body-style="{ 'overflow-y': 'auto', 'flex': '1 1 0%' }">
                <template #extra>
                    <div @click="isDrawerOpen = true" class="hover:cursor-pointer group">
                        <Tag :color="readyState ? 'success' : 'default'">
                            <template #icon>
                                <CheckCircleOutlined v-if="readyState" />
                                <ClockCircleOutlined v-else />
                            </template>
                            <span class="pr-2"> {{ readyState ? 'Ready!' : 'Not Ready' }} </span>
                            <TeamOutlined :class="{ 'text-gray-400': !readyState, 'text-success-700': readyState }"
                                class="group-hover:text-gray-600 group-hover:dark:text-gray-200 transition-colors" />
                            <RightOutlined :class="{ 'text-gray-400': !readyState, 'text-success-700': readyState }"
                                class="group-hover:text-gray-600 group-hover:dark:text-gray-200 transition-colors" />
                        </Tag>
                    </div>
                </template>
                <template #default>
                    <Drawer title="Waiting for ..." placement="right" :open="isDrawerOpen" width="60%" :closable="false"
                        :get-container="false" @close="isDrawerOpen = false">
                        <template #default>
                            <div v-auto-animate>
                                <div class="py-2 flex gap-x-2 items-center" v-for="player in unreadyPlayers"
                                    :key="player.id">
                                    <AvatarComponent :avatar-icon="player.avatar" :color="ColorsEnum.GRAY" />
                                    <TypographyParagraph class="!m-0" :level="5">{{ player.name }}</TypographyParagraph>
                                </div>
                            </div>
                        </template>
                    </Drawer>
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
        <div v-if="player.isHost" class="row-span-2 flex justify-center gap-x-8">
            <Button :disabled="!!unreadyPlayers.length" size="large" type="primary" @click="StartFirstPhase"> Start
                First
                Phase </Button>
        </div>
    </div>
</template>