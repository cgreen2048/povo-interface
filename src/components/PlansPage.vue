<template>
  <div class="container">
    <div class="plans-block">
      <div class="plans">
        <div class="plans-title">Plans</div>
        <BaseButton v-for="(courses, plan) in props.coursePlans" :key="plan"
        class="plan-button"
          :buttonName="plan"
          :buttonWidth="250"
          :buttonHeight="80"
          :class="{ 'active-plan': props.currentPlan === plan }"
          @click="emit('select-plan', plan)">
        </BaseButton>
        <BaseButton :buttonName="'New Plan +'" :buttonWidth="250" :buttonHeight="80" class="plan-button" @click="addNewPlan = !addNewPlan"></BaseButton>
      </div>
      <BaseButton v-if="!editPlan" :buttonName="'Edit Plan'" :buttonWidth="200" :buttonHeight="50" class="plan-button" @click="editPlan = !editPlan"></BaseButton>
    </div>

    <div class="classes-block">
      <div v-for="(course, number) in props.coursePlans[props.currentPlan]"
        :key="number"
        class="class-entry">
        <div class="class-info">
          <span class="class-title" @click="openMoreInfo(number, course)">
            <template v-if="editPlan">
              <input type="checkbox" class="class-checkbox" @click.stop="selectCourse(number)">
            </template>
            {{ number }} {{ course.name }}
            <span v-if="course.registered" class="check-icon">&#x2714;</span>
            <span v-else-if="course.inPlan" class="check-icon outlined">&#9993;</span>
          </span>
        </div>
        <div class="class-time-block">
          <div class="class-time">{{ translateDates(course.time, course.dates) }}</div>
          <div class="time-conflicts" v-if="checkForConflicts(course)">Time Conflict: {{ checkForConflicts(course) }}</div>
        </div>
      </div>
      <div class="class-entry add-class" @click="emit('toggle-page', 'SearchPage')">
        <span>Add Class From Search</span>
        <span class="plus-sign">+</span>
      </div>
      <div class="editingButtons" v-if="editPlan">
        <BaseButton :buttonName="'Drop Courses'" :buttonWidth="400" :buttonHeight="50" class="editing-button-left" @click="dropCourses"></BaseButton>
        <BaseButton :buttonName="'Cancel'" :buttonWidth="400" :buttonHeight="50" class="editing-button-right" @click="editPlan = !editPlan"></BaseButton>
      </div>
    </div>
  </div>
  <div v-if="addNewPlan" class="modal-overlay">
    <div class="modal-content">
      <button class="close-x" @click="addNewPlan = !addNewPlan">X</button>
      <h2>New Plan Name:</h2>
      <textarea  class="enter-box" placeholder="New Plan..." @keyup="createNewPlan"></textarea>
    </div>
  </div>
  <div v-if="moreInfo" class="modal-overlay">
    <div class="modal-content">
        <button class="close-x" @click="closeMoreInfo">X</button>
        <h2>{{ selectedNumber }} - {{ selectedCourse?.name }}</h2>
        <p><strong>Professor:</strong> {{ selectedCourse?.professor }}</p>
        <p><strong>Time:</strong> {{ selectedCourse?.time }}</p>
        <p><strong>Dates:</strong> {{ translateDates(selectedCourse?.time, selectedCourse?.dates).split(" ")[0] }}</p>
        <p><strong>Credits:</strong> {{ selectedCourse?.credits }}</p>
        <p><strong>Location:</strong> {{ selectedCourse?.location }}</p>
        <p><strong>Requirements:</strong> {{ selectedCourse?.requirements }}</p>
        <p><strong>Description:</strong> {{ selectedCourse?.description }}</p>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, withDefaults } from 'vue'
import BaseButton from '../global/BaseButton.vue'
import type { Course, CoursePlans } from '@/App.vue';

interface Props {
  coursePlans?: CoursePlans
  currentPlan?: string
}

const props = withDefaults(defineProps<Props>(), {
  coursePlans: {
    "Heavy CS": {
      "CSE 30311": {
        name: "Theory of Computing",
        professor: "David Chiang",
        time: "2:00PM-3:15PM",
        dates: "TR",
        location: "DeBartolo Hall 126",
        credits: "3",
        requirements: "CSE Major Requirement",
        description:
          "Introduction to formal languages and automata, computability theory, and complexity theory with the goal of developing understanding of the power and limits of different computational models. Topics covered include: regular languages and finite automata; context-free grammars and pushdown automata; Turing machines; undecidable languages; the classes P and NP; NP completeness",
        inPlan: true,
      },
      "CSE 30124": {
        name: "Introduction to Artificial Intelligence",
        professor: "William Theisen",
        time: "2:00PM-3:15PM",
        dates: "MW",
        location: "DeBartolo Hall 155",
        credits: "3",
        requirements: "CSE Elective",
        description:
          "Foundational concepts and techniques in AI and machine learning. Historical overview of the field. Search and logic programming. Canonical machine learning tasks and algorithms: supervised and unsupervised learning (classification and regression). Essential concepts from probability and statistics relevant to machine learning. Performance characterization. Modern software environments for machine learning and AI programming. Applications in unsupervised and supervised learning from image and textual data.",
        inPlan: true,
      },
    },
    "Major Reqs": {
      "CSE 30311": {
        name: "Theory of Computing",
        professor: "David Chiang",
        time: "2:00PM-3:15PM",
        dates: "TR",
        location: "DeBartolo Hall 126",
        credits: "3",
        requirements: "CSE Major Requirement",
        description:
          "Introduction to formal languages and automata, computability theory, and complexity theory with the goal of developing understanding of the power and limits of different computational models. Topics covered include: regular languages and finite automata; context-free grammars and pushdown automata; Turing machines; undecidable languages; the classes P and NP; NP completeness",
        inPlan: true,
      },
      "CSE 30341": {
        name: "Operating System Principles",
        professor: "Douglas Thain",
        time: "9:30AM-10:45AM",
        dates: "TR",
        location: "Pasquerilla Center 107",
        credits: "3",
        requirements: "CSE Major Requirement",
        description:
          "Introduction to all aspects of modern operating systems. Topics include process structure and synchronization, interprocess communication, memory management, file systems, security, I/O, and distributed files systems",
        inPlan: true,
      },
      "MATH 30750": {
        name: "Real Analysis",
        professor: "Qing Han",
        time: "9:25AM-10:15AM",
        dates: "MWF",
        location: "Riley Hall 200",
        credits: "3",
        requirements: "CHEM Elective, WKQR Core Quantitative Reasoning",
        description:
          "A rigorous treatment of differential and integral calculus. Topics include a review of sequences and continuity, differentiability, Taylor's theorem, integration, the fundamental theorem of Calculus, pointwise and uniform convergence, and power series.",
        inPlan: true,
      },
    },
  },
  currentPlan: "Heavy CS",
})
const emit = defineEmits(["select-plan", "create-new-plan", "toggle-page", "drop-courses"])

