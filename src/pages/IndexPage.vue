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
  
      <div class="add-schedule-section add-sched">
        <q-btn
          label="Add Schedule (+)"
          @click="addSchedule"
          class="q-mt-md q-mb-md drawerActive text-white"
          v-if="hasPermission('ADMIN')"
        />
        <q-btn
          label="Scan QR"
          @click="qrMode=true"
          class="q-mt-md q-mb-md drawerActive text-white"
          v-if="hasPermission('ADMIN')"
        />
        <q-dialog v-model="formSchedule" persistent transition-show="scale" @hide="onHide">
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
               
                <div class="q-col col-12 col-sm-6 col-md-12">
                  <q-select
                    class="custom-input-select col-5"
                    outlined
                    v-model="formInput.doctors_id"
                    :options="doctorsOptions"
                    option-value="doctors_id"
                    option-label="dentist"
                    label="Select Doctor"
                    dense
                    :rules="[rules.requiredField]"
                  />
                </div>
                <!-- <q-label><b>Select Service:</b></q-label>
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


                </div> -->
              
                
                <div class="q-col col-12 col-sm-6 col-md-6">
                   

                   <q-input
                     class="custom-input"
                     outlined
                     dense
                     type="date"
                    option-value="date"
                    v-model="formInput.date"
                    :placeholder="ph"
                     label="Select Date"
                     lazy-rules
                     :rules="[rules.requiredField]"
                   />

                 </div>

                 <div class="q-col col-12 col-sm-6 col-md-6">
                   

                   <q-input
                     class="custom-input"
                     outlined
                     dense
                     type="time"
                     v-model="formInput.time_start"
                    :placeholder="ph"
                     label="Select Time"
                     lazy-rules
                     :rules="[rules.requiredField]"
                   />

                 </div>

                
              <!-- <div class="q-col col-12 col-sm-6 col-md-12">
                  <q-select
                    class="custom-input-select col-5"
                    outlined
                    v-model="formInput.duration"
                    :options="selectedDuration"
                    map-options
                    option-value="duration"
                    option-label="value"
                    label="Select Duration"
                    dense
                  />
                </div> -->
              </div>
            </div>
       

            <div class="row justify-end">
                <div>
                  <q-btn
                    :loading="submitting"
                    label="Add"
                    type="submit"
                    class="drawerActive"
                  >
                    <template v-slot:loading>
                      <q-spinner-facebook />
                    </template>
                  </q-btn>
                </div>
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
              <div v-if="scheduleDialogData.name"><strong>Booked By:</strong> {{ scheduleDialogData.name }}</div>
              <div><strong>Doctor:</strong> {{ scheduleDialogData.doctor }}</div>
              <div v-if="hasPermission('PATIENT')">
                <div v-if="scheduleDialogData.booked == false">
                    <div><strong>Select Services: </strong> </div>
                    <!-- <q-checkbox
                    outlined
                    :options="servicesData"
                    v-model="formInput.service_type"
                    option-value="value"
                    option-label="label"
                    dense
                      /> -->

                    <q-select
                      :readonly="scheduleDialogData.booked == true"
                      class="custom-input-select col-5"
                      outlined
                      v-model="formInput.services"
                      :options="servicesData"
                      option-value="id"
                      option-label="service_type"
                      map-options
                      emit-value
                      dense
                      multiple
                      clearable
                      :rules="[rules.requiredField]"
                    />
                </div>
                <div v-else>
                  <strong>Services:</strong>
                  <ul>
                    <li v-for="selectedService in formInput.services" :key="selectedService">
                      {{ selectedService }}
                    </li>
                  </ul>
                  <div><strong>Total Price:</strong> ₱{{ scheduleDialogData.price }}</div>
                  <div><strong>Duration:</strong> {{ scheduleDialogData.duration }} minutes</div>
                </div>
              </div>
             
              <div><strong>Date:</strong> {{ scheduleDialogData.date }}</div>
              <div><strong>Time:</strong> {{ scheduleDialogData.time }}</div>
              <!-- <div><strong>Duration:</strong> {{ scheduleDialogData.duration }} minutes</div> -->
              <div><strong>Status:</strong> {{ scheduleDialogData.booked === 0 ? 'Available' : 'Already booked' }}</div>
                <div class="row justify-start" v-if="scheduleDialogData.booked == false">
                  <q-btn
                    label="Book now"
                    class="q-mt-md q-mb-md drawerActive text-white"
                    @click="bookNow"
                    v-model="scheduleDialogData.id"
                    v-if="hasPermission('PATIENT')"

                  />
                </div>
                <QRCodeVue3
                    v-if="scheduleDialogData.booked == true && hasPermission('PATIENT')" 
                    :width="250"
                    :height="250"
                    :value="scheduleDialogData.id+'+'+scheduleDialogData.date"

                    :qrOptions="{
                      typeNumber: 0,
                      mode: 'Byte',
                      errorCorrectionLevel: 'H',
                    }"
                    :imageOptions="{
                      hideBackgroundDots: true,
                      imageSize: 0.4,
                      margin: 0,
                    }"
                    :dotsOptions="{
                      type: 'square',
                      color: 'black',
                      gradient: {
                        type: 'linear',
                        rotation: 0,
                        colorStops: [
                          { offset: 0, color: 'black' },
                          { offset: 1, color: 'black' },
                        ],
                      },
                    }"
                    :corners-square-options="{
                      type: 'square',
                      color: 'black',

                    }"
                    :corners-dot-options="{
                      type: 'square',
                      color: 'black',

                    }"
                    :backgroundOptions="{ color: '#ffffff' }"

                    fileExt="png"
                    :download="false"
                    myclass="my-qur"
                    imgclass="img-qr"
                    downloadButton="my-button"
                    :downloadOptions="{ name: 'vqr', extension: 'png' }"
                  />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog
      v-model="qrMode"
      persistent
      transition-show="fade"
      transition-hide="fade"
      class="qr-dialog"
    >
      <q-card style="width: 360px; height: 270px">
        <div class="qr-background">
          <div class="qr-square"></div>
        </div>
        <q-toolbar style="position: absolute; background: none; z-index: 1">
          <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar> -->

          <q-btn flat round dense icon="close" v-close-popup style="color: #fff"/>
          <span
            style="
              text-align: center;
              font-weight: bold;
              width: 100%;
              margin-left: -35px;
              font-size: 20px;
            "
            >{{ qrModeTitle }}</span
          >
        </q-toolbar>
        <div class="stream">
          <qr-stream
            @camera-on="onReady"
            key="qr-component"
            @decode="onDecode"
            class="mb"
          >
            <div style="color: red" class="frame"></div>
          </qr-stream>
        </div>
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
import QRCodeVue3 from "qrcode-vue3";
import { QrcodeStream, QrStream, QrCapture, QrDropzone } from "vue3-qr-reader";
import { ref, computed, onMounted, reactive } from 'vue';
import { exportFile, useQuasar, copyToClipboard } from "quasar";
import NavigationBar from '../components/NavigationBar.vue';
const $q = useQuasar();
import { auth } from "../stores/auth";
const store = auth();

