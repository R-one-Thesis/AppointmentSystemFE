<template>
  <div class="q-pa-md">
    <q-btn
      label="Add User (+)"
      @click="AddRecord"
      class="q-mt-md q-mb-md bg-button1 text-white"
    />
    <q-dialog
      v-model="formProfile"
      persistent
      transition-show="flip-down"
      @hide="onHide"
    >
      <q-card style="width: 650px; max-width: 80vw">
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
         
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sd">
            <div class="q-gutter-md q-col-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="q-col col-12 col-sm-6 col-md-6">
                    <q-input 
                      class="custom-input"
                      :readonly="viewing != false"
                      rounded
                      outlined
                      stack-label
                      dense 
                      label="Email" 
                      v-model="formInput.email" 
                      :rules="[rules.requiredField, rules.properEmail]">
                        </q-input>


                 
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-6">
             

                    <q-input
                    class="custom-input"
                    :readonly="viewing != false"
                    rounded
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


                  <div class="q-col col-12 col-sm-6 col-md-6">
                    <q-input
                    class="custom-input"
                    :readonly="true"
                    rounded
                    outlined
                    stack-label
                      dense
                      label="Suggested Password"
                      readonly
                      v-model="generatedPassword"
                    
                      v-if="addTransaction"
                    >
                      <template v-slot:append>
                        <q-icon
                          name="content_copy"
                          class="cursor-pointer"
                          @click="copyToClipboard(generatedPassword)"
                        ></q-icon>
                      </template>
                    </q-input>

                 
                  </div>

                  <div class="q-col col-12 col-sm-6 col-md-6">
             
                    <q-input
                    class="custom-input"
                    :readonly="viewing != false"
                    rounded
                    outlined
                    stack-label
                      dense
                      label="Confirm Password"
                      v-model="passwordConfirm"
                      :type="isPwdConfirm ? 'password' : 'text'"
                      :rules="[rules.requiredField, rules.matchPassword]"
                      v-if="addTransaction"
                    >
                      
                      <template v-slot:append>
                        <q-icon
                          :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwdConfirm = !isPwdConfirm"
                        ></q-icon>
                      </template>
                    </q-input>
                  </div>
               

                
                <div
                  class="q-col col-12 col-sm-12 col-md-4"
                 
                >
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


                <div
                  class="q-col col-12 col-sm-6 col-md-4"
                 
                >
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

                <div
                  class="q-col col-12 col-sm-6 col-md-4"
                 
                >
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
                <div
                  class="q-col col-12 col-sm-6 col-md-8"
                 
                >
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
            
        
           

                <div
                  class="q-col col-12 col-sm-6 col-md-4"
                 
                >
                <q-input
                class="custom-input"
                rounded
                outlined
                dense
                stack-label
                v-model="formInput.phone_number"
                label="Phone Number"
                lazy-rules
                :rules="[rules.requiredField,rules.mobileNumber]"
                :readonly="viewing != false"
              />
                </div>
                <div
                  class="q-col col-12 col-sm-6 col-md-6"
                
                >
                <q-select
                class="custom-input-select col-5"
                outlined
                rounded
                v-model="formInput.user_type_id"
                :options="userTypeOptions"
                option-value="id"
                option-label="user_type"
                @update:model-value="selectedUserType(props)"
                dense
                map-options
                emit-value
                label="User Type"
           
                :rules="[rules.requiredField]"
                :readonly="viewing != false"
              />
                </div>
                <div
                  class="q-col col-12 col-sm-6 col-md-6"
                  v-if="formInput.user_type_id !== adminUserId.value.id && formInput.user_type_id"
                >
                <q-select
                class="custom-input-select col-5"
                outlined
                rounded
                v-model="formInput.roles"
                :options="rolesOptions"
               
                dense
              
                label="Roles"
                multiple       
                clearable
                :readonly="viewing != false"
              />
                </div>
                <div
                  class="q-col col-12 col-sm-6 col-md-6"
                  v-if="formInput.user_type_id !== adminUserId.value.id && formInput.user_type_id"
                >
                <q-select
                class="custom-input-select col-5"
                outlined
                rounded
                v-model="formInput.business_id"
                :options="businessOptions"
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
                
                
           
              </div>
            </div>

            <div class="row justify-end">
              <q-btn
                label="Clear"
                type="reset"
               
                flat
                
                
              />
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
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-table
      title="Clients Management"
      class="my-sticky-column-table"
      :rows="tablerows"
      :columns="columns"
      row-key="id"
      v-model:selected="selected"
      dense
      :separator="separator"
      :filter="filter"
      :loading="loading"
      :pagination="{ rowsPerPage: 15 }"
      :rows-per-page-options="[10, 15, 50]"
    >
    <template v-slot:body-cell-roles="props">
    <q-td :props="props" >
       
      <div v-for="role in props.value" :key="role">
        {{ role }}
      </div>
        
      </q-td>
      </template>
    
    <template v-slot:body-cell-user_type="props">
    <q-td :props="props">
        <b>
          {{ props.value }}
        </b>
      </q-td>
      </template>

      <template v-slot:body-cell-business_name="props">
    <q-td :props="props">
        <b>
          {{ props.value }}
        </b>
      </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
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
import { ref } from "vue";
import { exportFile, useQuasar, copyToClipboard } from "quasar";
import { auth } from "../../stores/auth";
import api from "./API";

