<template>
  <div>
    <NavBar v-if="route.name" class="lg:block"></NavBar>
    <div class="main-area text-center w-full h-full min-h-screen items-center justify-center flex flex-col overflow-auto p-4" id="main-area">
      <div class="flex flex-1 items-center justify-center">
        <Transition name="fade" mode="out-in">
          <router-view class="z-10 w-full" />
        </Transition>
      </div>
      <footer class="w-full justify-center mt-auto text-xs lg:text-sm text-muted-green z-10">
        <span>© 2025 Clair Green. All rights reserved.</span>
      </footer>
    </div>
  </div>
  <!-- <div class="page">
    <NavBar></NavBar>
    <Transition name="fade" mode="out-in">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"

          :coursePlans="coursePlans"
          :registeredCourses="registeredCourses"

          :currentPlan="currentPlan"
          :currentTab="currentTab"
          :openTabs="openTabs"

       
          @select-plan="selectPlan"
          @create-new-plan="createNewPlan"
          @register-courses="registerCourses"
          @drop-courses="dropCourses"
          @add-course="addCourse"
          @drop-course="dropCourse"
          @toggle-page="togglePage"
        />
      </router-view>
    </Transition>
    <HomePage v-if="currentPage === 'HomePage'" 
      @toggle-page="togglePage"
    ></HomePage>
    <PlansPage v-if="currentPage === 'CoursePlansPage'" 
      :coursePlans="coursePlans"
      :currentPlan="currentPlan"
      @select-plan="selectPlan"
      @create-new-plan="createNewPlan"
      @toggle-page="togglePage"
      @drop-courses="dropCourses">
    </PlansPage>
    <RegistrationPage v-if="currentPage === 'CourseRegistrationPage'"
      :coursePlans="coursePlans"
      :currentPlan="currentPlan"
      :registeredCourses="registeredCourses"
      @select-plan="selectPlan"
      @register-courses="registerCourses"
      @drop-courses="dropCourses"
      @toggle-page="togglePage">
    </RegistrationPage>
    <SchedulePage v-if="currentPage === 'SchedulePage'"
      :coursePlans="coursePlans"
      :currentPlan="currentPlan"
      @select-plan="selectPlan">
    </SchedulePage>
    <SearchPage v-if="currentPage === 'SearchPage'"
      :coursePlans="coursePlans"
      :currentPlan="currentPlan"
      @add-course="addCourse"
      @drop-course="dropCourse"
      @select-plan="selectPlan">
    </SearchPage>
  </div> -->
</template>

<script lang="ts" setup>
//import { ref } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
// import HomePage from './components/HomePage.vue';
// import PlansPage from './components/PlansPage.vue';
// import RegistrationPage from './components/RegistrationPage.vue';
// import SchedulePage from './components/SchedulePage.vue';
// import SearchPage from './components/SearchPage.vue';

// v-if="route.name != 'Home'"
const route = useRoute();


// ### TABS BAR ###
// const currentPage = ref<string>("HomePage");
// const openTabs = ref<Array<string>>(["CoursePlansPage", "CourseRegistrationPage", "SchedulePage", "SearchPage"]);
// const currentTab = ref<string>("");

// const togglePage = (pageName: string) => {
//   if (pageName) {
//     currentPage.value = pageName;
//     if (pageName != "HomePage") {
//       currentTab.value = pageName
//       openTabs.value = ["CoursePlansPage", "CourseRegistrationPage", "SchedulePage", "SearchPage"]
//     }
//     else {
//       openTabs.value = []
//     }
//   }
// }

// // ### PLANS ###
// interface Course {
//   name: string;
//   professor: string;
//   time: string;
//   dates: string;
//   credits: string;
//   location: string;
//   requirements: string;
//   description: string
//   registered?: boolean
//   inPlan? : boolean,
// }