const formProfile = ref(false);
const schedules = ref([]);
const eventsMap = ref([]);
const qrMode = ref(false);

const onDecode = (data) => {
  // console.log("wew");
  if (data) {
    console.log(data);

    // scanAccount(decodedQR.value);
    // qrMode.value = false;
    // qrAccountActive.value = true;
    let id = data.split('+')[0];
    
  api
    .getSchedule(id)
    .then((response) => {
      if (response == "401") {
        $q.notify({
          color: "negative",
          position: "top",
          message: "Unauthenticated",
          icon: "report_problem",
        });
        return;
      }
        // Map user_id and id properties
        if (scheduleDialogData.value) {
          scheduleDialogData.value.doctor = response.schedule.dentist_name,
          scheduleDialogData.value.date = response.schedule.date,
          scheduleDialogData.value.time = convertTo12HourFormat(response.schedule.time_start),
          scheduleDialogData.value.services = response.schedule.services,
          scheduleDialogData.value.price = response.schedule.price,
          scheduleDialogData.value.duration = parseFloat(response.schedule.duration),
          scheduleDialogData.value.bgcolor = response.schedule.booked === 1 ? "red" : "green",
          scheduleDialogData.value.icon = "fas fa-handshake",
          scheduleDialogData.value.booked = response.schedule.booked, // Add booked property
          scheduleDialogData.value.name = response.schedule.bookings[0].patient_name // Add booked property
        
        }
        

      console.log(response);
      viewSchedule.value = true;
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Loading failed",
        icon: "report_problem",
      });
      console.log(e);
    });

  }
};





