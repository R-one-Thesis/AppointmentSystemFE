<template>
    <div class="q-pa-md">
     
      <q-table
        class="my-sticky-column-table"
        :rows="tablerowsTransaction"
        :columns="columnsTransaction"
        row-key="id"
        :dark="store.darkMode"
        v-model:selected="selected"
        dense
        :separator="separator"
        :filter="filter"
        :loading="loading"
        :pagination="{ rowsPerPage: 15 }"
        :rows-per-page-options="[10, 15, 50]"
        separator="vertical"
      >
      <template v-slot:body-cell-transaction_type="props">
        <q-td key="transaction_type" :props="props">
          <div class="cell-content">
            <q-badge
              :color="props.row.transaction_type == 'Reward Points' ? 'green' : 'red'"
            
            >
              {{ props.row.transaction_type.toUpperCase() }}
            </q-badge>

         
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-void="props">
        <q-td key="void" :props="props">
          <div class="cell-content">
           
              <q-badge :color="props.row.void == 1 ? 'green' : 'red'" 
               @click="voidTransaction(props.row)"
                style="cursor: pointer">
              {{ props.row.void == 1 ? "true" : "false" }}
            </q-badge>
          
            

         
          </div>
        </q-td>
      </template>
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
              :color="props.row.client_type == 'Prestige' ? 'pink' : 'green'"
              v-if="props.row.client_type"
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
            <q-label class="q-table__title q-mr-md">Transactions List</q-label>
  
            <!-- Dropdown -->
            <div class="q-col col-12 col-sm-6 col-md-12" style="width: 150px">
              <q-select
                v-model="selectedBusiness"
                :options="businessOptions"
                option-value="business_id"
                option-label="business_name"
                dense
                map-options
                label="Business"
                emit-value
                @update:model-value="selectBusiness(props)"
                v-if="hasPermission('ADMIN')"
              />
            </div>
  
            <!-- Add any other elements or styling as needed between the title and dropdown -->
          </div>
        </template>
        <template v-slot:body-cell-active="props">
          <q-td key="status" :props="props">
            <div class="cell-content">
              <q-badge :color="props.row.active == 1 ? 'green' : 'red'">
                {{ props.row.active == 1 ? "true" : "false" }}
              </q-badge>
            </div>
          </q-td>
        </template>
        <!-- <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              class="q-mr-xs"
              round
              dense
              size="sm"
              icon="zoom_in"
              @click="viewForm(props.row)"
              :loading="props.row.loading"
            />
    
          </q-td>
        </template> -->
  
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
  
          <q-btn
            class="bg-button1 text-white"
            icon-right="archive"
            no-caps
            @click="exportTable"
          />
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
  import { date } from 'quasar';
  const store = auth();
  const $q = useQuasar();
  const mode = ref(null);
  
  const viewing = ref(false);
  
  
  const selected = ref([]);
  const separator = ref("horizontal");
  const rows = [];
  const tablerows = ref([]);
  const tablerowsTransaction = ref([]);
  const loading = ref(false);
  const filter = ref("");
  const filterTransaction = ref("");
  const formProfile = ref(false);
  const viewTransaction = ref(false);
  const usertype = ref(store.user.usertype);

  const businessId = ref(store.user.businessId);
  const selectedBusiness = ref();
  let businessOptions = ref([]);
  const hasPermission = (authority) => {
    if (store.roles.includes(authority)) {
      return true;
    }
    return false;
  };
  
  const formInput = ref({});
  
  const columns = [
  
  {
    align: "left",
    label: "Client/Owner",
    field: (row) =>
      row.first_name + " " + (row.middle_name ?? "" )+ " " + row.last_name,
    name: "Name",
    sortable: true,
  },
    {
      align: "left",
      label: "Account No",
  
      field: (row) => row.account_number    ,
    },
    {
      align: "left",
      label: "Balance",
  
      field: (row) => row.current_balance,
    },
    {
      name: 'type',
      align: "left",
      label: "Type",
     
      field: (row) => row.client_type,
      slot: "body-cell-type",
    },
    {
      align: "left",
      label: "Business",
      name: "business_name",
      field: (row) => row.business_name.toUpperCase(),
    },

    {
      name: "actions",
      label: "Action",
      align: "center",
      style: "width:0px;",
    },
  ];

  const columnsTransaction = [
   
  {
    align: "left",
    label: "Client",
    field: (row) =>
      row.first_name + " " + (row.middle_name ?? "" )+ " " + row.last_name,
    name: "Name",
    sortable: true,
  },
  {
    align: "left",
    label: "Transaction Date",
    field: (row) => formatDate(row.created_at),
    name: "transaction_date",
    sortable: true,
  },
  {
    align: "left",
    label: "Reference No",
    field: (row) =>
      row.reference_id,
    name: "reference_id",
    sortable: true,
  },
  {
    align: "left",
    label: "Receipt No",
    field: (row) =>
      row.reciept_number,
    name: "reciept_number",
    sortable: true,
  },

  {
    align: "left",
    label: "Amount",
    field: (row) => `₱${row.reciept_amount.toFixed(2)}`,
    name: "reciept_amount",
    sortable: true,
  },

  {
    align: "left",
    label: "Points",
    field: (row) =>
      row.points,
    name: "points",
    sortable: true,
  },

  
  {
    align: "left",
    label: "Transaction Type",
    field: (row) =>
      row.transaction_type,
    name: "transaction_type",
    sortable: true,
  },
  {
    align: "left",
    label: "Previous Points",
    field: (row) =>
      row.previous_balance,
    name: "previous_balance",
    sortable: true,
  },
  {
      name: 'type',
      align: "left",
      label: "Type",
     
      field: (row) => row.client_type,
      slot: "body-cell-type",
    },
    {
      align: "left",
      label: "Business",
      name: "business_name",
      field: (row) => row.business_name.toUpperCase(),
    },
  {
    align: "left",
    label: "Void",
    field: (row) => row.void == 1 ? 'true' : 'false',
    name: "void",
    sortable: true,
    
  },
    

    // {
    //   name: "actions",
    //   label: "Action",
    //   align: "center",
    //   style: "width:0px;",
    // },
  ];
  
  const formatDate = (dateString) => {
  const dateObject = new Date(dateString);
  return date.formatDate(dateObject, 'YYYY-MM-DD HH:mm:ss');

  
};
  const getBusinessTypes = () => {
    api
      .getBusinesses()
      .then((response) => {
        console.log(response);
      
        businessOptions.value.push(...response.businesses);
  
        businessOptions.value.unshift({ id: null, business_name: "All" });
        selectedBusiness.value = businessOptions.value[0];
        loading.value = false;
      })
      .catch((error) => {
        console.log(error);
        loading.value = false;
        $q.notify({
          color: "negative",
          position: "top",
          message: "Loading failed",
          icon: "report_problem",
        });
        loading.value = false;
      });
  };

  const voidTransaction = (transactionDetails) => {

    console.log(transactionDetails)

  }
  const loadData = () => {
    loading.value = true;
    if (usertype.value.toUpperCase() == "ADMIN") {
      businessId.value = null;
 
    }
  
    api
      .viewAllTransactions(businessId.value)
      .then((response) => {
        console.log(response);
  
        tablerowsTransaction.value = response.transactions?.length > 0 ? response.transactions : [];
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
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
  getBusinessTypes();

  
  const selectBusiness = (props) => {
    loadDataFiltered();
  };
  
  const loadDataFiltered = () => {
    loading.value = true;
  
    api
      .viewAllTransactions(selectedBusiness.value.id)
      .then((response) => {
        console.log(response);
        tablerowsTransaction.value = response.transactions?.length > 0 ? response.transactions : [];
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
        $q.notify({
          color: "negative",
          position: "top",
          message: "Loading failed",
          icon: "report_problem",
        });
        loading.value = false;
      });
  };
  
  const viewForm = (row) => {

    getAccountTransaction(row);

    
   
  };

  function wrapCsvValue(val, formatFn, row) {
    let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  
    formatted =
      formatted === void 0 || formatted === null ? "" : String(formatted);
  
    formatted = formatted.split('"').join('""');
    /**
     * Excel accepts \n and \r in strings, but some other CSV parsers do not
     * Uncomment the next two lines to escape new lines
     */
    // .split('\n').join('\\n')
    // .split('\r').join('\\r')
  
    return `"${formatted}"`;
  }

  

  
  const exportTable = () => {
    // naive encoding to csv format
    const content = [columns.map((col) => wrapCsvValue(col.label))]
      .concat(
        tablerows.value.map((row) =>
          columns
            .map((col) =>
              wrapCsvValue(
                typeof col.field === "function"
                  ? col.field(row)
                  : row[col.field === void 0 ? col.name : col.field],
                col.format,
                row
              )
            )
            .join(",")
        )
      )
      .join("\r\n");
  
    const status = exportFile("table-export.csv", content, "text/csv");
  
    if (status !== true) {
      $q.notify({
        message: "Browser denied file download...",
        color: "negative",
        icon: "warning",
      });
    }
  };
  </script>
  
  <style lang="scss">

  </style>
  