// const coursePlans = ref<Record<string, Record<string, Course>>>({
//   "Heavy CS": {
//     "CSE 30311": {
//       name: "Theory of Computing",
//       professor: "David Chiang",
//       time: "2:00PM-3:15PM",
//       dates: "TR",
//       location: "DeBartolo Hall 126",
//       credits: "3",
//       requirements: "CSE Major Requirement",
//       description: "Introduction to formal languages and automata, computability theory, and complexity theory with the goal of developing understanding of the power and limits of different computational models. Topics covered include: regular languages and finite automata; context-free grammars and pushdown automata; Turing machines; undecidable languages; the classes P and NP; NP completeness",
//       inPlan: true,
//     },
//     "CSE 30124": {
//       name: "Introduction to Artificial Intelligence",
//       professor: "William Theisen",
//       time: "2:00PM-3:15PM",
//       dates: "MW",
//       location: "DeBartolo Hall 155",
//       credits: "3",
//       requirements: "CSE Elective",
//       description: "Foundational concepts and techniques in AI and machine learning. Historical overview of the field. Search and logic programming. Canonical machine learning tasks and algorithms: supervised and unsupervised learning (classification and regression). Essential concepts from probability and statistics relevant to machine learning. Performance characterization. Modern software environments for machine learning and AI programming. Applications in unsupervised and supervised learning from image and textual data.",
//       inPlan: true,
//     }
//   },
//   "Major Reqs": {
//     "CSE 30311": {
//       name: "Theory of Computing",
//       professor: "David Chiang",
//       time: "2:00PM-3:15PM",
//       dates: "TR",
//       location: "DeBartolo Hall 126",
//       inPlan: true,
//       credits: "3",
//       requirements: "CSE Major Requirement",
//       description: "Introduction to formal languages and automata, computability theory, and complexity theory with the goal of developing understanding of the power and limits of different computational models. Topics covered include: regular languages and finite automata; context-free grammars and pushdown automata; Turing machines; undecidable languages; the classes P and NP; NP completeness"
//     },
//     "CSE 30341": {
//       name: "Operating System Principles",
//       professor: "Douglas Thain",
//       time: "9:30AM-10:45AM",
//       dates: "TR",
//       location: "Pasquerilla Center 107",
//       inPlan: true,
//       credits: "3",
//       requirements: "CSE Major Requirement",
//       description: "Introduction to all aspects of modern operating systems. Topics include process structure and synchronization, interprocess communication, memory management, file systems, security, I/O, and distributed files systems"
//     },
//     "MATH 30750": {
//       name: "Real Analysis",
//       professor: "Qing Han",
//       time: "9:25AM-10:15AM",
//       dates: "MWF",
//       location: "Riley Hall 200",
//       inPlan: true,
//       credits: "3",
//       requirements: "CHEM Elective, WKQR Core Quantitative Reasoning",
//       description: "A rigorous treatment of differential and integral calculus. Topics include a review of sequences and continuity, differentiability, Taylor's theorem, integration, the fundamental theorem of Calculus, pointwise and uniform convergence, and power series. Additional topics are likely and will depend on the instructor. Emphasis throughout will be on careful mathematical definitions and thorough understanding of basic results"
//     }
//   }
// })

// const currentPlan = ref<string>("Heavy CS");

// const selectPlan = (planName: string) => {
//   currentPlan.value = planName;
// }

// const createNewPlan = (planName: string) => {
//   coursePlans.value[planName] = {}
//   selectPlan(planName)
// }

// const dropCourses = (planName: string, courseNumbers: Array<string>) => {
//   for (const courseNumber of courseNumbers) {
//     delete coursePlans.value[planName][courseNumber];
//   }
// }

// // ### REGISTRATION ###
// const registeredCourses = ref<Record<string, Course>>({})
// const registerCourses = (planName: string, courseNumbers: Array<string>) => {
//   for (const courseNumber of courseNumbers) {
//     coursePlans.value[planName][courseNumber].registered = true;
//     registeredCourses.value[courseNumber] = coursePlans.value[planName][courseNumber]
//   }
//   currentPlan.value = planName;
// }

// // ### SEARCH ###
// const addCourse = (planName: string, number: string, course: Course) => {
//   course.inPlan = true
//   coursePlans.value[planName][number] = course;
// }

// const dropCourse = (planName: string, number: string) => {
//   delete coursePlans.value[planName][number]
//   console.log(coursePlans.value[planName]);
// }

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; 
  min-height: 100%;
}

.main-area {
  background: linear-gradient(to bottom, #edf7ed, #dfeee0, #edf7ed);
}

html, body {
  height: 100%;
  margin: 0px;
  padding: 0;
}
</style>
