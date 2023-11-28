<template>
    <div class="q-pa-md">
      <q-btn
        label="Add Patient (+)"
        @click="AddPatient"
        class="q-mt-md q-mb-md bg-button1 text-white drawerActive"
        v-if="hasPermission('ADMIN')"
      />
  
      <q-dialog
        v-model="formProfile"
        persistent
        transition-show="scale"
        @hide="onHide"
      >
        <q-card style="width: 1000px; max-width: 80vw">
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
                      v-if="addTransaction"
                      :readonly="viewing != false"
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
                      :readonly="viewing != false"
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


                  <div class="q-col col-12 col-sm-12 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.first_name"
                      label="First Name"
                      lazy-rules
                      :rules="[rules.requiredField]"
                      :readonly="viewing != false"
                    />
                  </div>
  
                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      v-model="formInput.middle_name"
                      label="Middle Name"
                      :readonly="viewing != false"
                    />
                  </div>
  
                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      v-model="formInput.last_name"
                      label="Last Name"
                      lazy-rules
                      :rules="[rules.requiredField]"
                      :readonly="viewing != false"
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
                      :readonly="viewing != false"
                    />
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-6">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.home_address"
                      label="Address"
                      lazy-rules
                      :rules="[rules.requiredField]"
                      :readonly="viewing != false"
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
                      :readonly="viewing != false"
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
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.mobile_number"
                      label="Mobile Number"
                      lazy-rules
                      :rules="[rules.mobileNumber]"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.religion"
                      label="Religion"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.home_phone_number"
                      label="Home Phone #"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>
                  
                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.office_address"
                      label="Office Address"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.work_phone_number"
                      label="Work Phone #"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.marital_status"
                      label="Marital Status"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.spouse"
                      label="Spouse"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-6">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.person_responsible_for_the_account"
                      label="Person Responsible for the account"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-6">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.person_responsible_mobile_number"
                      label="Person Responsible Mobile #"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.relationship"
                      label="Relationship"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-4">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.referal_person"
                      label="Referral Person"
                      lazy-rules
                      v-if="editMode || viewing"
                      :readonly="viewing != false"
                    />
                  </div>
                  <div class="q-col col-12 col-sm-12 col-md-12">
                    <q-toolbar-title
                    ><span class="text-weight-bold text-center "
                      >Medical/Dental History</span
                    ></q-toolbar-title>
                  </div>
                  <div class="q-col col-12 col-sm-12 col-md-12">
                    <span
                      >Are you under the care of a physician? If yes, give the name, address and the reason.</span>
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-6">
                    
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.physician"
                      label="Physician"
                      lazy-rules
                      :readonly="viewing != false"

                    />
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-6">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.physaddress"
                      label="Physician Address"
                      lazy-rules
                      :readonly="viewing != false"

                    />
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-12">
                    <q-input
                      rows="2"
                      class="custom-input"
                      outlined
                      type="textarea"
                      dense
                      stack-label
                      v-model="formInput.reason"
                      label="Reason"
                      lazy-rules
                      style="resize: none;"
                      :readonly="viewing != false"

                    />
                  </div>
                  <div class="q-col col-12 col-sm-12 col-md-12">
                    <span
                      >Any hospitalization or surgery in the past 5 years? If yes, what for</span>
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-12">
                    <q-input
                      rows="2"
                      class="custom-input"
                      outlined
                      type="textarea"
                      dense
                      stack-label
                      v-model="formInput.hospitalization_reason"
                      label="Hospitalization"
                      lazy-rules
                      style="resize: none;"
                      :readonly="viewing != false"
                    />
                  </div>
                  <div class="q-col col-12 col-sm-12 col-md-12">
                    <span
                      >Please check if you have or had any of the following:</span>
                  </div>
                  <!-- {{ formInput }} -->
                  <div class="q-col col-12 col-sm-12 col-md-12">
                        <q-option-group
                        :options="conditions"
                        option-value="value"
                        option-label="label"
                        type="checkbox"
                        v-model="formInput.conditions"
                        :rules="[rules.requiredSelection]"
                        dense
                        map-options
                        emit-value
                        style="display:grid; align-items: center; grid-template-columns: 1fr 1fr 1fr;"
                        :disable="viewing != false"
                      />
                </div>
                <div class="q-col col-12 col-sm-12 col-md-12">
                    <span
                      >Are you presently taking any medication? If so, give the name(s) - Separate with comma</span>
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-12">
                    <q-input
                      rows="2"
                      class="custom-input"
                      outlined
                      type="textarea"
                      dense
                      stack-label
                      v-model="formInput.medication"
                      label="Medication"
                      lazy-rules
                      style="resize: none;"
                      :readonly="viewing != false"

                    />
                  </div>
                  <div class="q-col col-12 col-sm-12 col-md-12">
                    <span
                      >Are you allergic or sensitive to any food, drug or medication? - Separate with comma</span>
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-12">
                    <q-input
                      rows="2"
                      class="custom-input"
                      outlined
                      type="textarea"
                      dense
                      stack-label
                      v-model="formInput.allergies"
                      label="Allergies"
                      lazy-rules
                      style="resize: none;"
                      :readonly="viewing != false"

                    />
                  </div>
                  <!-- {{ formInput.pregnant.trim() }} -->
                  <div class="q-col col-12 col-sm-12 col-md-12" v-if="formInput.sex == 'Female'">
                      <span class="text-bold" style="font-size: 20px;"
                        >For Women Only</span>
                      <p>Are you pregnant?</p>
                      <q-radio v-model="formInput.pregnant" :val=true label="Yes" :disable="viewing !== false"/>
                      <q-radio v-model="formInput.pregnant" :val=false label="No" :disable="viewing !== false"/>

                  </div>
                  <div class="q-col col-12 col-sm-12 col-md-12" v-if="formInput.sex == 'Female'">
                   <q-input
                     class="custom-input"
                     outlined
                     dense
                     type="date"
                    option-value="date"
                    v-model="formInput.expected_date"
                    :placeholder="ph"
                     label="Expected Delivery"
                     lazy-rules
                     :readonly="viewing != false"
                   />

                 </div>
                 <div class="q-col col-12 col-sm-12 col-md-12" v-if="formInput.sex == 'Female'">
                    <span
                      >Do you have any problems associated with your menstrual period?</span>
                  </div>
                  <div class="q-col col-12 col-sm-6 col-md-12" v-if="formInput.sex == 'Female'">
                      <q-radio v-model="formInput.mens_problems" :val=true label="Yes"  :disable="viewing != false"/>
                      <q-radio v-model="formInput.mens_problems" :val=false label="No"  :disable="viewing != false"/>

                  </div>
                  
                
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
        title="Patients Record"
        :rows="tablerows"
        :columns="columns"
        row-key="Id"
        v-model:selected="selected"
        dense
        :separator="separator"
        :filter="filter"
        :loading="loading"
        :pagination="{rowsPerPage:15}"
        :rows-per-page-options="[10,15,50]"

        >

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
                    @click="EditRecord(props)"
                  >
                    <i class="fas fa-edit"></i>
                  </q-btn>

                  <q-btn

                    round
                    dense
                    color="red"
                    size="sm"
                    icon="delete"
                    @click="DeleteRecord(props)"
                  />

                  <q-btn
                    class="q-mr-xs"
                    round
                    dense
                    color="positive"
                    size="sm"
                    @click="AddImg(props)"
                  >
                  <i class="fas fa-image"></i>
                  </q-btn>

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

          <!-- <q-btn
            class="bg-button1 text-white"
            icon-right="archive"
            no-caps
            @click="exportTable"
          /> -->

        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

      </q-table>
    </div>

  </template>


