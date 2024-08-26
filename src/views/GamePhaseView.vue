<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import useGameState from '@/core/composables/useGameState';
import usePlayer from '@/core/composables/usePlayer';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { GamePhasesEnum } from '@/core/enums/gamePhasesEnum';
import { Button, Card, Divider, TypographyText, TypographyTitle } from 'ant-design-vue';
import { computed, inject } from 'vue';

const gameService = inject(GameServiceKey)!;
const { gamePhaseDetails, teams, getPlayer, teamLeaderboard } = useGameState();
const { player } = usePlayer();

//TODO: highlight selected member / team
//TODO: maybe redesign this page
//maybe using a list is better for displaying the round order https://antdv.com/components/list
//TODO: maybe a horizontal timeline of some sort to show the teams order instead of being vertical
//TODO: show scores of each team. (maybe don't have show the players of the team, just the team name and score)

const isGameDone = computed(() => {
    return gamePhaseDetails.value.phase === GamePhasesEnum.DONE;
});

const teamsList = computed(() => {
    return isGameDone.value ? teamLeaderboard.value : teams.value;
});

function next() {
    if (isGameDone.value) {
        gameService.restartGame();
        return;
    }
    gameService.goToPlayingWord();
}

</script>

<template>
    <div class="flex flex-col p-4 gap-y-6">
        <div v-if="!isGameDone" class="flex flex-col text-center justify-center items-center">
            <TypographyTitle :level="2"> Game Phase {{ gamePhaseDetails.phase }} </TypographyTitle>
            <TypographyText v-html="gamePhaseDetails.description">
            </TypographyText>
        </div>
        <div v-else class="text-center">
            <TypographyTitle :level="2"> The Winner is </TypographyTitle>
            <TypographyTitle :level="4"> <span :style="{ color: teamLeaderboard[0].color }"> Team {{
                teamLeaderboard[0].id }} - Score [{{
                        teamLeaderboard[0].score }}] </span> </TypographyTitle>
        </div>
        <div class="flex-1 overflow-hidden w-full flex gap-x-4 justify-center">
            <Card :title="isGameDone ? 'Leaderboards' : 'Game Order'" class="w-full flex flex-col max-w-sm"
                :body-style="{ 'overflow': 'auto', 'flex': '1 1 0%' }">
                <div class="flex flex-col justify-center items-center text-center">
                    <div class="flex flex-col">
                        <div v-for="team in teamsList" :key="team.id">
                            <p class="font-semibold pb-2" :style="{ color: team.color }"> Team {{ team.id }}
                                -
                                Score
                                [{{ team.score }}]
                            </p>
                            <div class="flex flex-col gap-y-2">
                                <div class="flex flex-row justify-center items-center gap-x-2"
                                    v-for="playerId in team.players" :key=playerId>
                                    <AvatarComponent :avatar-icon="getPlayer(playerId).avatar" :color="team.color"
                                        :tooltip="getPlayer(playerId).name">
                                    </AvatarComponent>
                                    <p :style="{ color: team.color }"> {{ getPlayer(playerId).name }} </p>
                                </div>
                            </div>
                            <Divider class="w-32 my-2" />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
        <div v-if="player.isHost" class="row-span-2 flex justify-center gap-x-8">
            <Button size="large" type="primary" @click="next"> {{ isGameDone ? 'Play Again?' : 'Start Phase' }}
            </Button>
        </div>
    </div>
</template>