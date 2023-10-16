<template>
    <div class="subcontent">
      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
  
      <div class="year-header">
        2023
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
        >
          <template #day="{ scope: { timestamp } }">
            <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
              <div
                :class="badgeClasses(event, 'day')"
                :style="badgeStyles(event, 'day')"
                class="my-event"
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
  
      <div class="add-schedule-section">
        <q-btn
          label="Add Schedule (+)"
          @click="addSchedule"
          class="add-schedule-button"
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

                {{ formInput }}

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
  
      <!-- <div class="schedules-list">
        <div v-for="schedule in schedules" :key="schedule.id" class="schedule-item">
          <div><strong>Doctor:</strong> {{ schedule.dentist_name }}</div>
          <div><strong>Specialization:</strong> {{ schedule.specialization }}</div>
          <div><strong>Date:</strong> {{ schedule.date }}</div>
          <div><strong>Time:</strong> {{ schedule.time_start }}</div>
          <div><strong>Duration:</strong> {{ schedule.duration }} minutes</div>
          <div><strong>Status:</strong> {{ schedule.booked === 1 ? 'Booked' : 'Available' }}</div>
        </div>
      </div> -->
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
const eventsMap = reactive({});

const selectedDate = ref(today());

// Function to fetch schedules
const fetchSchedules = () => {
  api.viewAllSched()
    .then((response) => {
      schedules.value = response.schedules;
      
      // Populate eventsMap using response data
      response.schedules.forEach((schedule) => {
        const formattedDate = schedule.date.split(' ')[0];
        if (!eventsMap[formattedDate]) {
          eventsMap[formattedDate] = [];
        }
        eventsMap[formattedDate].push({
          id: schedule.id,
          doctor: schedule.dentist_name,
          details: schedule.specialization,
          date: formattedDate,
          time: schedule.time_start,
          duration: parseFloat(schedule.duration),
          bgcolor: schedule.booked === 1 ? 'red' : 'green',
          icon: 'fas fa-handshake',
        });
      });
      console.log('Schedules successfully fetched:', schedules.value);
    })
    .catch((error) => {
      console.error(error);
    });
};


onMounted(() => {
  fetchSchedules(); // Call the fetchSchedules function to fetch schedule data
});

// Your formInput and related variables
const formSchedule = ref(false);
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
  selectedDate.value = addToDate(selectedDate.value, { months: -1 });
};

const onNext = () => {
  selectedDate.value = addToDate(selectedDate.value, { months: 1 });
};

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

const getSchedule = () => {
  api
    .viewAllSched()
    .then((response) => {
      console.log(response);
      viewSched.value = response.schedules;

      loading.value = false;
    })
    .catch((error) => {
      // console.log(error);
      loading.value = false;
      $q.notify({
        color: "negative",
        position: "top",
        message: "Failed to load Schedules",
        icon: "report_problem",
      });
      loading.value = false;
    });
};

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
          submitting.value = false;
          formSchedule.value = false;
          onReset();
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
getSchedule();
</script>
  
  
  <style scoped>
  
  .add-sched {
      display: flex;
      justify-content: center;
      padding-top: 50px;
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