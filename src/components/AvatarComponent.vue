<script setup lang="ts">
import { Avatar, Tooltip } from 'ant-design-vue';
import { ColorsEnum } from '@/core/enums/colorsEnum';
import { AvatarsEnum } from '@/core/enums/avatarsEnum';
import { computed, defineAsyncComponent } from 'vue';

interface IAvatarProps {
    color: ColorsEnum;
    avatarIcon: AvatarsEnum;
    tooltip?: string;
    colorBorder?: boolean;
}

const props = withDefaults(defineProps<IAvatarProps>(), {
    colorBorder: false,
});

const svgComponent = computed(() => {
    if (!props.avatarIcon) return null;
    return defineAsyncComponent({
        loader: () => import(`@/assets/svgs/${props.avatarIcon}.svg?component`),
    });
});

const styles = computed(() => {
    if (props.colorBorder) {
        return {
            borderColor: props.color,
        };
    }
    return {};
});

</script>

<template>
    <Avatar v-if="!tooltip"
        class="bg-white dark:bg-gray-800 shadow-md border border-gray-100 flex justify-center items-center"
        :style="styles">
        <template #icon>
            <Transition name="appear" mode="out-in">
                <component height="60%" width="60%" :color="color" :fill-opacity="0.3" :is="svgComponent" />
            </Transition>
        </template>
    </Avatar>
    <Tooltip v-else :color="color">
        <template #title>
            {{ tooltip }}
        </template>
        <Avatar class="bg-white dark:bg-gray-800 shadow-md border border-gray-100 flex justify-center items-center"
            :style="styles">
            <template #icon>
                <component height="60%" width="60%" :color="color" :fill-opacity="0.3" :is="svgComponent" />
            </template>
        </Avatar>
    </Tooltip>
</template>
