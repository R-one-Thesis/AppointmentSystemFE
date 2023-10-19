<template>
    <div class="q-pa-md">
      <q-btn
        label="Add Patient (+)"
        @click="AddPatient"
        class="q-mt-md q-mb-md bg-button1 text-white drawerActive"
      />
  
      <q-dialog
        v-model="formProfile"
        persistent
        transition-show="flip-down"
        @hide="onHide"
      >
        <q-card style="width: 800px; max-width: 80vw">
          <q-toolbar>
            <!-- <q-avatar>
                <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
              </q-avatar> -->
            <q-toolbar-title
              ><span class="text-weight-bold"
                >Patient Details</span
              ></q-toolbar-title
            >
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
  
          <q-card-section>
            
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sd">
              <div class="q-gutter-md q-col-gutter-md">
                <div class="row q-col-gutter-md">
                  <div class="q-col col-12 col-sm-12 col-md-3">
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
  
                  <div class="q-col col-12 col-sm-6 col-md-3">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      v-model="formInput.middle_name"
                      label="Middle Name"
                    />
                  </div>
  
                  <div class="q-col col-12 col-sm-6 col-md-3">
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
                  <div class="q-col col-12 col-sm-6 col-md-3">
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
                  <div class="q-col col-12 col-sm-6 col-md-4">
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
                  <div class="q-col col-12 col-sm-6 col-md-4">
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
                  <div class="q-col col-12 col-sm-6 col-md-4">
             

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
                    label="Save"
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
  
      <q-table
        class="my-sticky-column-table"
        :rows="tablerows"
        :columns="columns"
        row-key="Id"
        v-model:selected="selected"
        dense
        :separator="separator"
        :filter="filter"
        :loading="loading"
        :pagination="{ rowsPerPage: 15 }"
        :rows-per-page-options="[10, 15, 50]"
      >
        <template v-slot:body-cell-business_name="props">
          <q-td :props="props">
            <b>
              {{ props.value }}
            </b>
          </q-td>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td key="type" :props="props">
            <div class="cell-content">
              <q-badge
            
              >
                {{ props.row.client_type.toUpperCase() }}
              </q-badge>
  
            </div>
          </q-td>
        </template>
  
        <template v-slot:top-left="props">
          <div
            class="title-container flex justify-center items-center"
            style="gap: 30px"
          >
            <!-- Table Title -->
            <q-label class="q-table__title q-mr-md">Patients Record</q-label>
  
         
  
            <!-- Add any other elements or styling as needed between the title and dropdown -->
          </div>
        </template>
   
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              class="q-mr-xs"
              round
              dense
              size="sm"
              icon="zoom_in"
              @click="viewForm(props)"
            />
            <q-btn
              class="q-mr-xs"
              round
              dense
              color="positive"
              size="sm"
              icon="edit"
              @click="EditRecord(props)"
            />
            <q-btn
              round
              dense
              color="red"
              size="sm"
              icon="delete"
              :loading="deleting"
              @click="DeleteRecord(props)"
            />
          </q-td>
        </template>
  
        <template v-slot:top-right="props">
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search here..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
  
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          >
            <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
              >{{ props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen" }}
            </q-tooltip>
          </q-btn>
  
          <q-btn
            flat
            round
            dense
            :icon="mode === 'grid' ? 'list' : 'grid_on'"
            @click="
              mode = mode === 'grid' ? 'list' : 'grid';
              separator = mode === 'grid' ? 'vertical' : 'horizontal';
            "
            v-if="!props.inFullscreen"
          >
            <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
              >{{ mode === "grid" ? "Vertical" : "Grid" }}
            </q-tooltip>
          </q-btn>
  
          
        </template>
  
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </div>
    <!-- <div class="q-pa-md">
          Selected: {{ JSON.stringify(selected) }}
      </div> -->
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

const AddPatient = () => {
  formProfile.value = true;
  addTransaction.value = true;
};

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