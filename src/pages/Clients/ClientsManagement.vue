<template>
  <div class="q-pa-md">
    <q-btn
      label="Add Client (+)"
      @click="AddRecord"
      class="q-mt-md q-mb-md bg-button1 text-white"
      v-if="hasPermission('ADMIN') || hasPermission('MODIFY_CLIENT')"
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
              >Client Details</span
            ></q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <div
            v-if="viewing || addTransaction == false"
            style="margin-bottom: 15px"
          >
            <PrestigeCardComponent
              :name="
                formInput.first_name +
                (formInput.middle_name != '' && formInput.middle_name != null
                  ? (' ' + formInput.middle_name.charAt(0).toUpperCase()+'.')
                  : '') +
                ' ' +
                formInput.last_name
              "
              :qrCode="getAccountNumberHash(formInput.account_number)"
              :type="formInput.client_type"
              :account_number="formInput.account_number"
              v-if="formInput.client_type == 'Prestige'"
            />

            <BasicCardComponent
              :name="
                formInput.first_name +
                (formInput.middle_name != '' && formInput.middle_name != null
                  ? (' ' + formInput.middle_name.charAt(0).toUpperCase()+'.')
                  : '') +
                ' ' +
                formInput.last_name
              "
              :qrCode="getAccountNumberHash(formInput.account_number)"
              :type="formInput.client_type"
              :account_number="formInput.account_number"
              v-if="formInput.client_type == 'Basic'"
            />
          </div>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sd">
            <div class="q-gutter-md q-col-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="q-col col-12 col-sm-12 col-md-4">
                  <q-input
                    class="custom-input"
                    rounded
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
                    rounded
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
                    rounded
                    outlined
                    dense
                    v-model="formInput.last_name"
                    label="Last Name"
                    lazy-rules
                    :rules="[rules.requiredField]"
                    :readonly="viewing != false"
                  />
                </div>
                <div class="q-col col-12 col-sm-6 col-md-8">
                  <q-input
                    class="custom-input"
                    rounded
                    outlined
                    dense
                    stack-label
                    v-model="formInput.address"
                    label="Address"
                    lazy-rules
                    :rules="[rules.requiredField]"
                    :readonly="viewing != false"
                  />
                </div>
                <div class="q-col col-12 col-sm-6 col-md-4">
                  <q-input
                    class="custom-input"
                    rounded
                    outlined
                    dense
                    stack-label
                    v-model="formInput.email"
                    label="Email"
                    lazy-rules
                    :rules="[rules.requiredField, rules.properEmail]"
                    :readonly="viewing != false"
                  />
                </div>

                <div class="q-col col-12 col-sm-6 col-md-6">
                  <q-input
                    class="custom-input"
                    rounded
                    outlined
                    dense
                    stack-label
                    v-model="formInput.phone_number"
                    label="Phone Number"
                    lazy-rules
                    :rules="[rules.requiredField, rules.mobileNumber]"
                    :readonly="viewing != false"
                  />
                </div>
                <div class="q-col col-12 col-sm-6 col-md-6">
                  <q-select
                    class="custom-input-select col-5"
                    outlined
                    rounded
                    v-model="formInput.client_type_id"
                    :options="clientTypeOptions"
                    option-value="id"
                    option-label="client_type"
                    dense
                    map-options
                    label="Type"
                    emit-value
                    :rules="[rules.requiredField]"
                    :readonly="viewing != false"
                  />
                </div>

                <div
                  class="q-col col-12 col-sm-6 col-md-6"
                  v-if="hasPermission('ADMIN')"
                >
                  <q-select
                    class="custom-input-select col-5"
                    outlined
                    rounded
                    v-model="formInput.business_id"
                    :options="businessFormOptions"
                    option-value="id"
                    option-label="business_name"
                    dense
                    map-options
                    label="Business"
                    emit-value
                    :rules="[rules.requiredField]"
                    :readonly="viewing != false"
                  />
                </div>

                <div class="q-col col-12 col-sm-12 col-md-12">
                  <q-toggle
                    v-model="formInput.active"
                    label="Active"
                    :disable="viewing != false"
                  ></q-toggle>
                </div>
              </div>
            </div>

            <!-- 
            <div class="q-gutter-md row">
              <q-input
                dense
                v-model="formInput.BDate"
                label="Birthdate"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="formInput.BDate">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                dense
                v-model="formInput.Date_Hired"
                label="Hired Date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="formInput.Date_Hired">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                dense
                v-model="formInput.LicExpiry"
                label="License Exp. Date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="formInput.LicExpiry">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div> -->

            <div class="row justify-end">
              <div v-if="!viewing">
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
              <div v-else>
                <q-btn
                  :loading="printing"
                  label="Print"
                  class="drawerActive"
                  @click="printCard"
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
      :dark="store.darkMode"
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
              :color="props.row.client_type == 'Prestige' ? 'pink' : 'green'"
              v-if="props.row.client_type"
            >
              {{ props.row.client_type.toUpperCase() }}
            </q-badge>

            <q-badge :color="'orange'" v-else> PENDING </q-badge>
          </div>
        </q-td>
      </template>

      <template v-slot:top-left="props">
        <div
          class="title-container flex justify-center items-center"
          style="gap: 30px"
        >
          <!-- Table Title -->
          <q-label class="q-table__title q-mr-md">Clients Management</q-label>

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
            v-if="hasPermission('ADMIN') || hasPermission('EDIT_CLIENT')"
          />
          <q-btn
            round
            dense
            color="red"
            size="sm"
            icon="delete"
            :loading="deleting"
            @click="DeleteRecord(props)"
            v-if="hasPermission('ADMIN') || hasPermission('DELETE_CLIENT')"
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
import QRCodeVue3 from "qrcode-vue3";
import PrestigeCardComponent from "../../components/CardPrestige.vue";
import BasicCardComponent from "../../components/CardBasic.vue";
import { SHA256 } from "crypto-js";
import html2pdf from "html2pdf.js";
import CryptoJS from 'crypto-js';
const store = auth();
const $q = useQuasar();
const mode = ref(null);
const addTransaction = ref(true);