<script setup>
import { ref, watch, computed } from "vue";
import { exportFile, useQuasar } from "quasar";
import { auth } from "../../stores/auth";
import api from "./API";
// import RecordHistory from '../components/RecordHistory.vue';
const formProfile = ref(false);
const addTransaction = ref(true);
const store = auth();
const $q = useQuasar();
const formInput = ref({conditions: []});
const submitting = ref(false);
const separator = ref("vertical");
const tablerows = ref([]);
const loading = ref(false);
const filter = ref("");
const deleting = ref(false);
const selected = ref([]);
const viewing = ref(false);
const editMode = ref(false); // Initially, we are not in edit mode
const recordViewing = ref(false);

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

const conditions = ref([
  { label: 'AIDS', value: 'aids', color: 'green' },
  { label: 'Anemia', value: 'anemia', color: 'green' },
  { label: 'Asthma', value: 'asthma', color: 'green' },
  { label: 'Bleeding Tendency', value: 'bleeding_tendency', color: 'green' },
  { label: 'Blood Disease', value: 'blood_disease', color: 'green' },
  { label: 'Blood Transfusio', value: 'blood_transfusio', color: 'green' }, // Fixed the typo here (Bracess to Braces)
  { label: 'Bypass', value: 'bypass', color: 'green' },
  { label: 'Chest Pains', value: 'chest_pains', color: 'green' },
  { label: 'Convolsions', value: 'convolsions', color: 'green' },
  { label: 'Diabetes', value: 'diabetes', color: 'green' },
  { label: 'Ear Disorder', value: 'ear_disorder', color: 'green' },
  { label: 'Epilepsy', value: 'epilepsy', color: 'green' },
  { label: 'Eye Disorder', value: 'eye_disorder', color: 'green' },
  { label: 'Heart Murmur', value: 'heart_murmur', color: 'green' },
  { label: 'Hemophilia', value: 'himophilia', color: 'green' },
  { label: 'Hepatitis', value: 'hepatitis', color: 'green' },
  { label: 'HIV(+)', value: 'hiv', color: 'green' },
  { label: 'Hormone Disorder', value: 'hormone_disorder', color: 'green' },
  { label: 'Hypertension', value: 'hypertension', color: 'green' },
  { label: 'Jaundice', value: 'jaundice', color: 'green' },
  { label: 'Kidney Disease', value: 'kidney_disease', color: 'green' },
  { label: 'Malignancy, Tumor or Growth', value: 'malignancy', color: 'green' },
  { label: 'Neurological Problems', value: 'neurological_problems', color: 'green' },
  { label: 'Pacemaker', value: 'pacemaker', color: 'green' },
  { label: 'Rheumatic Fever', value: 'rheumatic Fever', color: 'green' },
  { label: 'Skin Disease', value: 'skin_disease', color: 'green' },
  { label: 'Tuberculosis', value: 'tuberculosis', color: 'green' },
  { label: 'Others', value: 'others', color: 'green' }
]);


