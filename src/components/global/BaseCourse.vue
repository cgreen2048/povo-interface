<template>
  <!-- Course Row -->
  <div>
    <div class="w-full border border-black bg-white px-4 py-2 flex flex-col gap-4 justify-between 
    hover:cursor-pointer hover:bg-gray-200 transition-colors duration-300" @click="moreInfo = true">
      <div class="flex flex-row items-start">
        <span class="font-semibold text-gray-900 whitespace-nowrap mr-2">{{ course.abbreviation }} {{ course.number }}</span>
        <span class="text-gray-900 truncate">{{ course.name }}</span>
      </div>
      <div class="flex items-center gap-2 w-full">
        <!-- Left cluster: check + section -->
        <div class="flex items-center gap-2 mr-8">
          <!-- Check -->
          <div class="flex h-4 w-4 items-center justify-center">
            <span class="text-gray-800 font-bold text-lg leading-none mb-[2px]">✓</span>
          </div>

          <!-- Section number -->
          <div class="min-w-[2rem] text-sm text-gray-700">Section {{ Object.keys(course.sections)[0] }}</div>
        </div>

        <!-- Middle: course info -->
        <div class="min-w-0">
          <div class="text-sm text-gray-600">{{ course.sections[Object.keys(course.sections)[0]]?.days }} {{ course.sections[Object.keys(course.sections)[0]]?.time }}</div>
        </div>

        <!-- Right: instructor -->
        <div class="text-sm text-gray-700 whitespace-nowrap ml-auto">{{ course.sections[Object.keys(course.sections)[0]]?.instructor }}</div>
      </div>
    </div>
    <div v-if="moreInfo" class="
        fixed inset-0 w-full h-full bg-[rgba(0,0,0,0.7)]
        flex items-center justify-center z-10"
      >
      <div class="relative bg-[#002349] text-white rounded-lg p-8 w-100 text-left">
          <button class="absolute top-2 right-4 text-2xl text-white font-bold cursor-pointer" @click="moreInfo = false">X</button>
          <h2><strong>{{ course.abbreviation }} {{ course.number}}</strong> - {{ course.name}}</h2>
          <p><strong>Professor:</strong> {{ course.sections[0]?.instructor }}</p>
          <p><strong>Time:</strong> {{ course.sections[0]?.time }}</p>
          <p><strong>Dates:</strong> {{ course.sections[0]?.days }}</p>
          <p><strong>Credits:</strong> {{ course.sections[0]?.credits }}</p>
          <p><strong>Location:</strong> {{ course.sections[0]?.location }}</p>
          <p><strong>Requirements:</strong>placeholder</p>
          <p><strong>Description:</strong>placeholder</p>
      </div>
    </div>
  </div>


</template>

<script lang="ts" setup>
import { Course } from '@/lib/types';
import { ref, defineProps } from 'vue';
defineProps<{
  course: Course
}>();

const moreInfo = ref(false);

</script>

<style scoped>

</style>