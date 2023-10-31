<template>
    <div class="subcontent q-pa-md bg-image">
      <div class="calendar-content">
        <h2><span class="mint-green">Schedule</span> <br>Your Visit</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam aliquam sequi mollitia commodi ipsum. Natus pariatur quasi quod dolores incidunt nostrum, in tenetur adipisci earum accusamus possimus, corrupti fugit quis?</p>
        <q-btn
          label="Login"
          href="#/Login"
          class="q-mt-md q-mb-md drawerActive text-white"
        />
      </div>
      
      <div class="calendar-parent">
        <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
        <div class="year-header text-center">
            <h4>{{ ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][new Date(selectedDate).getMonth()] }} {{ new Date(selectedDate).getFullYear() }}</h4>
        </div>
    
        <div class="calendar-container">
            <q-calendar-month
            ref="calendar"
            v-model="selectedDate"
            animated
            bordered
            focusable
            hoverable
            no-active-date
            :disabled-weekdays="[0,6]"
            :day-min-height="60"
            :day-height="0"
            @change="onChange"
            @moved="onMoved"
            @click-date="onClickDate"
            @click-day="onClickDay"
            @click-workweek="onClickWorkweek"
            @click-head-workweek="onClickHeadWorkweek"
            @click-head-day="onClickHeadDay"
            :loading="loading"
            >
            <template #day="{ scope: { timestamp } }">
                <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
                <div
                    :class="badgeClasses(event, 'day')"
                    :style="badgeStyles(event, 'day')"
                    class="my-event"
                    @click="openScheduleDialog(event)"
                >
                    <div class="event-title">
                    {{ event.doctor + (event.time ? ' - ' + event.time : '') }}
                    <q-tooltip>Duration: {{ event.duration }} minutes</q-tooltip>
                    </div>
                </div>
                </template>
            </template>
            </q-calendar-month>
        </div>
    </div>  
      <q-dialog v-model="viewSchedule" persistent transition-show="flip-down" @hide="onHide">
        <q-card style="width: 650px; max-width: 80vw">
          <q-toolbar>
            <q-toolbar-title><span class="text-weight-bold">Schedule Details</span></q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <q-card-section>
            <!-- Display schedule details in the dialog -->
            <div v-if="scheduleDialogData">
              <div><strong>Doctor:</strong> {{ scheduleDialogData.doctor }}</div>
              <div><strong>Specialization:</strong> {{ scheduleDialogData.details }}</div>
              <div><strong>Services: </strong>
                <span v-for="(service, index) in scheduleDialogData.services" :key="index">
                   {{ getServiceDisplayName(service) }}
                  <!-- Add a comma and space after each service except the last one -->
                  <span v-if="index < scheduleDialogData.services.length - 1">, </span>
                </span>
              </div>
              <div><strong>Date:</strong> {{ scheduleDialogData.date }}</div>
              <div><strong>Time:</strong> {{ scheduleDialogData.time }}</div>
              <div><strong>Duration:</strong> {{ scheduleDialogData.duration }} minutes</div>
              <div><strong>Status:</strong> {{ scheduleDialogData.booked === 0 ? 'Available' : 'Already booked' }}</div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="bookSched">
      <q-card>
        <q-card-section>
          <p>Do you already have an account?</p>
        </q-card-section>
        <q-card-actions  class="row justify-center">
          <q-btn label="Yes, Login" color="positive" href="#/Login" />
          <q-btn label="No, Register" color="accent" href="#/Register" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
    
  </template>
  
  <script setup>
  import {
  QCalendarMonth,
  addToDate,
  parseDate,
  today
  } from '@quasar/quasar-ui-qcalendar/src/index.js';
  import api from "../pages/commonAPI/";
  import { ref, computed, onMounted, reactive } from 'vue';
  import { exportFile, useQuasar, copyToClipboard } from "quasar";
  import NavigationBar from '../components/NavigationBar.vue';
  const $q = useQuasar();
  
  const formProfile = ref(false);
  const schedules = ref([]);
  const eventsMap = ref([]);
  const bookSched = ref(false);
  
  const convertTo12HourFormat = (time24) => {
  const [hour, minute] = time24.split(':');
  const hours = parseInt(hour, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHour}:${minute} ${ampm}`;
  };
  
  // Function to fetch schedules
  const fetchSchedules = () => {
  api.viewAllSched()
    .then((response) => {
      schedules.value = response.schedules;
      eventsMap.value = [];
      // Populate eventsMap using response data
      response.schedules.forEach((schedule) => {
        console.log(schedule.date);
        if (!eventsMap.value[schedule.date]) {
          eventsMap.value[schedule.date] = [];
        }
        eventsMap.value[schedule.date].push({
          id: schedule.id,
          doctor: schedule.dentist_name,
          details: schedule.specialization,
          services: schedule.services,
          date: schedule.date,
          time: convertTo12HourFormat(schedule.time_start),
          duration: parseFloat(schedule.duration),
          bgcolor: schedule.booked === 1 ? 'red' : 'green',
          icon: 'fas fa-handshake',
          booked: schedule.booked, // Add booked property
        });
        // console.log(eventsMap[schedule.date]);
      });
      console.log('Schedules successfully fetched:', schedules.value);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const getServiceDisplayName = (service) => {
  const serviceNames = {
    dental_restoration: 'Dental Restoration',
    tooth_extract: 'Tooth Extraction',
    dentures: 'Dentures',
    odontectomy: 'Odontectomy',
    root_canal: 'Root Canal',
    braces: 'Braces',
    jacket_crown: 'Jacket Crown',
    oral_prophylaxis: 'Oral Prophylaxis',
    consultation: 'Consultation',
  };
  return serviceNames[service] || service;
};
  

const bookNow = () => {
    bookSched.value = true;
}
  
  
  
  // Your formInput and related variables
  const viewSchedule = ref(false);
  const submitting = ref(false);
  const dateValue = ref('');
  const addTransaction = ref(true);

  const scheduleDialogData = ref(null);
  const selectedDate = ref(today());
  
  
  
  
  const openScheduleDialog = (schedule) => {
  scheduleDialogData.value = schedule;
  viewSchedule.value = true;
  };
  
  const closeScheduleDialog = () => {
  scheduleDialogData.value = null;
  viewSchedule.value = false;
  };
  
  let doctorsOptions = ref([]);
  
  // Event handling methods
  const badgeClasses = (event, type) => {
  return {
    [`text-white bg-${event.bgcolor}`]: true,
    'rounded-border': true
  };
  };
  
  const badgeStyles = (day, event) => {
  const s = {};
  return s;
  };
  
  const onToday = () => {
  selectedDate.value = today();
  };
  
  const onPrev = () => {
  prevMonth();
  };
  
  const onNext = () => {
  
  nextMonth();
  
  };
  
  const nextMonth = () => {
  const year = new Date(selectedDate.value).getFullYear().toString(); // Get the last 2 digits of the year
  const month = ((new Date(selectedDate.value).getMonth() + 1) + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = new Date(selectedDate.value).getDate().toString().padStart(2, '0');
  console.log(month);
  if(month === '13') {
    // const day = new Date(selectedDate.value).getDate().toString().padStart(2, '0');
    const year = (new Date(selectedDate.value).getFullYear() + 1).toString();
    console.log('tetete');
    selectedDate.value = `${year}-01-${day}`;
    return;
  }
  selectedDate.value = `${year}-${month}-${day}`;
  
  
  }
  
  const prevMonth = () => {
  const year = new Date(selectedDate.value).getFullYear().toString(); // Get the last 2 digits of the year
  const month = ((new Date(selectedDate.value).getMonth() + 1) - 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = new Date(selectedDate.value).getDate().toString().padStart(2, '0');
  console.log(month);
  if(month === '00') {
    // const day = new Date(selectedDate.value).getDate().toString().padStart(2, '0');
    const year = (new Date(selectedDate.value).getFullYear() - 1).toString();
    console.log('tetete');
    selectedDate.value = `${year}-12-${day}`;
    return;
  }
  selectedDate.value = `${year}-${month}-${day}`;
  
  
  }
  
  
  const onMoved = (data) => {
  console.log('onMoved', data);
  };
  
  const onChange = (data) => {
  console.log('onChange', data);
  };
  
  const onClickDate = (data) => {
  console.log('onClickDate', data);
  };
  
  const onClickDay = (data) => {
  console.log('onClickDay', data);
  };
  
  const onClickWorkweek = (data) => {
  console.log('onClickWorkweek', data);
  };
  
  const onClickHeadDay = (data) => {
  console.log('onClickHeadDay', data);
  };
  
  const onClickHeadWorkweek = (data) => {
  console.log('onClickHeadWorkweek', data);
  };
  

  
  const onHide = () => {
  // Implement the onHide method
  }
  
  const onReset = () => {
  // Implement the onReset method
  }
  
  
  
  fetchSchedules();
  </script>
  
  
  <style scoped>
      .bg-image{
          background: linear-gradient(to left, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.5)), url("src/assets/dentalbg.jpg");
          background-repeat: no-repeat;
          background-size: cover;
          background-position: right center;
      }

      .calendar-parent {
        display: grid;
        align-items: center;
      }
      .q-pa-md {
          height: 100vh !important;
      }

      .subcontent {
        display: grid;
        grid-template-columns: 40% 60%;
        width: 100%;
        align-items: center;
        gap: 20px;
        justify-content: center;
      }

      .calendar-content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 30px;
      }

      .calendar-content h2 {
        font-weight: 700;
        margin: 0;
      }

      .calendar-content a {
        padding: 8px;
        width: 220px;
      }

      .book-now a {
        padding: 10px 30px;
      }
  
  
      .add-sched {
        display: flex;
        justify-content: center;
        padding-top: 50px;
    }
  
    .year-header h4 {
      margin: 10px 0 !important;
    }
    
    .q-option-group.q-gutter-x-sm {
        display: flex;
        flex-wrap: wrap;
    }
    .my-event {
      position: relative;
      font-size: 12px;
      width: 100%;
      margin: 1px 0 0 0;
      justify-content: center;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
    }
    
    
    
    .title {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
     
    
    .text-white {
      color: white;
    
    }
    
    .bg-blue {
      background: blue;
    
    }
    
    .bg-green {
      background: green;
    
    }
    
    .bg-orange {
      background: orange;
    
    }
    
      .bg-red {
          background: red;
    
      }
    
    .bg-teal {
      background: teal;
    
    }
    
    .bg-grey {
    
      background: grey;
    }
    
    .bg-purple {
      background: purple;
    
    }
    
    .rounded-border {
      border-radius: 2px;
    
    }

  
  </style>