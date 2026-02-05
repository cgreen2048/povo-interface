<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-12">
    <span class="title-card w-auto h-auto p-8 bg-[#0c2340] text-white text-6xl rounded-3xl font-bold">POVO Course Registration</span>
    <span class="header-info">Click one of the page buttons below to get started on registration!</span>
    <div class="flex flex-col gap-20 items-center justify-center">
      <span class="home-buttons">
        <BaseButton :label="'My Course Plans'" :size="'lg'" @click="emit('toggle-page', 'CoursePlansPage')"></BaseButton>
        <BaseButton :label="'Course Registration'" :size="'lg'" @click="emit('toggle-page', 'CourseRegistrationPage')"></BaseButton>
      </span>
      <span class="home-buttons">
        <BaseButton :label="'View My Schedule'" :size="'lg'" @click="emit('toggle-page', 'SchedulePage')"></BaseButton>
        <BaseButton :label="'Search for Courses'" :size="'lg'" @click="emit('toggle-page', 'SearchPage')"></BaseButton>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
import BaseButton from '@/components/global/BaseButton.vue';


const emit = defineEmits(["toggle-page"]);

// const runSearch = async () => {
//   const results = await searchCourses("fadsf");
//   console.log("Results from HomePage search:", results);
// };

</script>


<style scoped>
.title-card {
  font-family: 'AGaramondPro', sans-serif;
  font-weight: 700;
}

.header-info {
  color: black;
  font-size: 24px;
  font-weight: 700px;
}

.home-buttons {
  display: flex;
  gap: 80px 200px; 
  justify-content: center;
}

</style>
