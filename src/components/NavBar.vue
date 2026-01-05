<template>
  <div class="navbar fixed z-20 w-full bg-[#0c2340] backdrop-blur-md">
    <div class="navbar-content flex flex-row mx-4">
      <div class="site-title flex items-center h-full" @click.prevent="router.push('/')">POVO</div>
      <div class="flex flex-row items-center">
        <router-link to="/" class="link text-base">Home</router-link>
        <router-link to="/plans" class="link text-base">Plans</router-link>
        <router-link to="/registration" class="link text-base">Registration</router-link>
        <router-link to="/schedule" class="link text-base">Schedule</router-link>
        <router-link to="/search" class="link text-base">Search</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const isNavBarHidden = ref(false);

const router = useRouter();

onMounted(() => {
  window.addEventListener('scroll', handleNavBarVisibility)
  window.addEventListener('mousemove', handleNavBarVisibility)
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleNavBarVisibility)
  window.removeEventListener('mousemove', handleNavBarVisibility)
})

let visibleTimeout: ReturnType<typeof setTimeout> | null = null;

const handleNavBarVisibility = (event?: Event): void => {
  const scrollY = window.scrollY;
  const mouseY = event instanceof MouseEvent ? event.clientY : null;

  if (scrollY > 300 && (mouseY == null || mouseY > 75)) {
    if (visibleTimeout) clearTimeout(visibleTimeout); 
    visibleTimeout = setTimeout(() => {
      isNavBarHidden.value = true;
    }, 300); 
  } 
  else if (scrollY <= 300 || (mouseY !== null && mouseY <= 75)) {
    if (visibleTimeout) clearTimeout(visibleTimeout);
    visibleTimeout = setTimeout(() => {
      isNavBarHidden.value = false;
    }, 100); 
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');

.navbar {
  font-family: 'AGaramondPro', sans-serif;
  transition: transform .5s ease;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  height: 40px;
}

.site-title {
  font-size: 24px;
  font-weight: 700;
  color: #eaf2ef;
  cursor: pointer;
  transition: transform 0.2s ease-in;
}

/* .site-title:hover {
  color: #b0cfc2; 
  text-shadow: 0px 0px 3px #90b7a7;
  transform: scale(1.0375)
} */

.link,
.links-dropdown {
  text-decoration: none;
  color: #f0f7f2;
  cursor: pointer;
  padding-left: 16px;
  padding-right: 16px;
  height: 100%;
  justify-self: first baseline;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-family: 'AGaramondPro', sans-serif;
  font-weight: 700;
}

.link:last-child {
  padding-right: 0px;
}

/* .link:hover {
  color: #b0cfc2;
  text-shadow: 0px 0px 4px #6a998f;
  transform: scale(1.0375);
  transition: transform 0.5s ease;
} */
</style>