const convertTo12HourFormat = (time24) => {
  const [hour, minute] = time24.split(':');
  const hours = parseInt(hour, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

// Your formInput and related variables
const formSchedule = ref(false);
const viewSchedule = ref(false);
const submitting = ref(false);
const dateValue = ref('');
const addTransaction = ref(true);
const time_start = ref('');
const formInput = ref({services: []});

const ph = ref('');
const loading = ref(false);
const doctors_id = ref(null);
const duration = ref(null);
const scheduleDialogData = ref({});
const selectedDate = ref(today());

const services = ref([]);


const servicesData = ref([]);



const loadData = async () => {
  loading.value = true;

  try {
    // Fetch services
    const servicesResponse = await api.viewAllServices();
    if (servicesResponse === "401") {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Unauthenticated",
        icon: "report_problem",
      });
    } else {
      console.log("Services response:", servicesResponse);
      services.value = servicesResponse;
      
      servicesData.value = servicesResponse.map((services) => ({
        id: services.id, // Assuming "id" is the actual field name in the response
        service_type: services.service_type+" - ₱"+services.price, // Assuming "name" is the actual field name in the response
        duration: services.duration,
        price: services.price,
        
      }));

      console.log("Services nii:", servicesData);

  

      // Fetch schedules
      const schedulesResponse = await api.viewAllSched();
      schedules.value = schedulesResponse.schedules;
      eventsMap.value = [];

      // Populate eventsMap using response data
      schedulesResponse.schedules.forEach((schedule) => {
        console.log("Hello", schedule.services);
        if (!eventsMap.value[schedule.date]) {
          eventsMap.value[schedule.date] = [];
        }
        eventsMap.value[schedule.date].push({
          id: schedule.id,
          doctor: schedule.dentist_name,
          date: schedule.date,
          time: convertTo12HourFormat(schedule.time_start),
          services: schedule.services,
          price: schedule.price,
          duration: parseFloat(schedule.duration),
          bgcolor: schedule.booked === 1 ? "red" : "green",
          icon: "fas fa-handshake",
          booked: schedule.booked, // Add booked property
        });
      });

      console.log("Services successfully fetched:", services.value);
      console.log("Schedules successfully fetched:", schedules.value);
    }
  } catch (error) {
    console.error(error);
    $q.notify({
      color: "negative",
      position: "top",
      message: "Loading data failed",
      icon: "report_problem",
    });
  } finally {
    loading.value = false;
  }
};



// const formBooking = ref({
//   service_type: Object.fromEntries(
//     services.value.map(service => [service.id, false])
//   )
// });

const rules = {
  requiredField: (v) => !!v || "Required field.",
  requiredSelection: (v) => (!!v && v.length > 0) || "Required at least one selection",
};


const openScheduleDialog = (schedule) => {
  scheduleDialogData.value = schedule;
  viewSchedule.value = true;
  formInput.value.services = schedule.services;
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
  formInput.service_type = [];
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
      console.log("Doctors nii:", doctorsOptions);

      

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

const hasPermission = (authority) => {
  if (store.roles.includes(authority)) {
    return true;
  }
  return false;
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
          // fetchSchedules();
          loadData();
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

const bookNow = (val) => {
  $q.dialog({
      title: "Book Now",
      message: "Are you sure you want to book a schedule?",
      cancel: true,
    }).onOk(() => {
      // submitting.value = true;
     
      api
        .updateSchedule(scheduleDialogData.value.id, formInput.value)
        .then((response) => {
          console.log(response);
          if (response.data?.error || response.data?.message) {
            $q.notify({
              color: "negative",
              position: "top",
              message:
                JSON.stringify(response.data?.error) ??
                JSON.stringify(response.data?.message) ??
                "Failed to Update Admin",
              icon: "report_problem",
            });
            // submitting.value = false;
          } else {
            // Error response
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Booked successfully!",
            });

            loadData();
            // submitting.value = false;
            // formProfile.value = false;
            onReset();
            viewSchedule.value = false;
          }
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: error.message ?? "Failed to Book a Schedule",
            icon: "report_problem",
          });
          // submitting.value = false;
        });
    });
}


// api.sendSMS();

loadData();



getDoctors();
// fetchSchedules();
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