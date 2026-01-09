<template>
  <button class="button relative flex flex-row justify-center items-center text-center font-medium rounded-2xl cursor-pointer bg-[#0a843dff] hover:bg-[#12a356]"
    :disabled="props.disabled"
    :style="{
      '--button-width': `${buttonWidth}px`,
      '--button-height': `${buttonHeight}px`
    }">
    <div class="text-content" :class="{ disabled: props.disabled }">
      {{ props.buttonName }}
    </div>
  </button>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'

interface Props {
    buttonName: string
    size: 'sm' | 'md' | 'lg'
    disabled?: boolean
} 

const props = withDefaults(defineProps<Props>(), {
    buttonName: "Button",
    buttonWidth: 200,
    buttonHeight: 60,
    disabled: false
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Roboto:wght@100..900&display=swap');

.button {
  height: var(--button-height);
  width: var(--button-width);
  font-family: 'GalaxiePolarisCondensed', sans-serif;

  border: 1px solid transparent; 
  transition: border-color 0.3s ease, background-color 0.3s ease;
}


.button:disabled {
  cursor: default;
  border: 1px solid transparent;
  background-color: #0C2340;
}

.text-content {
  font-size: 36px;
  color: #ffffff;
}

.disabled {
  font-size: 48px;
  font-weight: 700;
  color: #c99700;
}

</style>