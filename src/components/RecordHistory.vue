<template>
    <q-table
        title="Patients Record History"
        :rows="tablerows"
        :columns="columns"
        row-key="Id"
        selection="single"
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
                <!-- <q-btn
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
                  /> -->

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
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { exportFile, useQuasar } from "quasar";
const $q = useQuasar();
const separator = ref("vertical");
const tablerows = ref([]);
const loading = ref(false);
const filter = ref("");
const selected = ref([]);



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
    label: "Date",
    field: "Date",
    field: (row) => row.date,
    name: "Date",
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

  {
    align: "left",
    label: "Previous Medical History",
    field: "Previous Medical History",
    field: (row) => row.religion,
    name: "Previous Medical History",
    sortable: true,
  },
  
 
//   { name: "actions", label: "Action", align: "center", style: "width:0px;" },
];

</script>