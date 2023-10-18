<template>
    <div class="subcontent">
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
  
      <div class="add-schedule-section add-sched">
        <q-btn
          label="Add Schedule (+)"
          @click="addSchedule"
          class="q-mt-md q-mb-md drawerActive text-white"
        />
        <q-dialog v-model="formSchedule" persistent transition-show="flip-down" @hide="onHide">
      <q-card style="width: 650px; max-width: 80vw">
        <q-toolbar>
         
          <q-toolbar-title
            ><span class="text-weight-bold"
              >Add Schedule</span
            ></q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sd">
            <div class="q-gutter-md q-col-gutter-md">
              <div class="row q-col-gutter-md">
                <div
                  class="q-col col-12 col-sm-12 col-md-12"
                 
                >
                <q-select
                  class="custom-select"
                  v-model="formInput.doctors_id"
                  :options="doctorsOptions"
                  option-value="doctors_id"
                  option-label="dentist"
                  label="Select Doctor"
                  :rules="[rules.requiredField]"
                  dense
                />
          
             
                
                </div>
                <q-label><b>Select Service:</b></q-label>
                <div
                  class="q-col col-12 col-sm-12 col-md-12"
                 
                >
                <q-option-group
                :options="services"
                option-value="value"
                option-label="label"
                type="checkbox"
                v-model="formInput.services"
                :rules="[rules.requiredSelection]"
                dense
              />


                </div>
                <label for=""><b>Select Date:</b></label>

                <div
                  class="q-col col-12 col-sm-6 col-md-4">
                  <input
                      class="custom-input"
                      type="date"
                      option-value="date"
                      v-model="formInput.date"
                      :placeholder="ph"
                      :rules="[rules.requiredField]"
                      dense
                    />
                </div>
                

                <label for=""><b>Select Time:</b></label>
                <div
                  class="q-col col-12 col-sm-6 col-md-4"
                 
                >
                <input
                    class="custom-input"
                    type="time"
                    v-model="formInput.time_start"
                    :placeholder="ph"
                    :rules="[rules.requiredField]"
                    dense
                  />
                </div>
                <!-- <label for=""><b>Select Time Duration:</b></label> -->
                <div
                  class="q-col col-12 col-sm-4 col-md-12"
                  
                >
                <q-select
                  class="custom-select"
                  v-model="formInput.duration"
                  :options="selectedDuration"
                  map-options
                  option-value="duration"
                  option-label="value"
                  label="Select Duration"
                  :rules="[rules.requiredField]"
                  dense
                  style="display: flex !important;"
                />
           

              
              </div>
              </div>
            </div>
            <div style="margin: 10px;">
              <q-btn
              :loading="submitting"
                color="positive"
                class="add-btn"
                type="submit"
                label="Add"
                style="float: right;"
              />
            </div>
            
          </q-form>
          
        </q-card-section>
      
      </q-card>
    </q-dialog>
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
              <div><strong>Services:</strong> {{ scheduleDialogData.services }}</div>
              <div><strong>Date:</strong> {{ scheduleDialogData.date }}</div>
              <div><strong>Time:</strong> {{ scheduleDialogData.time }}</div>
              <div><strong>Duration:</strong> {{ scheduleDialogData.duration }} minutes</div>
              <div><strong>Status:</strong> {{ scheduleDialogData.booked === 0 ? 'Available' : 'Already booked' }}</div>

            </div>
          </q-card-section>
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




// Your formInput and related variables
const formSchedule = ref(false);
const viewSchedule = ref(false);
const submitting = ref(false);
const dateValue = ref('');
const addTransaction = ref(true);
const time_start = ref('');
const formInput = ref({
  services: []
});
const ph = ref('');
const loading = ref(false);
const doctors_id = ref(null);
const duration = ref(null);
const scheduleDialogData = ref(null);
const selectedDate = ref(today());


const selectedDuration = [
  { duration: 30, value: '30 mins' },
  { duration: 60, value: '1 hour' },
  { duration: 90, value: '1 hour and 30 mins' },
];

const selectedDurationValue = computed(() => {
  const selectedOption = selectedDuration.find((option) => option.duration === formInput.value.duration);
  return selectedOption ? selectedOption.duration : null;
});

const services = ref([
  { label: 'Dental Restoration', value: 'dental_restoration' },
  { label: 'Tooth Extraction', value: 'tooth_extract', color: 'green' },
  { label: 'Odontectomy', value: 'odontectomy', color: 'green' },
  { label: 'Dentures', value: 'dentures', color: 'green' },
  { label: 'Root Canal', value: 'root_canal', color: 'green' },
  { label: 'Braces', value: 'braces', color: 'green' }, // Fixed the typo here (Bracess to Braces)
  { label: 'Jacket Crown', value: 'jacket_crown', color: 'green' },
  { label: 'Oral Prophylaxis', value: 'oral_prophylaxis', color: 'green' },
  { label: 'Consultation', value: 'consultation', color: 'green' }
]);

const rules = {
  requiredField: (v) => !!v || "Required field.",
  requiredSelection: (v) => (!!v && v.length > 0) || "Required at least one selection",
};


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

const openDialog = () => {
  formProfile.value = true;
  console.log('test');
};

const closeDialog = () => {
  formProfile.value = false;
};

const addSchedule = () => {
    formSchedule.value = true;
    addTransaction.value = true;
}

const onHide = () => {
  // Implement the onHide method
}

const onReset = () => {
  // Implement the onReset method
}

const getDoctors = () => {
  api
    .viewDoctor()
    .then((response) => {
      // console.log(response);
      doctorsOptions.value = response.dentist.map((doctor) => ({
        doctors_id: doctor.id, // Assuming "id" is the actual field name in the response
        dentist: doctor.dentist, // Assuming "name" is the actual field name in the response
        
      }));
      console.log(doctorsOptions);

      

      loading.value = false;
    })
    .catch((error) => {
      // console.log(error);
      loading.value = false;
      $q.notify({
        color: "negative",
        position: "top",
        message: "Failed to load Doctors",
        icon: "report_problem",
      });
      loading.value = false;
    });
};

// const getSchedule = () => {
//   api
//     .viewAllSched()
//     .then((response) => {
//       console.log(response);
//       viewSched.value = response.schedules;

//       loading.value = false;
//     })
//     .catch((error) => {
//       // console.log(error);
//       loading.value = false;
//       $q.notify({
//         color: "negative",
//         position: "top",
//         message: "Failed to load Schedules",
//         icon: "report_problem",
//       });
//       loading.value = false;
//     });
// };

const onSubmit = (val) => {
  // add

  // Ensure services is an array
  if (!Array.isArray(formInput.services)) {
    formInput.services = [formInput.services];
  }

  formInput.duration = Number(formInput.duration);
  if (addTransaction.value) {
    console.log(formInput);
    submitting.value = true;
    api
    .addSchedule(formInput.value)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Add Schedule",
            icon: "report_problem",
          });
          submitting.value = false;
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "New Schedule has been saved!",
          });
          fetchSchedules();
          onReset();
          submitting.value = false;
          formSchedule.value = false;
        }
      })
      .catch((error) => {
        $q.notify({
          color: "negative",
          position: "top",
          message: error.message ?? "Failed to add Schedule",
          icon: "report_problem",
        });
        submitting.value = false;
      });
  } 
};

getDoctors();
fetchSchedules();
// getSchedule();
</script>
  
  
  <style scoped>
  
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
  
  .subcontent .q-pa-md {
    height: auto !important;
  }
  </style>