const hasPermission = (authority) => {
  if (store.roles.includes(authority)) {
    return true;
  }
  return false;
};



const columns = [
  {
    align: "left",
    label: "Name",
    field: (row) =>
      row.first_name + " " + (row.middle_name ?? "") + " " + row.last_name + " " + row.extension_name,
    name: "Name",
    sortable: true,
  },

 
  {
    align: "left",
    label: "Birthday",
    field: "Birthday",
    field: (row) => row.birthday,
    name: "Birthday",
    sortable: true,
  },
  {
    align: "left",
    label: "Sex",
    field: "Sex",
    field: (row) => row.sex,
    name: "Sex",
    sortable: true,
  },
  {
    align: "left",
    label: "Religion",
    field: "Religion",
    field: (row) => row.religion,
    name: "Religion",
    sortable: true,
  },
  {
    align: "left",
    label: "Home Address",
    field: "Home Address",
    field: (row) => row.home_address,
    name: "Home Address",
    sortable: true,
  },

  
  {
    align: "left",
    label: "Mobile Number",
    field: "Mobile Number",
    field: (row) => row.mobile_number,
    name: "Mobile Number",
    sortable: true,
  },
  
 
  { name: "actions", label: "Action", align: "center", style: "width:0px;" },
];




const AddPatient = () => {
  formInput.value.conditions = [];
  formProfile.value = true;
  addTransaction.value = true;
  editMode.value = false;
  recordViewing.value = false;
};


