<template>
  <q-layout view="lHh Lpr lff" :class="{ 'darkModeClass': darkMode }">
    <!-- Drawer Component -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      :class="{ 'bg-dark text-white': darkMode }"
    >
      <div class="logo-container">
        <!-- Your company logo goes here -->
        <img 
          alt="Quasar logo"
          src="~assets/dental.png"
          class="logo" 
          style="width: 130px;"
        />
      </div>
      <layout-drawer-list :routes="showRoutes" />
    </q-drawer>

    <q-page-container :class="layoutClasses">
      <q-header elevated style="z-index: 1;" :class="headerClasses">
        <q-toolbar  style="display: flex; justify-content: space-between;">
          <!-- Hamburger Icon (Menu Icon) -->
          <q-btn
            flat
            dense
            round
            @click="toggleLeftDrawer"
            icon="menu"
            aria-label="Menu"
            color="white"
          />
          <div class="head-prof">
            <div @click="toggleDarkMode">
              <i class="fas fa-toggle-off" v-if="!darkMode"></i>
              <i class="fas fa-toggle-on" v-else></i>
            </div>
            <!-- <h1>Hello</h1> -->
            <profile />
          </div>
        </q-toolbar>
      </q-header>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import routes from "../router/routes.js";
import LayoutDrawerList from "./LayoutDrawerList.vue";
import Profile from "../widget/AppProfile.vue";
import { auth } from "../stores/auth";

export default defineComponent({
  name: 'MainLayout',

  components: {
    LayoutDrawerList,
    Profile
  },

  setup () {
    const store = auth();
    const leftDrawerOpen = ref(false)
    const showRoutes = ref(routes[0].children)
    const darkMode = ref(false)
    store.darkMode = false;
    const toggleDarkMode = () => {
      store.darkMode = !darkMode.value
      darkMode.value = !darkMode.value
      document.body.classList.toggle('dark-mode', darkMode.value)
    }

    return {
      routes,
      showRoutes,
      leftDrawerOpen,
      darkMode,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      toggleDarkMode,
      layoutClasses () {
        return {
          'dark-mode': darkMode.value
        }
      },
      headerClasses () {
        return {
          'bg-dark': darkMode.value,
          'text-white': darkMode.value
        }
      }
    }
  }
})
</script>

<style>
.head-prof {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

.head-prof i {
  font-size: 30px;
  cursor: pointer;
}

.q-toolbar {
  background: #fff;
  color: #1d1d1d;
}

.q-toolbar i {
  color: #1d1d1d;
}

/* Dark Mode Styles */
.dark-mode .q-drawer-content, .dark-mode .q-page-container, .dark-mode .q-toolbar {
  background-color: #1d1d1d; 
  color: white; 
  transition: background-color 0.3s, color 0.3s;
}

.dark-mode .text-white, .dark-mode aside div, .dark-mode .q-toolbar i {
  color: #fff;
  transition: color 0.3s;
}

.dark-mode main .card, .dark-mode .chart-container {
  background-color: #1d1d1d !important;
  border: 1px solid #fff;
}

.dark-mode .q-table__container {
  border: 2px solid #F1DEC9;
}

.dark-mode .card-content {
  border-bottom: 1px solid #fff;
}

.dark-mode aside a {
  background-color: #1d1d1d;
}

</style>
