<template>
  <div>
    <div class="search-container" v-if="!searchEntered">
      <div class="search-title">What are you searching for?</div>
      <div class="search-row">
        <textarea class="search-box" placeholder="Ask anything..." @keyup="displayResults"></textarea>
        <button class="filter-toggle-btn" @click="addingFilters = !addingFilters">Filters</button>
      </div>
      <div class="filter-content" v-if="addingFilters">
        <div class="tab-bar">
          <BaseTab class="filter-tab" v-for="tab in tabs" 
            :key="tab" 
            :tabName="tab" 
            :isSelected="tab === currentTab"
            @click="currentTab = tab">
          </BaseTab>
      </div>
        <div v-if="currentTab === 'Recent Filters'">
          <p>Recent filters will go here.</p>
        </div>
  
        <div v-if="currentTab === 'Saved Filters'">
          <p>Saved filters will go here.</p>
        </div>
  
        <div class="add-filter-form" v-if="currentTab === 'Add Filter'">
          <div class="filter-row" v-for="field in filterFields" :key="field.label">
            <label>{{ field.label }}</label>
            <input v-model="field.model" type="text" />
          </div>
          <button class="add-filter-btn">Add Filter</button>
        </div>
      </div>
    </div>
    <div class="search-entered" v-if="searchEntered">
      <div class="search-title entered">
        Sure! Here are some of the typical courses for a Computer Science major:
      </div>
    
      <div class="course-card" v-for="(course, number) in coursePlaceholders" :key="number">
        <div class="course-title">
          <span class="course-code-name">{{ number + " " + course.name }} 
            <span v-if="courseRegistered(number)" class="check-icon">&#x2714;</span>
            <span v-else-if="courseInPlan(number)" class="check-icon outlined">&#9993;</span>
          </span>
          <span class="requirement-tag">CSE Major Requirement</span>
        </div>
        <div class="course-info">
          <div class="course-dates"><strong>Time:</strong> {{ translateDates(course.time, course.dates) }}</div>
          <div class="course-professor"><strong>Professor:</strong> {{ course.professor[0] + ". " + course.professor.split(" ")[course.professor.split(" ").length - 1] }}</div>
          <button class="more-info-btn" @click="openMoreInfo(number, course)">More Info</button>
        </div>
      </div>
      <div class="search-row">
        <textarea class="search-box" style="margin: 0px;" placeholder="Ask anything..." @keyup="displayResults"></textarea>
        <button class="filter-toggle-btn" @click="addingFilters = !addingFilters">Filters</button>
      </div>
    </div>
    <div v-if="moreInfo" class="modal-overlay">
      <div class="modal-content">
        <button class="close-x" @click="closeMoreInfo">X</button>
        <h2>{{ selectedNumber }} - {{ selectedCourse.name }}</h2>
        <p><strong>Professor:</strong> {{ selectedCourse.professor }}</p>
        <p><strong>Time:</strong> {{ selectedCourse.time }}</p>
        <p><strong>Dates:</strong> {{ translateDates(selectedCourse.time, selectedCourse.dates).split(" ")[0] }}</p>
        <p><strong>Credits:</strong> {{ selectedCourse.credits }}</p>
        <p><strong>Location:</strong> {{ selectedCourse.location }}</p>
        <p><strong>Requirements:</strong> {{ selectedCourse.requirements }}</p>
        <p><strong>Description:</strong> {{ selectedCourse.description }}</p>
        <div v-if="!courseInPlan(selectedNumber)">
          <p v-if="checkForConflicts(selectedCourse)">This course <strong class="conflict-indicator">does not fit</strong> in the current plan (Time Conflict: {{ checkForConflicts(selectedCourse) }})</p>
          <p v-if="!checkForConflicts(selectedCourse)">This course <strong class="no-conflicts">fits</strong> in the current plan!</p>
        </div>
        <div class="modal-buttons">
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
          <BaseButton :buttonName="'Add To Plan'" :buttonWidth="360" :buttonHeight="50" v-if="!courseInPlan(selectedNumber)" @click="addCourse(selectedNumber, selectedCourse)"></BaseButton>
          <BaseButton :buttonName="'Drop From Plan'" :buttonWidth="360" :buttonHeight="50" v-if="courseInPlan(selectedNumber)" @click="dropCourse(selectedNumber)"></BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import BaseButton from '@/components/global/BaseButton.vue';
