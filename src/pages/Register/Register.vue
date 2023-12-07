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
                                        <div class="logo-container">
                                            <!-- Your company logo goes here -->
                                            <img 
                                            alt="Quasar logo"
                                            src="~assets/logo-smile.jpg"
                                            class="logo" 
                                            style="width: 180px;"
                                            />
                                            <h4>Smile Dental Hub</h4>
                                        </div>
                                    </div>
                                    <a class="mt-4" href="#/Login">Login here</a>
                                </div>
                                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sd" enctype="multipart/form-data">
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
                                          <q-select
                                            class="custom-input-select col-5"
                                            outlined
                                            v-model="formInput.sex"
                                            :options="selectSex"
                                            map-options
                                            option-value="sex"
                                            option-label="value"
                                            label="Sex"
                                            dense
                                          />
                                        </div>
                                        
                                        <!-- <q-uploader
                                          label="Upload"
                                          v-model="formInput.image"
                                          @added="onFileChange"
                                        /> -->
                                        <q-label><b>Upload Valid ID</b></q-label>
                                        <div class="q-col col-12 col-sm-12 col-md-12">
                                          <input 
                                            class="custom-input"
                                            type="file" 
                                            outlined
                                            dense
                                            accept="image/*" 
                                            :rules="[rules.requiredField]"
                                            @change="onFileChange" />
                                        </div>

                                        
                                        </div>
                                    </div>
                                    <!-- {{ formInput }} -->

                        
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
import { ref} from "vue";
import { useQuasar } from "quasar";
import api from "./API";
const addTransaction = ref(true);
const $q = useQuasar();
const formInput = ref({image: null});
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


const selectSex = [
  'Male', 'Female'
]

// const onFileChange = (event) => {
//   // const file = event[0];
//   formInput.value.image = event;
//   console.log(event);
// };

const onFileChange = (event) => {
  const file = event.target.files[0];
  formInput.value.image = file;
  console.log(file);
};



const onReset = () => {
//   formInput.value = {}
  // loadData();
};

const onSubmit = (val) => {
  // add

  if (addTransaction.value) {
    console.log(formInput);
    submitting.value = true;
    const formData = new FormData();
    formData.append('email', formInput.value.email);
    formData.append('password', formInput.value.password);
    formData.append('first_name', formInput.value.first_name);
    formData.append('last_name', formInput.value.last_name);
    // formData.append('middle_name', formInput.value.middle_name || '');
    // formData.append('extension_name', formInput.value.extension_name || '');
    formData.append('birthday', formInput.value.birthday || '');
    formData.append('sex', formInput.value.sex);
    formData.append('home_address', formInput.value.home_address);
    formData.append('mobile_number', formInput.value.mobile_number || '');
    
    // Append the image file
    if (formInput.value.image) {
      formData.append('image', formInput.value.image);
    }

        api
    .addPatient(formData)
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
        //   formSchedule.value = false;
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
      
      // };

      // reader.readAsBinaryString(formInput.value.image);

    
  } 
};


</script>
<style scoped>
    .login-container {
        height: 100vh;
        /* margin: 0 20px; */
    }
    .form-card {
        width: 80vw;
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