<script setup lang="ts">
import AvatarComponent from '@/components/AvatarComponent.vue';
import useGameState from '@/core/composables/useGameState';
import usePlayer from '@/core/composables/usePlayer';
import { GameServiceKey } from '@/core/constants/injectionKeys';
import { Button, StatisticCountdown, TypographyParagraph, TypographyTitle } from 'ant-design-vue';
import { formatCountdown } from 'ant-design-vue/es/statistic/utils';
import { computed, inject, ref, watch } from 'vue';

const gameService = inject(GameServiceKey)!;
const { player } = usePlayer();
const { timePerRound, remainingWords, activeWord, currentPlayerTurn, skippedWords, getTeam, isNewTurn, isPaused } = useGameState();

const timerFormat = ref('mm:ss');
const wordsAreDone = ref(false);
const timer = ref(Date.now() + 1000 * timePerRound.value);
const recentTimer = ref(-1);

const currentTeamTurn = computed(() => {
    return getTeam(currentPlayerTurn.value.teamId);
});

function skipWord() {
    gameService.playWord('skip');
}

function scoreWord() {
    gameService.playWord('score');
}

function onTimerFinish() {
    if (isPaused.value) return;
    if (currentPlayerTurn.value.id === player.id) {
        gameService.playWord('skip');
        gameService.updateTurn(true);
    }
}

watch(isNewTurn, (newValue) => {
    if (!isCurrentPlayerTurn()) return;
    if (newValue) {
        timerFormat.value = 'mm:ss';
        timer.value = Date.now() + 1000 * timePerRound.value;
        gameService.updateTurn(false);
    }
}, { immediate: true });

watch(() => [...remainingWords.value], (newValue, oldValue) => {
    if (!isCurrentPlayerTurn()) return;
    if (newValue.length !== 0) return;
    if (newValue.length === oldValue.length) return;
    if (skippedWords.value.length === 0) {
        wordsAreDone.value = true;
        setTimeout(() => {
            gameService.goToNextGamePhase();
        }, 2000);
    } else if (oldValue.length === 1) {
        gameService.updateTurn(true);
    }

}, { deep: true });

watch(isPaused, (newValue) => {
    if (!isCurrentPlayerTurn()) return;
    if (newValue) {
        pauseTimer();
    } else {
        continueTimer();
    }
});

function onTimerChange(timer: number) {
    recentTimer.value = timer;
    if (timer <= 5000 && timerFormat.value !== 'ss:SSS') {
        timerFormat.value = 'ss:SSS';
    } else if (timer > 5000 && timerFormat.value !== 'mm:ss') {
        timerFormat.value = 'mm:ss';
    }
}

function pauseTimer() {
    console.log('-- pause timer')
    const staticTimer = formatCountdown(timer.value, {
        format: timerFormat.value,
    });
    timerFormat.value = staticTimer;
    timer.value = -1;
}

function continueTimer() {
    console.log('-- continue timer', recentTimer.value)
    timer.value = Date.now() + recentTimer.value;
    onTimerChange(recentTimer.value)
}

function isCurrentPlayerTurn() {
    if (!currentPlayerTurn.value) return false;
    return currentPlayerTurn.value.id === player.id;
}

// TODO: if there no remaining words, then we should go to the next phase
// TODO: a button to pause the game? maybe only for the host
// ENHANCEMENT: show timer for all players ...

</script>

<template>
    <div class="h-full">
        <!-- TODO: update the views -->
        <!-- If you are not the current player, then you only see the timer.  -->
        <!-- If you are in the opposite team, you can see the word? maybe? -->
        <div v-auto-animate class="flex flex-col text-3xl gap-y-4 justify-center items-center p-4 h-full">
            <template v-if="wordsAreDone">
                <TypographyTitle :level="3"> Words are done! </TypographyTitle>
            </template>
            <template v-else-if="currentPlayerTurn">
                <template v-if="currentPlayerTurn.id === player.id">
                    <StatisticCountdown :loading="false" :format="timerFormat" title="Timer" @finish="onTimerFinish"
                        @change="onTimerChange" :value="timer" :valueStyle="{ 'font-size': '2.25rem' }" />
                    <TypographyTitle> {{ activeWord }}</TypographyTitle>
                    <div class="flex flex-row jusitfy-center items-center gap-x-14 my-8">
                        <Button :disabled="!remainingWords.length" size="large" type="dashed" :danger="true"
                            @click="skipWord">Skip</Button>
                        <Button :disabled="!remainingWords.length" size="large" type="primary"
                            @click="scoreWord">Score</Button>
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
                <TypographyParagraph> Words Remaining {{ remainingWords.length }}
                </TypographyParagraph>
            </template>
            <template v-else>
                <TypographyTitle> No Turn is Active </TypographyTitle>
            </template>
        </div>
    </div>
</template>