const addNewPlan = ref<boolean>(false)
const createNewPlan = (event: KeyboardEvent) => {
  const textarea = event.target as HTMLTextAreaElement;
  const planName = textarea.value;
  if (event.key === "Enter") {
    console.log(planName)
    emit("create-new-plan", planName)
    addNewPlan.value = !addNewPlan.value;
  }
}

const translateDates = (time: string | undefined, dates: string | undefined) => {
  if (dates[1] === "R") {
    dates = "TTh"
  }
  return dates + " " + time;
}

const checkForConflicts = (course: Course) => {
  let conflicts = "";
  for (const [planNumber, planCourse] of Object.entries(props.coursePlans[props.currentPlan])) {
    if (translateDates(planCourse.time, planCourse.dates) === translateDates(course.time, course.dates) && planCourse != course) {
      conflicts += planNumber + ", "
      console.log(translateDates(planCourse.time, planCourse.dates))
      console.log(translateDates(course.time, course.dates))
    }
  }
  if (conflicts.length > 0) {
    return conflicts.slice(0, -2);
  }
  return false;
}

const moreInfo = ref<boolean>(false)
const selectedCourse = ref<Course | null>(null)
const selectedNumber = ref<string>("")

const openMoreInfo = (number: string, course: Course) => {
  selectedNumber.value = number;
  selectedCourse.value = course;
  moreInfo.value = true;
  console.log(moreInfo.value)
}

const closeMoreInfo = () => {
  moreInfo.value = false;
  selectedCourse.value = null;
}

const editPlan = ref<boolean>(false)

const selectedCourses = ref<Array<string>>([]);
const selectCourse = (number: string) => {
  if (selectedCourses.value.includes(number)) {
    const index = selectedCourses.value.indexOf(number);
    selectedCourses.value.splice(index, 1); 
  }
  else {
    selectedCourses.value.push(number);
  }
}

const dropCourses = () => {
  editPlan.value = false;
  emit('drop-courses', props.currentPlan, selectedCourses.value);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Roboto:wght@100..900&display=swap'); 

.container {
  display: flex;
  padding: 20px;
  width: 100%;
  gap: 20px;
  box-sizing: border-box;
  justify-content: center;
}

.plans-block {
  background-color: #0b2341;
  border: 2px solid #807e7e;
  color: white;
  padding: 10px;
  border-radius: 10px;
  width: 300px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-family: 'Roboto', sans-serif;
}

.plans-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  color: #f4a300;
  font-size: 48px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}

.plan-button {
  margin-bottom: 20px;
}

.active-plan {
  border: 2px solid #f4a300;
  font-weight: 700;
}

.active-plan:hover {
  border: 2px solid #f4a300;
  background-color: #00843d;
}

.classes-block {
  width: 1200px;
  background-color: #0b2341;
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

.class-entry:first-child {
  border-radius: 10px 10px 0 0;
}

.class-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  font-size: 24px
}

.class-title {
  font-weight: bold;
  text-decoration: underline;
  font-family: 'Roboto', sans-serif;
  transition: color 0.2s ease, text-decoration 0.2s ease;
}

.class-title:hover {
  text-decoration: none;
  cursor: pointer;
  color: #f4a300;
}

.class-timing-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: 'Roboto', sans-serif;
}

.class-time {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 18px
}

.time-conflicts {
  font-size: 18px;
  font-weight: 700px;
  color: rgb(246, 77, 77);
  margin-top: 4px;
}

.add-class {
  cursor: pointer;
  border-bottom: 2px solid black;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 24px
}

.plus-sign {
  font-size: 24px;
  font-weight: bold;
}

.class-checkbox {
  margin-right: 10px;
  vertical-align: middle;
  text-decoration: none;
}

.editingButtons {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.editing-button-left {
  margin-right: 10px;
}

.editing-button-right {
  margin-left: 10px;
}

.enter-box {
  width: 200px;
  height: 20px;
  border: 2px solid #807e7e;
  padding: 12px;
  border-radius: 20px;
  resize: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  outline: none;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  margin-bottom: 1.5em;
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
  text-align: left;
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
  transition: color 0.3s ;
}

.close-x:hover {
  color: rgb(246, 77, 77);
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