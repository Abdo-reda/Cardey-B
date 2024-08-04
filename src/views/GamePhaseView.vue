<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { RoutesEnum } from '@/core/enums/routesEnum';
import router from '@/plugins/router';
import { Button, Card, TypographyText, TypographyTitle } from 'ant-design-vue';
import { inject } from 'vue';

const gameService = inject(GameServiceKey)!;

//TODO: highlight selected member / team
//TODO: maybe redesign this page

function nextTemp() {
    console.log('next temp');
    router.push({ name: RoutesEnum.PLAYING_WORD });
}

</script>

<template>
    <div class="grid p-4">
        <div class="row-span-2 flex flex-col text-center justify-center items-center">
            <TypographyTitle :level="2"> Game Phase {{ gameService.gameState.value.gamePhase.phase }} </TypographyTitle>
            <TypographyText v-html="gameService.gameState.value.gamePhase.description">
            </TypographyText>
        </div>
        <div class="row-span-10 overflow-hidden w-full flex gap-x-4 justify-center">
            <Card title="Game Order" class="w-full flex flex-col max-w-sm"
                :body-style="{ 'overflow': 'auto', 'flex': '1 1 0%' }">
                <div class="flex flex-col justify-center items-center text-center">
                    <div class="flex flex-col gap-y-4">
                        <div v-for="team in gameService.gameState.value.teams" :key="team.id">
                            <p class="font-semibold"> Team {{ team.id }}
                            </p>
                            <div class="flex flex-col">
                                <div class="flex flex-row justify-center items-center gap-x-2 my-1"
                                    v-for="playerId in team.players" :key=playerId>
                                    <AvatarComponent :avatar-icon="gameService.getPlayer(playerId).avatar"
                                        :color="team.color" :tooltip="gameService.getPlayer(playerId).name">
                                    </AvatarComponent>
                                    <p> {{ gameService.getPlayer(playerId).name }} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
        <div class="row-span-2 flex justify-center gap-x-8">
            <Button type="primary" @click="nextTemp"> Next Temp </Button>
        </div>
    </div>
</template>