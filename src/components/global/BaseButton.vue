<template>
  <button
    :class="[
      'button inline-flex relative flex flex-row justify-center items-center text-center', 
      'font-medium rounded-2xl cursor-pointer bg-[#0a843dff] hover:bg-[#12a356] transition-colors duration-300',
      sizeClass,
      disabled ? 'opacity-60 cursor-not-allowed' : 'text-white'
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script lang="ts" setup>
import { computed, withDefaults, defineProps } from 'vue'

type Size = 'sm' | 'med' | 'lg'

const props = withDefaults(defineProps<{
  label?: string
  size?: Size
  disabled?: boolean
}>(), {
  size: 'med',
  disabled: false
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-lg py-1 px-2 w-24'
    case 'lg':
      return 'text-4xl py-4 px-6 w-72'
    default:
      return 'text-2xl py-2 px-4 w-48'
  }
})
</script>

<style scoped>
.button {
  font-family: 'PolarisCondensed', sans-serif;
}
</style>