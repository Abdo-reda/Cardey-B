<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { Button, Card, Divider, TypographyText, TypographyTitle } from 'ant-design-vue';
import { inject } from 'vue';

const gameService = inject(GameServiceKey)!;
const player = gameService.getCurrentPlayer();

//TODO: highlight selected member / team
//TODO: maybe redesign this page
//maybe using a list is better for displaying the round order https://antdv.com/components/list
//TODO: maybe a horizontal timeline of some sort to show the teams order instead of being vertical
//TODO: show scores of each team. (maybe don't have show the players of the team, just the team name and score)

function next() {
    gameService.goToPlayingWord();
}

</script>

<template>
    <div class="flex flex-col p-4 gap-y-6">
        <div class="flex flex-col text-center justify-center items-center">
            <TypographyTitle :level="2"> Game Phase {{ gameService.gameState.value.gamePhase.phase }} </TypographyTitle>
            <TypographyText v-html="gameService.gameState.value.gamePhase.description">
            </TypographyText>
        </div>
        <div class="flex-1 overflow-hidden w-full flex gap-x-4 justify-center">
            <Card title="Game Order" class="w-full flex flex-col max-w-sm"
                :body-style="{ 'overflow': 'auto', 'flex': '1 1 0%' }">
                <div class="flex flex-col justify-center items-center text-center">
                    <div class="flex flex-col">
                        <div v-for="team in gameService.gameState.value.teams" :key="team.id">
                            <p class="font-semibold pb-2"> Team {{ team.id }}
                            </p>
                            <div class="flex flex-col gap-y-2">
                                <div class="flex flex-row justify-center items-center gap-x-2"
                                    v-for="playerId in team.players" :key=playerId>
                                    <AvatarComponent :avatar-icon="gameService.getPlayer(playerId).avatar"
                                        :color="team.color" :tooltip="gameService.getPlayer(playerId).name">
                                    </AvatarComponent>
                                    <p> {{ gameService.getPlayer(playerId).name }} </p>
                                </div>
                            </div>
                            <Divider class="w-32 my-2" />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
        <div v-if="player.isHost" class="row-span-2 flex justify-center gap-x-8">
            <Button size="large" type="primary" @click="next"> Start Phase </Button>
        </div>
    </div>
</template>