const rejecting = ref(false);
const approving = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const viewing = ref(false);
const printing = ref(false);

const selected = ref([]);
const separator = ref("vertical");
const rows = [];
const tablerows = ref([]);
const loading = ref(false);
const filter = ref("");
const formProfile = ref(false);
const usertype = ref(store.user.usertype);
const businessId = ref(store.user.businessId);
const selectedBusiness = ref();
let businessOptions = ref([]);
let clientTypeOptions = ref([]);
let businessFormOptions = ref([]);
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

const hasPermission = (authority) => {
  if (store.roles.includes(authority)) {
    return true;
  }
  return false;
};

const formInput = ref({});

const columns = [
  // {
  //   name: "Id",
  //   required: true,
  //   label: "EmpId",
  //   align: "left",
  //   field: (row) => row.Id,
  //   format: (val) => `${val}`,
  //   sortable: true,
  // },
  {
    align: "left",
    label: "Name",
    field: (row) =>
      row.first_name + " " + (row.middle_name ?? "") + " " + row.last_name,
    name: "Name",
    sortable: true,
  },

  {
    align: "left",
    label: "Email",

    field: (row) => row.email,
  },
  {
    align: "left",
    label: "Phone Number",

    field: (row) => row.phone_number,
  },
  {
    align: "left",
    label: "Address",

    field: (row) => row.address,
  },
  {
    name: "type",
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
    label: "Active",
    name: "active",
    field: (row) => (row.active == 1 ? "true" : "false"),
    slot: "body-cell-active",
  },
  {
    name: "actions",
    label: "Action",
    align: "center",
    style: "width:0px;",
  },
];
const getAccountNumberHash = (accountNumber) => {
 
 

  let hex = '';
      for (let i = 0; i < accountNumber.length; i++) {
        hex += accountNumber.charCodeAt(i).toString(16).padStart(2, '0');
      }

      let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
console.log(hex)
console.log(str)
 

  return hex;
};

