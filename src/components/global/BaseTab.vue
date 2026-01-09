<template>
  <button class="tab"
  :class="{ active: props.isSelected }"
  @click="emit('select-tab', props.tabName)">
  <!-- @mouseenter="closeTab = !closeTab"
  @mouseleave="closeTab = !closeTab"> -->
    <span class="tab-text">{{ formatTabName(props.tabName) }}</span>
    <!-- <span class="close-tab" v-if="closeTab" @click="emit('close-tab', props.tabName)">&#10006;</span> -->
    <div v-if="props.isSelected" class="tab-indicator"></div>
  </button>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

interface Props {
  tabName: string
  isSelected: boolean
}
const props = defineProps<Props>();
const emit = defineEmits(["select-tab", "close-tab"])

const formatTabName = (tabName: string) => {
  return tabName.replace('Page', '').replace(/([a-z])([A-Z])/g, '$1 $2')
}

// const closeTab = ref<boolean>(false)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Roboto:wght@100..900&display=swap');

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 60px;
  border: 2px solid black;
  background-color: #fef6ff; 
  color: #2c2c2c;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, font-weight 0.2s ease;
  border-right: none;
}

.tab:hover {
  background-color: #e7eaec;
}

.tab.active {
  font-weight: bold;
  border-bottom: 2px solid #12a356;
  background-color: #9fa2a5;
}

.tab-text {
  text-align: center;
}

.close-tab {
  position: absolute;
  right: 10px;
  text-align: right;
  color: #2c2c2c;
  transition: color 0.2s;
  font-weight: 400;
}

.tab-indicator {
  position: absolute;
  align-items: center;
  width: 30px;
  height: 4px;
  bottom: 0px;
  background-color:#12a356;
  border: 1.5px solid black; 
  border-bottom: 0px;
  border-radius: 10px 10px 0 0;
}
</style>