<template>
    <div class="q-pa-md">

      <q-table
        title="Pending Patients"
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
                    color="positive"
                    size="sm"
                    @click="approve(props)"
                  >
                  <i class="fas fa-check"></i>
                  </q-btn>

                  <q-btn
                    class="q-mr-xs"
                    round
                    dense
                    color="red"
                    size="sm"
                    @click="reject(props)"
                  >
                  <i class="fas fa-times"></i>
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
import api from "./API";

const formProfile = ref(false);
const $q = useQuasar();
const separator = ref("vertical");
const tablerows = ref([]);
const loading = ref(false);
const filter = ref("");
const deleting = ref(false);
const selected = ref([]);



const columns = [
  {
    align: "left",
    label: "Patient Name",
    field: (row) =>
      row.first_name + " " + (row.middle_name ?? "") + " " + row.last_name + " " + (row.extension_name ?? ""),
    name: "Patient Name",
    sortable: true,
  },

 
  {
    align: "left",
    label: "Services",
    field: "Services",
    field: (row) => row.services,
    name: "Services",
    sortable: true,
  },
  {
    align: "left",
    label: "Price",
    field: "Price",
    field: (row) => `₱${row.price}`,
    name: "Price",
    sortable: true,
  },
  {
    align: "left",
    label: "Duration",
    field: "Duration",
    field: (row) => `${Math.round(row.duration)} minutes`,
    name: "Duration",
    sortable: true,
  },

  {
    align: "left",
    label: "Status",
    field: "Status",
    field: (row) => row.approved == 1 ? "Approve": row.approved == null ? "Pending": "Rejected",
    name: "Status",
    sortable: true,
  },
  
 
  { name: "actions", label: "Action", align: "center", style: "width:0px;" },
];


const reject = (val) => {
  $q.dialog({
    title: "Reject Booking",
    message:
      "Are you sure you want to reject, patient: " +
      val.row.first_name + " " + val.row.last_name + "?",
    cancel: true,
  }).onOk(() => {
    deleting.value = true;
    api
      .rejectPatient(val.row.id)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Reject Patient Booking",
            icon: "report_problem",
          });
          deleting.value = false;
        } else {
          // Error response
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Booking has been rejected!",
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
          message: error.message ?? "Failed to reject patient booking",
          icon: "report_problem",
        });
        deleting.value = false;
      });
  });
};


const approve = (val) => {
  $q.dialog({
    title: "Approve Booking",
    message:
      "Are you sure you want to approve, patient: " +
      val.row.first_name + " " + val.row.last_name + "?",
    cancel: true,
  }).onOk(() => {
    deleting.value = true;
    api
      .approvePatient(val.row.id)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Approve Booking",
            icon: "report_problem",
          });
          deleting.value = false;
        } else {
          // Error response
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Patient has been successfully booked!",
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
          message: error.message ?? "Failed to Booked Patient",
          icon: "report_problem",
        });
        deleting.value = false;
      });
  });
};




const loadData = () => {
  loading.value = true;
  api
    .viewAllPending()
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
      tablerows.value = response.bookings;
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