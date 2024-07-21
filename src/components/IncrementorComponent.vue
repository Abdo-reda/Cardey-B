<script setup lang="ts">

import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
interface IIncrementerProps {
  title: string
  min?: number,
  max?: number,
  factor?: number
}

const props = withDefaults(defineProps<IIncrementerProps>(), {
  min: 1,
  max: 50,
  factor: 1,
});
const count = defineModel<number>({
  default: 0
})
const increment = () => {
  if (count.value < props.max) {
    count.value += props.factor;
  }
}

const decrement = () => {
  if (count.value > props.min) {
    count.value -= props.factor;
  }
}

</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <p class="font-semibold text-md"> {{ title }} </p>
    <div class="flex flex-row justify-center items-center">
      <AButton @click="decrement" class="flex flex-col justify-center items-center" type="dashed" shape="circle">
        <template #icon>
          <MinusCircleOutlined />
        </template>
      </AButton>
      <p class="m-4 p-2"> {{ count }} </p>
      <AButton @click="increment" class="flex flex-col justify-center items-center" type="dashed" shape="circle">
        <template #icon>
          <PlusCircleOutlined />
        </template>
      </AButton>
    </div>
  </div>
</template>

<style scoped></style>