import BaseTab from '@/components/global/BaseTab.vue';

interface Props {
  coursePlans: Record<string, Record<string, Course>>;
  currentPlan: string;
}
const props = defineProps<Props>();

const emit = defineEmits(["add-course", "drop-course", "select-plan"]);

interface Course {
  name: string;
  professor: string;
  time: string;
  dates: string;
  location: string;
  description: string
  credits: string
  requirements: string;
  registered?: boolean
  inPlan? : boolean
}

const coursePlaceholders: Record<string, Course> = {
  "CSE 30332": {
    name: "Programming Paradigms",
    professor: "Joanna Cecilia da Silva Santos",
    time: "2:00PM-3:15PM",
    dates: "MW",
    location: "DeBartolo Hall 126",
    inPlan: false,
    credits: "3",
    requirements: "CSE Major Requirement",
    description: "Programming language overview: imperative and functional languages; logic programming. Scripting languages and tools. Development environments. Multilanguage interfacing. Case studies. Comprehensive programming practice using several languages."
  },
  "CSE 40113": {
    name: "Design/Analysis of Algorithms",
    professor: "Erin Chambers",
    time: "10:30AM-11:20AM",
    dates: "MWF",
    location: "Cushing Hall of Engineering 303",
    inPlan: false,
    credits: "3",
    requirements: "CSE Major Requirement",
    description: "Techniques for designing efficient computer algorithms and for analyzing computational costs of algorithms. Common design strategies such as dynamic programming, divide-and-conquer, and Greedy methods. Problem-solving approaches such as sorting, searching, and selection; lower bounds; data structures; algorithms for graph problems; geometric problems; and other selected problems. Computationally intractable problems (NP-completeness)."
  },
  "CSE 40175": {
    name: "Ethical and Professional Issues",
    professor: "Kevin Bowyer",
    time: "11:00AM-12:15PM",
    dates: "TR",
    location: "Jordon Hall of Science 105",
    inPlan: false,
    credits: "3",
    requirements: "CSE Major Requirement",
    description: "This course seeks to develop a solid foundation for reasoning about ethical, professional, and social issues that arise in the context of computer science and engineering. Emphasis is placed on identifying appropriate legal, professional and moral contexts and on applying sound critical thinking skills to a problem. Topics covered include professional codes of ethics, safety-critical systems, whistle blowing, privacy and surveillance, freedom of speech, intellectual property, and cross-cultural issues. This course relies heavily on case studies of real-world incidents."
  },
}

const courseRegistered = (number: string) => {
  if (Object.keys(props.coursePlans[props.currentPlan]).includes(number)) {
    if (props.coursePlans[props.currentPlan][number].registered) {
      return true;
    }
  }
  return false;
}

const courseInPlan = (number: string) => {
  if (Object.keys(props.coursePlans[props.currentPlan]).includes(number)) {
    if (props.coursePlans[props.currentPlan][number].inPlan) {
      return true;
    }
  }
  return false;
}

const addingFilters = ref<boolean>(false);
const tabs = ref<Array<string>>(["Recent Filters", "Saved Filters", "Add Filter"]);
const currentTab = ref<string>("Add Filter");

const filterFields = ref([
  { label: 'Professor:', model: '' },
  { label: 'Department:', model: '' },
  { label: 'College:', model: '' },
  { label: 'Time:', model: '' },
  { label: 'Days:', model: '' },
  { label: 'Core Reqs:', model: '' },
  { label: 'Attributes:', model: '' }
])

const searchEntered = ref<boolean>(false);
const displayResults = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    searchEntered.value = true;
  }
}

const translateDates = (time: string, dates: string) => {
  if (dates[1] === "R") {
    dates = "TTh"
  }
  return dates + " " + time;
}

const moreInfo = ref<boolean>(false)
const selectedCourse = ref<Course>(coursePlaceholders["CSE 40175"])
const selectedNumber = ref<string>("")

const openMoreInfo = (number: string, course: Course) => {
  selectedNumber.value = number;
  selectedCourse.value = course;
  moreInfo.value = true;
}

const closeMoreInfo = () => {
  moreInfo.value = false;
  selectedCourse.value = coursePlaceholders["CSE 40175"];
}

