<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { Button, StatisticCountdown, TypographyParagraph, TypographyTitle } from 'ant-design-vue';
import { computed, inject, ref, watch } from 'vue';

const gameService = inject(GameServiceKey)!;
const player = gameService.getCurrentPlayer();
const timerFormat = ref('mm:ss');
const wordsAreDone = ref(false);
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
    console.log('--- current player turn', newValue, oldValue)
    if (newValue.id === oldValue.id) return;
    if (newValue.id === player.id) {
        timer.value = Date.now() + 1000 * gameService.gameState.value.gameSettings.timePerRound;
    }
});

watch(gameService.gameState.value.words.remaining, (newValue, _) => {
    console.log('===', newValue, _);
    if (currentPlayerTurn.value.id !== player.id) return;
    if (newValue.length === 0) {
        console.log('=== length = 0?');
        if (gameService.gameState.value.words.skipped.length === 0) {
            console.log('---- words are done?');
            wordsAreDone.value = true;
            setTimeout(() => {
                gameService.goToNextGamePhase();
            }, 2000);
        } else {
            gameService.updateTurn();
        }
    }
});


function onTimerChange(timer: number) {
    if (timer <= 5000 && timerFormat.value !== 'ss:SSS') {
        timerFormat.value = 'ss:SSS';
    } else if (timer > 5000 && timerFormat.value !== 'mm:ss') {
        timerFormat.value = 'mm:ss';
    }
}

// TODO: if there no remaining words, then we should go to the next phase
// TODO: a button to pause the game? maybe only for the host
// ENHANCEMENT: show timer for all players ...

</script>

<template>
    <!-- TODO: update the views -->
    <!-- If you are not the current player, then you only see the timer.  -->
    <!-- If you are in the opposite team, you can see the word? maybe? -->
    <div class="h-full">
        <div v-auto-animate class="flex flex-col text-3xl gap-y-4 justify-center items-center p-4 h-full">
            <template v-if="wordsAreDone">
                <TypographyTitle :level="3"> Words are done! </TypographyTitle>
            </template>
            <template v-else>
                <template v-if="currentPlayerTurn.id === player.id">
                    <StatisticCountdown :loading="false" :format="timerFormat" title="Timer" @finish="onTimerFinish"
                        @change="onTimerChange" :value="timer" :valueStyle="{ 'font-size': '2.25rem' }" />
                    <TypographyTitle> {{ activeWord }}</TypographyTitle>
                    <div class="flex flex-row jusitfy-center items-center gap-x-14 my-8">
                        <Button :disabled="!gameService.gameState.value.words.remaining.length" size="large"
                            type="dashed" :danger="true" @click="skipWord">Skip</Button>
                        <Button :disabled="!gameService.gameState.value.words.remaining.length" size="large"
                            type="primary" @click="scoreWord">Score</Button>
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
            </template>
        </div>
    </div>
</template>