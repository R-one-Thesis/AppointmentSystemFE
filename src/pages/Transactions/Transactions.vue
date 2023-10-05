<template>
    <div class="q-pa-md">
      <q-btn label="Create Pre Registration (+)" @click="AddRecord" class="q-mt-md q-mb-md bg-button1 text-white" />
      <q-dialog v-model="formProfile" persistent transition-show="flip-down" >
        <q-card style="width: 800px; max-width: 80vw;">
          <q-toolbar>
            <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar> -->
            <q-toolbar-title><span class="text-weight-bold">Pre Registration</span></q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
  
          <q-card-section >
              <q-form
                @submit="onSubmit"
                @reset="onReset"
                class="q-gutter-sd"
              >
  
              <div class="q-gutter-md row">
                <q-input
                  filled
                  dense            
                  v-model="profileInput.FirstName"
                  label="Firstname"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type your firstname']"
                />
                <q-input
                  filled
                  dense            
                  v-model="profileInput.MiddleName"
                  label="Middlename"
                />
                <q-input
                  filled
                  dense            
                  v-model="profileInput.SurName"
                  label="Surname"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type your surname']"
                />
              </div>
  
                <q-input
                    dense            
                    v-model="profileInput.HomeAddress"
                    label="Address"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type your address']"
                  />
  
                <div class="q-gutter-md row">
                  <q-select v-model="profileInput.Sex" :options="sexOptions" label="Sex" dense style="width: 200px"/>
                  <q-select bottom-slots v-model="profileInput.CivilStatus" :options="civilStatusOptions" label="Civil Status" dense style="width: 250px"/>
                </div>
  
                <div class="q-gutter-md row">
                    <q-input
                      outlined
                      dense            
                      v-model="profileInput.SSSno"
                      label="SSS No."
                    />
                    <q-input
                      outlined
                      dense            
                      v-model="profileInput.TIN"
                      label="TIN No."
                    />
                    <q-input
                      outlined
                      dense            
                      v-model="profileInput.HDMF"
                      label="PagIbig No."
                    />
                    <q-input
                      outlined
                      dense            
                      v-model="profileInput.PhilHealth"
                      label="PhilHealth No."
                    />
                </div>
  
                <div class="q-gutter-md row">
                  <q-input dense v-model="profileInput.BDate" label="Birthdate" mask="date" :rules="['date']">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="profileInput.BDate">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
  
                  <q-input dense v-model="profileInput.Date_Hired" label="Hired Date" mask="date" :rules="['date']">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="profileInput.Date_Hired">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
  
                  <q-input dense v-model="profileInput.LicExpiry" label="License Exp. Date" mask="date" :rules="['date']">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="profileInput.LicExpiry">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
  
                <div class="q-gutter-md row">
                    <q-input
                      dense            
                      v-model="profileInput.HourlyRate"
                      label="Hourly Rate"
                    />
                    <q-input
                      dense            
                      v-model="profileInput.DailyRate"
                      label="Daily Rate"
                    />
                    <q-input
                      dense            
                      v-model="profileInput.MonthRate"
                      label="Monthly Rate"
                    />
                </div>
  
                <div class="q-gutter-md row">
                    <q-input
                      dense            
                      v-model="profileInput.ITWCat"
                      label="ITWCat"
                    />
                    <q-input
                      dense            
                      v-model="profileInput.AcctNo"
                      label="Account No."
                    />
                    <q-input
                      dense            
                      v-model="profileInput.LicNo"
                      label="License No."
                    />
                </div>
  
                
  
              <div class="row justify-end">
                  <q-btn label="Clear" type="reset" color="primary" flat class="q-ml-sm" />
                  <q-btn :loading="submitting" label="Save" type="submit" color="primary"
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
        title="Pre Registration Management"
        class="my-sticky-column-table"
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
      import { ref } from 'vue'
      import { exportFile, useQuasar } from 'quasar'

      import api from "./API";

  
      const $q = useQuasar()
      const mode = ref(null)
      const addTransaction = ref(true)
      const submitting = ref(false)
      const selected = ref([])
      const separator = ref('vertical')
      const rows = []
      const tablerows = ref([])
      const loading = ref(false)
      const filter = ref('')
      const formProfile = ref(false)


      console.log(process.env.VUE_APP_API_URL)

      api.test();
      const profileInput = ref(
        {
          Id: null,
          SurName:null,
          FirstName:null,
          MiddleName:null,
          Date_Hired:null,
          HomeAddress:null,
          Sex:null,
          CivilStatus:null,
          SSSno:null,
          TIN:null,
          HDMF:null,
          PhilHealth:null,
          HourlyRate:null,
          DailyRate:null,
          MonthRate:null,
          ITWCat:null,
          ResnDate:null,
          AcctNo:null,
          LicNo:null,
          LicExpiry:null,
          BDate:null
        }
      )
  
      const sexOptions = ['Male','Female']
  
      const civilStatusOptions = ['Single','Married','Divorced','Separated','Widowed']
  
      const columns = [
        {
          name: 'Id',
          required: true,
          label: 'EmpId',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        { align: 'left', label: 'FirstName', field: 'FirstName', field: row => row.first_name, name: 'FirstName', sortable: true },
        { align: 'left', label: 'MiddleName', field: 'MiddleName', field: row => row.last_name, name: 'MiddleName', sortable: true },
        { align: 'left', label: 'SurName', field: 'SurName',field: row => row.last_name, name: 'SurName', sortable: true },
        { name: 'actions', label: 'Action', align:"center", style: 'width:0px;' }
      ]
  
      const loadData = () => {
        loading.value = true
        api.test()
        .then((response) => {
          console.log(response);
          tablerows.value = response;
          loading.value = false
        })
        .catch(() => {
          loading.value = false;
          $q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
          loading.value = false
        });
        } 
        loadData()
  
      const AddRecord = () => {
     
        formProfile.value = true
        addTransaction.value = true
      }
  
      const EditRecord = (val) => {
        profileInput.value = val.row
        formProfile.value = true
        addTransaction.value = false
      }
  
      const DeleteRecord = (val) => {
        $q.dialog({
          title: 'Delete Record',
          message: 'Are you sure you want to delete, profile: ' + val.row.FirstName + ' ' + val.row.MiddleName + '?',
          cancel: true
        }).onOk(() => {
         
        })
      }
  
      const onSubmit  = (val) => {
          // add
          if (addTransaction.value)
          {
           
          }
          else
          {
            $q.dialog({
              title: 'Edit Record',
              message: 'Are you sure you want to edit?',
              cancel: true
            }).onOk(() => {
                api.test('profiles/'+profileInput.value.Id, profileInput.value)
                .then((response) => {
                  loadData();
                  onReset();
                  $q.notify({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: 'Record has been saved!'
                  })
                  submitting.value = false;
                  formProfile.value = false;
                })
                .catch(() => {
                  $q.notify({
                    color: 'negative',
                    position: 'top',
                    message: 'editing failed',
                    icon: 'report_problem'
                  })
                })
            })
          }
      }
  
      const onReset  = () => {
        for(let pI in profileInput.value)
          profileInput.value[pI] = null
          loadData()
      }
  
      function wrapCsvValue (val, formatFn, row) {
        let formatted = formatFn !== void 0
          ? formatFn(val, row)
          : val
  
        formatted = formatted === void 0 || formatted === null
          ? ''
          : String(formatted)
  
        formatted = formatted.split('"').join('""')
        /**
         * Excel accepts \n and \r in strings, but some other CSV parsers do not
         * Uncomment the next two lines to escape new lines
         */
        // .split('\n').join('\\n')
        // .split('\r').join('\\r')
  
        return `"${formatted}"`
      }
      
  
      const exportTable = () => {
        // naive encoding to csv format
        const content = [columns.map(col => wrapCsvValue(col.label))].concat(
          rows.map(row => columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[ col.field === void 0 ? col.name : col.field ],
            col.format,
            row
          )).join(','))
        ).join('\r\n')
  
        const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        )
  
        if (status !== true) {
          $q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
      }
  
  </script>
  
  
  <style lang="scss">
  .my-sticky-column-table
    thead tr:last-child th:last-child{
        background-color: #fff;
    }
     
  
    td:last-child{
        background-color: #fff;
    }
     
  
    th:last-child,
    td:last-child{
        position: sticky;
        right: 0;
         z-index: 1;
    }
     
  </style>