<template>
  <div class="add-sched">
    <q-btn
      label="Add Schedule (+)"
      @click="AddSchedule"
      class="q-mt-md q-mb-md  drawerActive text-white"
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
                    type="checkbox"
                    v-model="formInput.services"
                    :rules="[rules.requiredField]"
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
</template>

<script setup>
import { ref, computed } from 'vue'
import api from "../pages/commonAPI/";
import { exportFile, useQuasar, copyToClipboard } from "quasar";
import { stringify } from 'postcss';
const $q = useQuasar();
const formSchedule = ref(false);
const submitting = ref(false);
const dateValue = ref('')
const addTransaction = ref(true);
const time_start = ref('')
const formInput = ref({
  services: []
});
const ph = ref('');
const loading = ref(false);;
const doctors_id = ref(null);
// const duration_model = ref(null);
const duration = ref(null);

const selectedDuration = [
  { duration: 30, value: '30 mins' },
  { duration: 60, value: '1 hour' },
  { duration: 90, value: '1 hour and 30 mins' },
];




const selectedDurationValue = computed(() => {
  const selectedOption = selectedDuration.find((option) => option.duration === formInput.duration);
  return selectedOption ? selectedOption.duration : null;
});

const group = ref([]);
const services = ref([
  { label: 'Dental Restoration', value: 'dental_restoration' },
  { label: 'Tooth Extraction', value: 'tooth_extract', color: 'green' },
  { label: 'Odontectomy', value: 'odontectomy', color: 'green' },
  { label: 'Dentures', value: 'dentures', color: 'green' },
  { label: 'Root Canal', value: 'root_canal', color: 'green' },
  { label: 'Bracess', value: 'bracess', color: 'green' },
  { label: 'Jacket Crown', value: 'jacket_crown', color: 'green' },
  { label: 'Consultation', value: 'consultation', color: 'green' },
  { label: 'Oral Prophylaxis', value: 'oral_prophylaxis', color: 'green' }
]);

const rules = ref({
  requiredField: (v) => !!v || "Required field.",
  requiredSelection: (v) =>
    (!!v && v.length > 0) || "Required at least one selection",
  matchPassword: (v) =>
    v === form.value.password || "Does not match new password.",
  properEmail: (v) =>
    !v ||
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    "E-mail must be valid. Ex. juandelacruz@gmail.com",
  mobileNumber: (v) =>
    !v ||
    /^(09)\d{9}$/.test(v) ||
    "Mobile number must be valid. Ex. starts with (09) followed by xxxxxxxxx, where x = numeric character only",
});

let doctorsOptions = ref([]);


const AddSchedule = ()=> {
  formSchedule.value = true;
  addTransaction.value = true;
  };

  const closeDialog = ()=> {
    formSchedule.value = false;
  };

function onToday () {
      this.$refs.calendar.moveToToday()
    };




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
      // console.log(response);
      viewSched.value = response.schedule;

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



console.log("formInput.services:", formInput.services);
const onSubmit = (val) => {
  // add

  formInput.services = JSON.stringify(formInput.services);
  formInput.duration = Number(formInput.duration);
  if (addTransaction.value) {
    console.log(formInput);
    submitting.value = true;
    api
    .addSchedule(
      formInput.value
      )
      .then((response) => {
        // console.log(formInput.doctors_id.doctors_id);
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
          // Error response
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
}

.q-option-group.q-gutter-x-sm {
    display: flex;
    flex-wrap: wrap;
}
</style>