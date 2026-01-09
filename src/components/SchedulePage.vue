<template>
  <div class="calendar">
    <vue-cal
      :hideWeekends="true"
      :views-bar="false"
      :title-bar="false" 
      :time-from="8 * 60"
      :time-to="19 * 60"
      :events="courseEvents">
      <template #time-cell="{ format12 }">
        <strong>{{ format12 }}</strong>
      </template>
      <template #weekday-heading="{ label, id }">
        <strong :class="id">{{ label }}</strong>
      </template>
      <template #event="{ event }">
        <div class="custom-event" @click="findCourse(event.title)">
          <strong class="event-title">{{ event.title }}</strong>
          <div class="event-time">{{ formatDate(event.start, event.end) }}</div>
          <div class="event-content">{{ event.content.split(" ")[0] + " " + event.content.split(" ")[event.content.split(" ").length - 1] }}</div>
        </div>
      </template>
    </vue-cal>
    <div class="plans-block">
      <div class="plans">
        <div class="button-row">
          <BaseButton v-for="(courses, plan) in props.coursePlans" :key="plan"
            :buttonName="plan"
            :buttonWidth="250"
            :buttonHeight="80"
            :class="{ 'active-plan': props.currentPlan === plan }"
            @click="emit('select-plan', plan)">
          </BaseButton>
        </div>
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
  </div> 
</template>

<script lang="ts" setup>
//@ts-ignore
import { VueCal } from 'vue-cal'
import 'vue-cal/style'
import { ref, defineProps, defineEmits, computed } from 'vue'
import BaseButton from '@/components/global/BaseButton.vue'

interface Props {
  coursePlans: Record<string, Record<string, Course>>;
  currentPlan: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["select-plan"]);

interface Course {
  name: string;
  professor: string;
  time: string;
  dates: string;
  location: string;
  description: string;
  credits: string;
  requirements: string;
  registered?: boolean;
  inPlan? : boolean;
}

const dayToDate: Record<string, string> = {
  "M": '2025-05-05',
  "T": '2025-05-06',
  "W": '2025-05-07',
  "R": '2025-05-08',
  "F": '2025-05-09',
}

const parseTimeRange = (timeRange: string) => {
  const convert = (time: string) => {
    time = time.replace(/(AM|PM)/, ' $1')
    let [hourStr, minutePart] = time.trim().split(":");
    console.log(hourStr)
    console.log(minutePart)
    let minute = minutePart.slice(0, 2);
    const isPM = time.includes("PM");
    let hour = Number(hourStr);

    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, "0")}:${minute}`;
  };

  const [startRaw, endRaw] = timeRange.split("-");
  const start = convert(startRaw);
  const end = convert(endRaw);

  return { start, end };
};

const formatDate = (start: Date, end: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  const startStr = start.toLocaleTimeString([], options);
  const endStr = end.toLocaleTimeString([], options);

  return `${startStr} - ${endStr}`;
};

const courseEvents = computed(() => {
  const plan = props.coursePlans[props.currentPlan];
  const events = [];

  for (const courseNumber in plan) {
    const course = plan[courseNumber];
    const { start, end } =  parseTimeRange(course.time);

    for (let i = 0; i < course.dates.length; i++) {
      const date = dayToDate[course.dates[i]];

      if (date) {
        events.push({
          title: `${course.name}`,
          start: new Date(`${date}T${start}`),
          end: new Date(`${date}T${end}`),
          content: `${course.location}`,
          class: "event",
          background: true
        })
      }
      console.log("Start:", start, "End:", end, "Full:", `${date}T${start}`);
    }
  }

  return events;
})

const moreInfo = ref<boolean>(false)
const selectedCourse = ref<Course | null>(null)
const selectedNumber = ref<string>("")

const translateDates = (time: string | undefined, dates: string | undefined) => {
  if (dates[1] === "R") {
    dates = "TTh"
  }
  return dates + " " + time;
}

const findCourse = (name: string) => {
  for (const [number, course] of Object.entries(props.coursePlans[props.currentPlan])) {
    if (course.name === name) {
      openMoreInfo(number, course);
    }
  }
}

const openMoreInfo = (number: string, course: Course) => {
  selectedNumber.value = number;
  selectedCourse.value = course;
  moreInfo.value = true;
}

const closeMoreInfo = () => {
  moreInfo.value = false;
  selectedCourse.value = null;
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Roboto:wght@100..900&display=swap');

.vuecal {
  --vuecal-height: 600px;
  --vuecal-secondary-color:#002349;
  --vuecal-event-color: #ffffff;
  --vuecal-base-color: #fbbf24;
  --vuecal-primary-color: #12a356;
  --vuecal-border-radius: 0px;
  --vuecal-transition-duration: 1s;
  cursor: default;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
}

.vuecal__time-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.custom-event {
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: 0.3s ease-in-out;
}

.custom-event:hover {
  cursor: pointer;
  background-color: #13753A;
}

.event-time {
  margin-top: 4px;
  margin-bottom: 2px; 
}

.custom-cell {
  background-color: #ffffff;
}
</style>

<style scoped>
.plans-block {
  color: white;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  font-family: 'Roboto', sans-serif;
}

.plans {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.button-row {
  display: flex;
  gap: 40px;
  flex: 1;
  justify-content: space-evenly;
}

.active-plan {
  border: 2px solid #f4a300;
  font-weight: 700;
}

.active-plan:hover {
  border: 2px solid #f4a300;
  background-color: #00843d;
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
</style>
