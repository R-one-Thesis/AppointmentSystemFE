<template>
    <div class="q-pa-md">
    <q-btn
        label="Add Doctor"
        @click="AddServices"
        class="q-mt-md q-mb-md bg-button1 text-white drawerActive"
      />
  
      <q-dialog
        v-model="formProfile"
        persistent
        transition-show="scale"
        @hide="onHide"
      >
        <q-card style="width: 500px; max-width: 80vw">
          <q-toolbar>
            <!-- <q-avatar>
                <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
              </q-avatar> -->
            <q-toolbar-title
              ><span class="text-weight-bold"
                >Doctor Details</span
              ></q-toolbar-title
            >
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
  
          <q-card-section>
            
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sd">
              <div class="q-gutter-md q-col-gutter-md">
                <div class="row q-col-gutter-md">

                  <div class="q-col col-12 col-sm-12 col-md-12">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.dentist"
                      label="Dentist Name"
                      lazy-rules
                      :rules="[rules.requiredField]"
                      :readonly="viewing != false"
                    />
                  </div>
                  <div class="q-col col-12 col-sm-12 col-md-12">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.specialization"
                      label="Specialization"
                      lazy-rules
                      :rules="[rules.requiredField]"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-12 col-md-12">
                    <q-input
                      class="custom-input"
                      outlined
                      dense
                      stack-label
                      v-model="formInput.mobile_number"
                      label="Mobile Number"
                      lazy-rules
                      :rules="[rules.requiredField, rules.mobileNumber]"
                      :readonly="viewing != false"
                    />
                  </div>

                  <div class="q-col col-12 col-sm-12 col-md-12">
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
        title="Services Lists"
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
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { auth } from "../../stores/auth";
import api from "./API";

const $q = useQuasar();
const formProfile = ref(false);
const addTransaction = ref(true);
const loading = ref(false);
const formInput = ref({});
const viewing = ref(false);
const tablerows = ref([]);
const submitting = ref(false);
const editMode = ref(false); // Initially, we are not in edit mode
const recordViewing = ref(false);
const deleting = ref(false);

const rules = ref({
  requiredField: (v) => !!v || "Required field.",
  requiredSelection: (v) =>
    (!!v && v.length > 0) || "Required at least one selection",
  mobileNumber: (v) =>
    !v ||
    /^(09)\d{9}$/.test(v) ||
    "Mobile number must be valid. Ex. starts with (09) followed by xxxxxxxxx, where x = numeric character only",
});



const AddServices = () => {
  formProfile.value = true;
  addTransaction.value = true;
  recordViewing.value = false;

};

const EditRecord = (val) => {
  formInput.value = val.row;
  formProfile.value = true;
  editMode.value = true;
  addTransaction.value = false;
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
  formInput.value = val.row;
  viewing.value = true;
  formProfile.value = true;

  
};

const onReset = () => {
  // formInput.value = {}
  // loadData();
};


const columns = [
  {
    align: "left",
    label: "Dentist Name",
    field: "Dentist Name",
    field: (row) => row.dentist,
    name: "Dentist Name",
    sortable: true,
  },
  {
    align: "left",
    label: "Specialization",
    field: "Specialization",
    field: (row) => row.specialization,
    name: "Specialization",
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
  {
    align: "left",
    label: "Email",
    field: "Email",
    field: (row) => row.email,
    name: "Email",
    sortable: true,
  },
  
 
  { name: "actions", label: "Action", align: "center", style: "width:0px;" },
];


const onSubmit = (val) => {
  // add


  if (addTransaction.value) {
    console.log(formInput);
    submitting.value = true;
    api
    .addDoctor(formInput.value)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Add Services",
            icon: "report_problem",
          });
          submitting.value = false;
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Services successfully added",
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
          message: error.message ?? "Failed to add Services",
          icon: "report_problem",
        });
        submitting.value = false;
      });
  }  else {
    $q.dialog({
      title: "Edit Doctor",
      message: "Are you sure you want to update?",
      cancel: true,
    }).onOk(() => {
      submitting.value = true;
      api
        .updateDoctor(formInput.value)
        .then((response) => {
          console.log(response);
          if (response.data?.error || response.data?.message) {
            $q.notify({
              color: "negative",
              position: "top",
              message:
                JSON.stringify(response.data?.error) ??
                JSON.stringify(response.data?.message) ??
                "Failed to Update Doctor",
              icon: "report_problem",
            });
            submitting.value = false;
          } else {
            // Error response
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Doctor has been successfully updated!",
            });
            submitting.value = false;
            formProfile.value = false;
            onReset();
            loadData();
          }
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: error.message ?? "Failed to Update Doctor",
            icon: "report_problem",
          });
          submitting.value = false;
        });
    });
  }
};

const DeleteRecord = (val) => {
  $q.dialog({
    title: "Delete Doctor",
    message:
      "Are you sure you want to delete, doctor: " + val.row.dentist + "?",
    cancel: true,
  }).onOk(() => {
    deleting.value = true;
    api
      .deleteDoctor(val.row)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Delete Doctor",
            icon: "report_problem",
          });
          deleting.value = false;
        } else {
          // Error response
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Doctor has been succefully deleted!",
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
          message: error.message ?? "Failed to Delete Doctor",
          icon: "report_problem",
        });
        deleting.value = false;
      });
  });
};

const loadData = () => {
  loading.value = true;
  api
    .viewAllDoctors()
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
      tablerows.value = response.dentist;
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