const store = auth();
const $q = useQuasar();
const mode = ref(null);
const addTransaction = ref(true);

const rejecting = ref(false);
const approving = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const selected = ref([]);
const viewing = ref(false);


const passwordConfirm = ref('');
const isPwd = ref(true);
const isPwdConfirm = ref(true);
const separator = ref("vertical");
const rows = [];
const tablerows = ref([]);
const loading = ref(false);
const filter = ref("");
const formProfile = ref(false);
const usertype = ref(store.user.usertype);
const businessId = null;
const businessOptions = ref([]);
const generatedPassword = ref("");
const userTypeOptions = ref([]);
const adminUserId = ref()
const rolesOptions =['MODIFY_CLIENT','MODIFY_PREREG','APPROVE_PREREG','VIEW_ACCOUNTS','VIEW_TRANSACTIONS','VOID_TRANSACTIONS']


const rules = ref({
  requiredField: (v) => !!v || "Required field.",
  requiredSelection: (v) =>
    (!!v && v.length > 0) || "Required at least one selection",
  matchPassword: (v) =>
    v === formInput.value.password || "Does not match new password.",
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

const generatePassword = () => {
  let CharacterSet = "";
  let password = "";
  let size = 8;
  CharacterSet += "abcdefghijklmnopqrstuvwxyz";
  CharacterSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  CharacterSet += "0123456789";
  CharacterSet += "![]{}()%&*$#^~@|";
  for (let i = 0; i < size; i++) {
    password += CharacterSet.charAt(
      Math.floor(Math.random() * CharacterSet.length)
    );
  }
  return password;
};
const formInput = ref({});

const columns = [
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
    field: "Email",
    field: (row) => row.email,
    name: "Email",
    sortable: true,
  },
  {
    align: "left",
    label: "Address",
    field: "Address",
    field: (row) => row.address,
    name: "Address",
    sortable: true,
  },
  {
    align: "left",
    label: "phone_number",
    field: "phone_number",
    field: (row) => row.phone_number,
    name: "phone_number",
    sortable: true,
  },
  {
    align: "left",
    label: "User Type",
    field: "user_type",
    field: (row) => row.user_type,
    name: "user_type",
    sortable: true,
  },
  {
    align: "left",
    label: "Business",
    name: "business_name",
    field: (row) => row.business_name ? row.business_name.toUpperCase() : '',
  },

  {
    align: "left",
    label: "Roles",
    name: "roles",
    field: (row) => row.roles,
  },
  { name: "actions", label: "Action", align: "center", style: "width:0px;" },
];

const selectedUserType = (props) => {
 
  if(formInput.value.user_type_id == adminUserId.value.value.id){
    formInput.value.business_id = null;
    formInput.value.roles = null;
  }

}
const getBusinessTypes = () => {
  api
    .getBusinesses()
    .then((response) => {
      
      businessOptions.value = response.businesses;
   
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


const getUserTypes = () => {
  api
    .getUserTypes()
    .then((response) => {
      
      userTypeOptions.value = response.user_type;
      adminUserId.value = ref(userTypeOptions.value.find((user) => user.user_type === "Admin"));

    
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
const loadData = () => {
  loading.value = true;
  api
    .viewAllUsers(businessId)
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
      tablerows.value = response;
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
getUserTypes();
getBusinessTypes();
loadData();






const AddRecord = () => {
  isPwd.value = true;
  generatedPassword.value = generatePassword();
  formProfile.value = true;
  addTransaction.value = true;
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
      val.row.email +
    
      "?",
    cancel: true,
  }).onOk(() => {
    deleting.value = true;
    api
      .deleteUser(val.row)
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


  if (addTransaction.value) {
    submitting.value = true;
    api
      .createUser(formInput.value)
      .then((response) => {
        console.log(response);
        if (response.data?.error || response.data?.message) {
          $q.notify({
            color: "negative",
            position: "top",
            message:
              JSON.stringify(response.data?.error) ??
              JSON.stringify(response.data?.message) ??
              "Failed to Create User",
            icon: "report_problem",
          });
          submitting.value = false;
        } else {
          // Error response
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Record has been saved!",
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
          message: error.message ?? "Failed to Create User",
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
        .updateUser(formInput.value)
        .then((response) => {
          console.log(response);
          if (response.data?.error || response.data?.message) {
            $q.notify({
              color: "negative",
              position: "top",
              message:
                JSON.stringify(response.data?.error) ??
                JSON.stringify(response.data?.message) ??
                "Failed to Update User",
              icon: "report_problem",
            });
            submitting.value = false;
          } else {
            // Error response
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Record has been updated!",
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
            message: error.message ?? "Failed to Update User",
            icon: "report_problem",
          });
          submitting.value = false;
        });
    });
  }
};

const onReset = () => {
  formInput.value = {}
  loadData();
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
      rows.map((row) =>
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


const onHide = () => {
  if(viewing.value){
    formInput.value = { };

  }
  viewing.value = false;
  if (!addTransaction.value) {
    formInput.value = { };
    loadData();
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