const EditRecord = (val) => {
  formInput.value.conditions = [];
  formInput.value = val.row;
  formProfile.value = true;
  editMode.value = true;
  addTransaction.value = false;

  if(formInput.value.pregnant == 1) {
    formInput.value.pregnant = true
  }else{
    formInput.value.pregnant = false
  }

  if(formInput.value.mens_problems == 1) {
    formInput.value.mens_problems = true
  }else{
    formInput.value.mens_problems = false
  }
};

const onHide = () => {
  if (editMode.value) {
    formInput.value = {};
  }
  if (viewing.value) {
    formInput.value = {};
  }
  viewing.value = false;

};


const viewForm = (val) => {
  // formInput.value = {conditions: []};
  formInput.value.conditions = [];
  formInput.value = val.row;
  viewing.value = true;
  formProfile.value = true;

  if(formInput.value.pregnant == 1) {
    formInput.value.pregnant = true
  }else{
    formInput.value.pregnant = false
  }

  if(formInput.value.mens_problems == 1) {
    formInput.value.mens_problems = true
  }else{
    formInput.value.mens_problems = false
  }
  
};

const onReset = () => {
  // formInput.value.conditions = [];
  // loadData();
};

const DeleteRecord = (val) => {
  $q.dialog({
    title: "Archive Patient",
    message:
      "Are you sure you want to archive, profile: " +
      val.row.first_name +

      "?",
    cancel: true,
  }).onOk(() => {
    deleting.value = true;
    api
      .deletePatient(val.row)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Delete User",
            icon: "report_problem",
          });
          deleting.value = false;
        } else {
          // Error response
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Record has been deleted!",
          });
          deleting.value = false;
          formProfile.value = false;
          loadData();
        }
      })
      .catch((error) => {
        $q.notify({
          color: "negative",
          position: "top",
          message: error.message ?? "Failed to Delete User",
          icon: "report_problem",
        });
        deleting.value = false;
      });
  });
};

const onSubmit = (val) => {
  // add

  // if (!Array.isArray(formInput.conditions)) {
  //   formInput.conditions = [formInput.conditions];
  // }


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
          loadData();
          submitting.value = false;
          formProfile.value = false;

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
  } else {
    $q.dialog({
      title: "Edit Patient Record",
      message: "Are you sure you want to update?",
      cancel: true,
    }).onOk(() => {
      submitting.value = true;
      api
        .updatePatient(formInput.value)
        .then((response) => {
          console.log(response);
          if (response.data?.error || response.data?.message) {
            $q.notify({
              color: "negative",
              position: "top",
              message:
                JSON.stringify(response.data?.error) ??
                JSON.stringify(response.data?.message) ??
                "Failed to Update Patient",
              icon: "report_problem",
            });
            submitting.value = false;
          } else {
            // Error response
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Patient has been updated!",
            });
            submitting.value = false;
            formProfile.value = false;
            onReset();
          }
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: error.message ?? "Failed to Update Patient",
            icon: "report_problem",
          });
          submitting.value = false;
        });
    });
  }
};


const loadData = () => {
  loading.value = true;
  api
    .viewAllPatients()
    .then((response) => {
      if (response == "401") {
        $q.notify({
          color: "negative",
          position: "top",
          message: "Unauthenticated",
          icon: "report_problem",
        });
        loading.value = false;
        return;
      }
      console.log(response);
      tablerows.value = response.data;
      loading.value = false;
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Loading failed",
        icon: "report_problem",
      });
      loading.value = false;
    });

};
loadData();

</script>