const checkForConflicts = (course: Course) => {
  let conflicts = "";
  for (const [planNumber, planCourse] of Object.entries(props.coursePlans[props.currentPlan])) {
    if (translateDates(planCourse.time, planCourse.dates) === translateDates(course.time, course.dates)) {
      conflicts += planNumber + ", "
    }
  }
  if (conflicts.length > 0) {
    return conflicts.slice(0, -2);
  }
  return false;
}

const selectPlan = (event: Event) => {
  emit('select-plan', (event.target as HTMLSelectElement).value);
}

const addCourse = (number: string, course: Course) => {
  moreInfo.value = false;
  emit("add-course", props.currentPlan, number, course)
}

const dropCourse = (number: string) => {
  moreInfo.value = false;
  emit("drop-course", props.currentPlan, number)
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Roboto:wght@100..900&display=swap');

.search-container {
  position: relative;
  margin-top: 480px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: auto;
  width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background-color: #0C2340;
  border: 2px solid #807e7e;
  border-radius: 10px;
}

.search-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.search-title {
  margin: 20px;
  font-size: 36px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  color: #fbbf24;
}

.search-title.entered {
  margin: 20px;
  font-size: 24px;
  margin-bottom: 40px;
  text-align: center;
}

.search-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 16px;
}

.search-box {
  width: 800px;
  height: 20px;
  padding: 18px;
  border: 2px solid #807e7e;
  border-radius: 20px 0 0 20px;
  resize: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  outline: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  margin-bottom: 20px;
}

.tab-bar {
  display: flex;
  width: 100%;
  margin-bottom: 12px;
}

.tab-bar > * {
  flex: 1;
  text-align: center;
}

.filter-tab:last-child {
  border-right: 2px solid black;
}

.filter-content {
  position: absolute;             
  left: 0;
  bottom: 106%;
  min-height: 300px;
  width: 980px;
  background-color: #0C2340;
  color: white;
  border: 2px solid #807e7e;
  z-index: 10;
  border-radius: 10px;
  padding: 10px;
}

.add-filter-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-row label {
  width: 120px;              
  font-weight: bold;
}

.filter-row input {
  flex: 1;                   
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-filter-btn {
  align-self: flex-end;
  margin: 10px;
  padding: 6px 12px;
  background-color: #12a356;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.add-filter-btn:hover {
  background-color: #13753A;
}

.filter-toggle-btn {
  background-color: #12a356;
  color: white;
  width: 60px;
  height: 60px;
  border: 2px solid #807e7e;
  border-left: none;
  border-radius: 0px 10px 10px 0px;
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
}

.filter-toggle-btn:hover {
  background-color: #13753A;
}

.search-entered {
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 1000px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #002349;
  border-radius: 10px;
  border: 2px solid #807e7e;
  padding: 20px;
  color: white;
  text-align: left;
}

.course-card {
  width: 91%;
  margin-bottom: 30px;
  font-family: Roboto, sans-serif;
  font-weight: 400;
}

.course-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
}

.course-code-name {
  font-size: 18px;
  font-weight: 700;
  font-family: Roboto;
}

.check-icon {
  margin-left: 8px;
  font-size: 18px;
  color: white;
  text-decoration: none;
  display: inline-block;

}

.check-icon.outlined {
  color: white;
  -webkit-text-stroke: 1px white;
  color: transparent;
  text-decoration: none;
}

.requirement-tag {
  font-weight: bold;
  margin-left: 20px;
}

.course-info {
  padding-left: 20px;
}

.course-dates,
.course-professor {
  margin-bottom: 5px;
}

.search-text {
  margin-bottom: 20px;
}

.more-info-btn {
  background: none;
  border: none;
  color: white;
  text-decoration: underline;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;
  transition: color 0.2s ease, text-decoration 0.2s ease;
}

.more-info-btn:hover {
  text-decoration: none;
  color: #c99700;
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
  font-family: Roboto, sans-serif;
  color: white;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  text-align: left;
}

.modal-buttons {
  display: flex; 
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.conflict-indicator {
  color: red;
  font-size: 24px;
}

.no-conflicts {
  color: #12a356;
  font-size: 24px;
}

.plan-selector {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
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
  transition: color 0.3s;
}

.close-x:hover {
  color: rgb(246, 77, 77);
}
</style>