<template>
    <div class="login-container justify-center column items-center">
        <q-card class="q-ma-xl form-card">
            <div class="row custom-container">
                <!-- <div class="col bg-primary rounded-left-borders md-hide xs-hide sm-hide">
                    <div class="row full-width full-height flex flex-center">
                    </div>
                </div> -->
                <div class="col">
                    <div class="row q-pa-sm justify-center" style="min-height: 60vh;  ">
                        <div class="col-8 login-image">
                            <q-card-section class="full-height flex column justify-center q-p-lg">
                                <div class="flex column items-center justify-center q-mb-lg">
                                    <div class="text-h4 text-uppercase q-my-none text-weight-bold text-primary q-mb-sm text-center">
                                        Dental Clinic Online Appointment System Registration form</div>
                                    <p class="mt-4">Please fillup the form</p>
                                </div>
                                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sd">
                                    <div class="q-gutter-md q-col-gutter-md">
                                        <div class="row q-col-gutter-md">
                                        <div class="q-col col-12 col-sm-12 col-md-6">
                                            <q-input
                                            class="custom-input"
                                            outlined
                                            dense
                                            stack-label
                                            v-model="formInput.first_name"
                                            label="First Name"
                                            lazy-rules
                                            :rules="[rules.requiredField]"
                                            />
                                        </div>
                        
                                        <div class="q-col col-12 col-sm-6 col-md-6">
                                            <q-input
                                            class="custom-input"
                                            outlined
                                            dense
                                            v-model="formInput.middle_name"
                                            label="Middle Name"
                                            />
                                        </div>
                        
                                        <div class="q-col col-12 col-sm-6 col-md-6">
                                            <q-input
                                            class="custom-input"
                                            outlined
                                            dense
                                            v-model="formInput.last_name"
                                            label="Last Name"
                                            lazy-rules
                                            :rules="[rules.requiredField]"
                                            />
                                        </div>
                                        <div class="q-col col-12 col-sm-6 col-md-6">
                                            <q-select
                                            class="custom-input-select col-5"
                                            outlined
                                            v-model="formInput.extension_name"
                                            :options="selectExtenstion"
                                            map-options
                                            option-value="extension_name"
                                            option-label="value"
                                            label="Extension Name"
                                            dense
                                            />
                                        </div>
                                        <div class="q-col col-12 col-sm-6 col-md-12">
                                            <q-input
                                            class="custom-input"
                                            outlined
                                            dense
                                            stack-label
                                            v-model="formInput.home_address"
                                            label="Address"
                                            lazy-rules
                                            :rules="[rules.requiredField]"
                                            />
                                        </div>
                                        <div class="q-col col-12 col-sm-6 col-md-6">
                                            <q-input
                                            class="custom-input"
                                            outlined
                                            dense
                                            stack-label
                                            v-model="formInput.email"
                                            label="Email"
                                            lazy-rules
                                            :rules="[rules.requiredField, rules.properEmail]"
                                            />
                                        </div>
                                        <div class="q-col col-12 col-sm-6 col-md-6">
                                    

                                            <q-input
                                            class="custom-input"
                                            outlined
                                            stack-label
                                            dense
                                            label="Password"
                                            v-model="formInput.password"
                                            :type="isPwd ? 'password' : 'text'"
                                            :rules="[rules.requiredField]"
                                            v-if="addTransaction"
                                            >
                                            
                                            <template v-slot:append>
                                                <q-icon
                                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                                class="cursor-pointer"
                                                @click="isPwd = !isPwd"
                                                ></q-icon>
                                            </template>
                                            </q-input>
                                        </div>
                        
                                        <div class="q-col col-12 col-sm-6 col-md-4">
                                            <q-input
                                            class="custom-input"
                                            outlined
                                            dense
                                            stack-label
                                            v-model="formInput.mobile_number"
                                            label="Phone Number"
                                            lazy-rules
                                            :rules="[rules.requiredField, rules.mobileNumber]"
                                            />
                                        </div>
                                        <div class="q-col col-12 col-sm-6 col-md-4">
                                        

                                            <q-input
                                            class="custom-input"
                                            outlined
                                            dense
                                            type="date"
                                            option-value="date"
                                            stack-label
                                            v-model="formInput.birthday"
                                            label="Birthday"
                                            lazy-rules
                                            :rules="[rules.requiredField]"
                                            />

                                        </div>
                                        <div class="q-col col-12 col-sm-6 col-md-4">
                                            <q-input
                                            class="custom-input"
                                            outlined
                                            dense
                                            stack-label
                                            v-model="formInput.sex"
                                            label="Sex"
                                            lazy-rules
                                            :rules="[rules.requiredField]"
                                            />
                                        </div>
                                        
                                        {{ formInput }}
                                        
                                        
                                        </div>
                                    </div>
                        
                                    <div class="row justify-end">
                                        <div>
                                        <q-btn label="Clear" type="reset" flat class="q-ml-sm" />
                                        <q-btn
                                            :loading="submitting"
                                            label="Register"
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
                        </div>
                    </div>
                </div>
            </div>
        </q-card>
    </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { exportFile, useQuasar } from "quasar";
import { auth } from "../../stores/auth";
import api from "./API";
const formProfile = ref(false);
const addTransaction = ref(true);
const $q = useQuasar();
const formInput = ref({});
const submitting = ref(false);
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

const selectExtenstion = [
   'Jr', 'Sr', 'III', 'IV'
];


const onReset = () => {
  formInput.value = {}
  // loadData();
};

const onSubmit = (val) => {
  // add

  if (addTransaction.value) {
    console.log(formInput);
    submitting.value = true;
    api
    .addPatient(formInput.value)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Add Patient",
            icon: "report_problem",
          });
          submitting.value = false;
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "New Patient has been saved!",
          });
          onReset();
          submitting.value = false;
          formSchedule.value = false;
        }
      })
      .catch((error) => {
        $q.notify({
          color: "negative",
          position: "top",
          message: error.message ?? "Failed to add Patient",
          icon: "report_problem",
        });
        submitting.value = false;
      });
  } 
};


</script>
<style scoped>
    .login-container {
        height: 100vh;
        /* margin: 0 20px; */
    }
    .form-card {
        width: 45vw;
        margin: 0 auto;
    }

    @media screen and (max-width:768px) {
        .form-card {
            width: 100%;
        }

        .login-container {
            height: 100vh;
            padding: 0 20px;
        }
    }
</style>