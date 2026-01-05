<template>
  <div class="container">
    <div class="classes-block">
      <div class="plans-title">Courses</div>
      <div class="plan-selector">
        <label for="plan-select" class="plan-selector-label">Select Plan:</label>
        <select id="plan-select" class="plan-selector-dropdown" :value="currentPlan" @change="selectPlan">
          <option disabled selected value="">Choose a plan</option>
          <option
            v-for="plan in Object.keys(props.coursePlans)"
            :key="plan"
            :value="plan">
            {{ plan }}
          </option>
        </select>
      </div>
        <!-- <div v-for="(course, number) in filterRegistered" 
          :key="number"
          class="class-entry">
          <div class="class-info" v-if="!props.coursePlans[props.currentPlan][number]">
            <span class="class-title">
              <input type="checkbox" class="class-checkbox" @click.stop="selectCourse(number)">
              {{ number }} {{ course.name }}
              <span v-if="course.registered" class="check-icon">&#x2714;</span>
              <span v-else-if="course.inPlan" class="check-icon outlined">&#9993;</span>
            </span>
          </div>
        </div> -->
      <div v-for="(course, number) in props.coursePlans[props.currentPlan]"
        :key="number"
        class="class-entry">
        <div class="class-info">
          <span class="class-title">
            <input type="checkbox" class="class-checkbox" @click.stop="selectCourse(number)">
            {{ number }} {{ course.name }}
            <span v-if="course.registered" class="check-icon">&#x2714;</span>
            <span v-else-if="course.inPlan" class="check-icon outlined">&#9993;</span>
          </span>
        </div>
      </div>
    </div>
    <div class="button-column"> 
      <BaseButton :buttonName="'Drop Selected Courses'" :buttonWidth="400" :buttonHeight="100" class="register-button" @click="dropCourses(props.currentPlan)"></BaseButton>
      <BaseButton :buttonName="'Register Selected Courses'" :buttonWidth="400" :buttonHeight="100" class="register-button" @click="registerForClasses(props.currentPlan, selectedCourses)"></BaseButton>
      <BaseButton :buttonName="'Register All'" :buttonWidth="400" :buttonHeight="100" class="register-button" @click="registerForClasses(props.currentPlan, Object.keys(props.coursePlans[props.currentPlan]))"></BaseButton>
      <BaseButton :buttonName="'View Schedule'" :buttonWidth="400" :buttonHeight="100" class="register-button" @click="emit('toggle-page', 'SchedulePage')"></BaseButton>
    </div>
    <div class="modal-overlay" v-if="registeringCourses">
      <div class="modal-content" v-if="!conflicts.length">
        <button class="close-x" @click="registeringCourses = false">X</button>
        <h2 class="register-success">Registered!</h2>
      </div>
      <div class="register-failure" v-if="conflicts.length">
        <div class="modal-content" v-if="conflicts.length">
          <button class="close-x" @click="registeringCourses = false">X</button>
          <h2 style="color: red; font-weight: 700px;">Error: Time Conflicts</h2>
          <div v-for="conflict in conflicts" :key="conflict">
            <strong>{{ conflict }}</strong> - {{ translateDates(props.coursePlans[props.currentPlan][conflict].time, props.coursePlans[props.currentPlan][conflict].dates) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import BaseButton from '../global/BaseButton.vue'

interface Course {
  name: string;
  professor: string;
  time: string;
  dates: string;
  location: string;
  registered?: boolean;
  inPlan? : boolean;
}

interface Props {
  coursePlans: Record<string, Record<string, Course>>
  registeredCourses: Record<string, Course>
  currentPlan: string
}
const props = defineProps<Props>();
const emit = defineEmits(["select-plan", "register-courses", "drop-courses", "toggle-page"]);

const selectPlan = (event: Event) => {
  emit('select-plan', (event.target as HTMLSelectElement).value);
}

// const filterRegistered = computed(() => {
//   return Object.entries(props.registeredCourses).filter(([number]) => !props.coursePlans[props.currentPlan][number]);
// })

const translateDates = (time: string, dates: string) => {
  if (dates[1] === "R") {
    dates = "TTh"
  }
  return dates + " " + time;
}

const selectedCourses = ref<Array<string>>([]);
const conflicts = ref<Array<string>>([]);

const checkForErrors = (planName: string, courseNumbers: string[]) => {
  const seen: Record<string, string[]> = {};
  const conflicts = new Set<string>();

  for (const courseNumber of courseNumbers) {
    const course = props.coursePlans[planName][courseNumber]
    const dateAndTime = course.dates + course.time;

    if (seen[dateAndTime]) {
      conflicts.add(courseNumber);
      seen[dateAndTime].forEach(prev => conflicts.add(prev));
      seen[dateAndTime].push(courseNumber);
    }
    else {
      seen[dateAndTime] = [courseNumber]
    }
  }

  return conflicts.size > 0 ? Array.from(conflicts) : false
}

const selectCourse = (number: string) => {
  if (selectedCourses.value.includes(number)) {
    const index = selectedCourses.value.indexOf(number);
    selectedCourses.value.splice(index, 1); 
  }
  else {
    selectedCourses.value.push(number);
  }
}

const dropCourses = (planName: string) => {
  emit("drop-courses", planName, selectedCourses.value);
  selectedCourses.value = [];
}

const registeringCourses = ref<boolean>(false)
const registerForClasses = (planName: string, courseNumbers: string[]) => {
  const checkConflicts = checkForErrors(planName, courseNumbers);
  if (checkConflicts === false) {
    emit("register-courses", planName, courseNumbers);
  }
  else {
    conflicts.value = checkConflicts;
  }
  registeringCourses.value = true
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Roboto:wght@100..900&display=swap');

.container {
  display: flex;
  padding: 20px;
  gap: 20px;
  height: 100%;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.classes-block {
  border: 2px solid #807e7e;
}

.plans-title {
  margin: 20px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  color: #f4a300;
  font-size: 48px;
  text-align: center;
}

.plan-selector {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.plan-selector-label {
  font-weight: bold;
  margin-right: 12px;
  color: white;
  font-size: 24px;
}

.plan-selector-dropdown {
  padding: 10px 16px;
  border: 1px solid #ccc;
  background: white;
  font-size: 1rem;
  min-width: 180px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: background-color 0.2s ease;
}

.plan-selector-dropdown option:hover {
  background-color: #f0e6ff;
}

.classes-block {
  width: 700px;
  height: 620px;
  background-color: #0C2340;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.class-entry {
  background-color: #e7eaec;
  color: black;
  padding: 30px;
  border: 2px solid black;
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
}

.class-info {
  display: flex;
  flex-direction: column;
  justify-content: left;
}

.class-title {
  font-weight: bold;
}

.class-time {
  font-size: 0.8rem;
  align-self: flex-end;
}

.class-checkbox {
  margin-right: 10px;
  vertical-align: middle;
}

.button-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  min-height: 600px;
  font-family: 'Roboto', sans-serif;
  margin-left: 200px;
}

.register-button {
  display: flex;
  margin: auto;
  align-items: center;
  font-family: 'Roboto', sans-serif;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background-color: #002349;
  color: white;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.close-x {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: bold;
  z-index: 1;
}

.register-success {
  color: #20ad58;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 48px;
}

.error-title {
  font-size: 48px;
  margin-bottom: 16px;
}

.conflict-list {
  padding: 0;
  list-style: disc;
}

.check-icon {
  margin-left: 8px;
  font-size: 24px;
  color: black;
  text-decoration: none;
  display: inline-block;
}

.check-icon.outlined {
  color: black;
  -webkit-text-stroke: 1px black;
  color: transparent;
  text-decoration: none;
}
</style>