const getBusinessTypes = () => {
  api
    .getBusinesses()
    .then((response) => {
      console.log(response);
      businessFormOptions.value = response.businesses;
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

const getClientTypesList = () => {
  api
    .getClientTypes()
    .then((response) => {
      console.log(response);
      clientTypeOptions.value = response.client_type;

      loading.value = false;
    })
    .catch((error) => {
      console.log(error);
      loading.value = false;
      $q.notify({
        color: "negative",
        position: "top",
        message: "Failed to load Client Types",
        icon: "report_problem",
      });
      loading.value = false;
    });
};

const loadData = () => {
  loading.value = true;
  if (usertype.value.toUpperCase() == "ADMIN") {
    businessId.value = null;
    formInput.value.business_id = null;
  }

  api
    .viewAllClients(businessId.value)
    .then((response) => {
      console.log(response);

      tablerows.value = response.length > 0 ? response : [];
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
getClientTypesList();
const AddRecord = () => {
  formProfile.value = true;
  addTransaction.value = true;
  formInput.value.active = false;
};

const EditRecord = (val) => {
  formInput.value = val.row;
  formProfile.value = true;
  addTransaction.value = false;
};

const DeleteRecord = (val) => {
  $q.dialog({
    title: "Delete Record",
    message:
      "Are you sure you want to delete, profile: " +
      val.row.first_name +
      " " +
      val.row.last_name +
      "?",
    cancel: true,
  }).onOk(() => {
    deleting.value = true;
    api
      .deleteClient(val.row)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Delete Client",
            icon: "report_problem",
          });
          deleting.value = false;
        } else {
          // Error response
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Client has been deleted!",
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
          message: error.message ?? "Failed to Delete Client",
          icon: "report_problem",
        });
        deleting.value = false;
      });
  });
};

const onSubmit = (val) => {
  // add
  if (addTransaction.value) {
    submitting.value = true;
    api
      .createClient(formInput.value)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Create Client",
            icon: "report_problem",
          });
          submitting.value = false;
        } else {
          // Error response
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Client has been saved!",
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
          message: error.message ?? "Failed to Create Client",
          icon: "report_problem",
        });
        submitting.value = false;
      });
  } else {
    $q.dialog({
      title: "Edit Record",
      message: "Are you sure you want to update?",
      cancel: true,
    }).onOk(() => {
      submitting.value = true;
      api
        .updateClient(formInput.value)
        .then((response) => {
          console.log(response);
          if (response.data?.error || response.data?.message) {
            $q.notify({
              color: "negative",
              position: "top",
              message:
                JSON.stringify(response.data?.error) ??
                JSON.stringify(response.data?.message) ??
                "Failed to Update Client",
              icon: "report_problem",
            });
            submitting.value = false;
          } else {
            // Error response
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Client has been updated!",
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
            message: error.message ?? "Failed to Update Client",
            icon: "report_problem",
          });
          submitting.value = false;
        });
    });
  }
};
const selectBusiness = (props) => {
  loadDataFiltered();
};

const loadDataFiltered = () => {
  loading.value = true;

  api
    .viewAllClients(selectedBusiness.value.id)
    .then((response) => {
      console.log(response);
      tablerows.value = response.length > 0 ? response : [];
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

const viewForm = (val) => {
  formInput.value = val.row;
  viewing.value = true;
  formProfile.value = true;
  console.log(formInput.value.account_number)
};
const onHide = () => {
  if (viewing.value) {
    formInput.value = { business_id: businessId.value };
  }
  viewing.value = false;
  if (!addTransaction.value) {
    formInput.value = { business_id: businessId.value };
    loadData();
  }
};
const onReset = () => {
  formInput.value = { business_id: businessId.value };
  loadData();
};
const printCard = () => {
  printing.value = true;
  console.log("execute print");
try {
  const contentToPrint = document.querySelector(".printContent"); // Use the appropriate class selector

  const pdfOptions = {
    margin: 0,
    filename: formInput.value.account_number+"_card",
    html2canvas: { scale: 4 },
    
    jsPDF: { 
      unit: "mm", 
      
      format: [83, 51.85],
      orientation: 'landscape',
      autoPaging: false
    },
  };

  const pdf = html2pdf().from(contentToPrint).set(pdfOptions);
  pdf.output("dataurlnewwindow"); // Open the PDF in a new window for printing
  printing.value = false;
} catch (error) {
  console.log(error)
  printing.value = false;
}
  
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
const activeValue = computed({
  get: () => (formInput.value.active ? 1 : 0),
  set: (newVal) => {
    formInput.value.active = newVal === 1 ? true : false;
  },
});

watch(formInput, (newVal) => {
  // Update activeValue whenever formInput.active changes
  activeValue.value = newVal.active ? 1 : 0;
});

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
.my-sticky-column-table thead tr:last-child th:last-child {
  background-color: #fff;
}

td:last-child {
  background-color: #fff;
}

th:last-child,
td:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
}
</style>
