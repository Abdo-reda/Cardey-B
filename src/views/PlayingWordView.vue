<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { Button, TypographyParagraph, TypographyTitle } from 'ant-design-vue';
import { computed, inject, onMounted, ref, watchEffect } from 'vue';

const gameService = inject(GameServiceKey)!;
const player = gameService.getCurrentPlayer();
const timer = ref(60); //TODO: initial value from gameState maybe?
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
let timerInterval: NodeJS.Timeout;

function skipWord() {
    gameService.playWord('skip');
}

function scoreWord() {
    gameService.playWord('score');
}

watchEffect(() => {
    if (timer.value === 0 && currentPlayerTurn.value.id === player.id) {
        gameService.playWord('skip');
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    }
});

onMounted(() => {
    timerInterval = setInterval(() => {
        timer.value -= 1;
    }, 1000);
})

// TODO: if there no remaining words, then we should go to the next phase
// TODO: if the timer runs out, then we should skip the word, go to next player
// TODO: a button to pause the game? maybe only for the host

</script>

<template>
    <!-- TODO: update the views -->
    <!-- If you are not the current player, then you only see the timer.  -->
    <!-- If you are in the opposite team, you can see the word? maybe? -->
    <div class="h-full">
        <div v-auto-animate class="flex flex-col gap-y-4 justify-center items-center p-4 h-full">
            <p class="text-3xl font-medium text-gray-400"> {{ timer }} </p>
            <template v-if="currentPlayerTurn.id === player.id">
                <TypographyTitle> {{ activeWord }}</TypographyTitle>
                <div class="flex flex-row jusitfy-center items-center gap-x-14 my-8">
                    <Button size="large" type="dashed" :danger="true" @click="skipWord">Skip</Button>
                    <Button size="large" type="primary" @click="scoreWord">Score</Button>
                </div>
            </template>
            <template v-else>
                <div class="flex flex-row">
                    <AvatarComponent :avatar-icon="currentPlayerTurn.avatar" :color="currentTeamTurn.color">
                    </AvatarComponent>
                    <TypographyTitle :level="5"> {{ currentPlayerTurn.name }} </TypographyTitle>
                </div>
                <TypographyTitle :level="2"> Turn </TypographyTitle>
            </template>
            <TypographyParagraph> Words Remaining {{ gameService.gameState.value.words.remaining.length }}
            </TypographyParagraph>
        </div>
    </div>
</template>