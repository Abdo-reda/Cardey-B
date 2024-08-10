<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { Button, StatisticCountdown, TypographyParagraph, TypographyTitle } from 'ant-design-vue';
import { computed, inject, ref, watch } from 'vue';

const gameService = inject(GameServiceKey)!;
const player = gameService.getCurrentPlayer();
const timer = ref(Date.now() + 1000 * gameService.gameState.value.gameSettings.timePerRound);
const activeWord = computed<string>(() => {
    return gameService.gameState.value.words.remaining[0];
});
const currentPlayerTurn = computed(() => {
    const currentPlayerId = gameService.gameState.value.turns.playersOrder[gameService.gameState.value.turns.currentPlayerIndex];
    return gameService.getPlayer(currentPlayerId);
});
const currentTeamTurn = computed(() => {
    return gameService.gameState.value.teams.find(team => team.id === currentPlayerTurn.value.teamId)!;
});

function skipWord() {
    gameService.playWord('skip');
}

function scoreWord() {
    gameService.playWord('score');
}

function onTimerFinish() {
    if (currentPlayerTurn.value.id === player.id) {
        gameService.playWord('skip');
        gameService.updateTurn();
    }
}

watch(currentPlayerTurn, (newValue, oldValue) => {
    if (newValue.id === oldValue.id) return;
    if (newValue.id === player.id) {
        timer.value = Date.now() + 1000 * gameService.gameState.value.gameSettings.timePerRound;
    }
});

// TODO: if there no remaining words, then we should go to the next phase
// TODO: if the timer runs out, then we should skip the word, go to next player
// TODO: a button to pause the game? maybe only for the host
// ENHANCEMENT: show timer for all players ...

</script>

<template>
    <!-- TODO: update the views -->
    <!-- If you are not the current player, then you only see the timer.  -->
    <!-- If you are in the opposite team, you can see the word? maybe? -->
    <div class="h-full">
        <div v-auto-animate class="flex flex-col text-3xl gap-y-4 justify-center items-center p-4 h-full">
            <template v-if="currentPlayerTurn.id === player.id">
                <StatisticCountdown format="mm:ss" title="Timer" @finish="onTimerFinish" :value="timer"
                    :valueStyle="{ 'font-size': '2.25rem' }" />
                <TypographyTitle> {{ activeWord }}</TypographyTitle>
                <div class="flex flex-row jusitfy-center items-center gap-x-14 my-8">
                    <Button size="large" type="dashed" :danger="true" @click="skipWord">Skip</Button>
                    <Button size="large" type="primary" @click="scoreWord">Score</Button>
                </div>
            </template>
            <template v-else>
                <div class="flex flex-row gap-x-2 items-center">
                    <AvatarComponent class="size-20" :avatar-icon="currentPlayerTurn.avatar"
                        :color="currentTeamTurn.color">
                    </AvatarComponent>
                    <TypographyTitle class="m-0 p-0" :level="4"> {{ currentPlayerTurn.name }} </TypographyTitle>
                </div>
                <TypographyTitle :level="2"> Turn </TypographyTitle>
            </template>
            <TypographyParagraph> Words Remaining {{ gameService.gameState.value.words.remaining.length }}
            </TypographyParagraph>
        </div>
    </div>
</template>