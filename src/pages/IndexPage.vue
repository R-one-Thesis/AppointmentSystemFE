<template>
  <q-page class="q-pa-md">
    <q-dialog
      v-model="receiptShow"
      persistent
      transition-show="flip-down"
      style="width: auto; max-width: 80vw"
    >
      <q-card>
        <q-toolbar>
          <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar> -->


          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup

          />
        </q-toolbar>


          <Receipt
          :receiptDetails="receiptDetails"
            />

      </q-card>
    </q-dialog>
    <q-dialog
      v-model="choiceForm"
      persistent
      transition-show="flip-down"
      @hide="onHide"
      style="width: 650px; max-width: 80vw"
    >
      <q-card>
        <q-toolbar>
          <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar> -->
          <q-toolbar-title
            ><span class="text-weight-bold"
              >Choose Transaction</span
            ></q-toolbar-title
          >
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup

          />
        </q-toolbar>

        <q-card-section>
          <div class="q-col col-12 col-sm-12 col-md-6">
            <div class="q-col col-12 col-sm-12 col-md-12">
              <q-label
                >Balance:
                <strong>{{ scanDetails.current_balance }}P</strong></q-label
              >
            </div>
            <div class="q-col col-12 col-sm-12 col-md-6">
              <q-label
                >Name: <strong>{{ scanDetails.name }}</strong></q-label
              >
            </div>
            <div class="q-col col-12 col-sm-12 col-md-6">
              <div class="q-col col-12 col-sm-6 col-md-6">
                <q-label
                  >Business:
                  <strong>{{ scanDetails.business_name }}</strong></q-label
                >
              </div>
              <div class="q-col col-12 col-sm-6 col-md-6">
                <q-label
                  >Type: <strong>{{ scanDetails.card_type }}</strong></q-label
                >
              </div>
            </div>
          </div>
          <q-btn
            label="REWARD"
            @click="topUpForm = true"
            class="q-mt-md q-mb-md bg-button1 text-white q-mr-xs"
            style="min-width: 130px"
          />
          <q-btn
            label="CLAIM"
            @click="claimForm = true"
            class="q-mt-md q-mb-md bg-button1 text-white q-mr-xs"
            style="min-width: 130px"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="topUpForm"
      persistent
      transition-show="flip-down"
      @hide="topUpHide"
    >
      <q-card style="width: 650px; max-width: 80vw">
        <q-toolbar>
          <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar> -->
          <q-toolbar-title
            ><span class="text-weight-bold"
              >Top Up: {{ scanDetails.name }}</span
            ></q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-form @submit="topUp" @reset="topUpHide" class="q-gutter-sd">
            <div class="q-gutter-md q-col-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="q-col col-12 col-sm-6 col-md-6">
                  <q-label
                    >Balance:
                    <strong>{{ scanDetails.current_balance }}P</strong></q-label
                  >
                </div>
                <div class="q-col col-12 col-sm-6 col-md-6">
                  <q-label
                    >Equivalent Points:
                    <strong>{{
                      formInputTopUp.amount
                        ? formInputTopUp.amount * scanDetails.point_multiplier
                        : 0.0
                    }}</strong></q-label
                  >
                </div>
                <div class="q-col col-12 col-sm-6 col-md-6">
                  <q-input
                    class="custom-input"
                    rounded
                    outlined
                    dense
                    stack-label
                    v-model="formInputTopUp.receipt_number"
                    label="Receipt No"
                    lazy-rules
                    :rules="[rules.requiredField]"
                  />
                </div>

                <div class="q-col col-12 col-sm-6 col-md-6">
                  <q-input
                    class="custom-input"
                    rounded
                    outlined
                    dense
                    v-model="formInputTopUp.amount"
                    label="Amount"
                    :rules="[rules.requiredField, rules.moneyValue]"
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
                  class="drawerActive"
                  type="submit"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </div>
              <div></div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="claimForm"
      persistent
      transition-show="flip-down"
      @hide="topUpHide"
    >
      <q-card style="width: 650px; max-width: 80vw">
        <q-toolbar>
          <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar> -->
          <q-toolbar-title
            ><span class="text-weight-bold"
              >Claim: {{ scanDetails.name }}</span
            ></q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-form @submit="claim" @reset="onReset" class="q-gutter-sd">
            <div class="q-gutter-md q-col-gutter-md">

              <div class="row q-col-gutter-md">
                <div class="q-col col-12 col-sm-12 col-md-12">
                  <q-label
                    >Balance:
                    <strong>{{ scanDetails.current_balance }}P </strong>(1
                    Point/s is equivalent to 1 PHP when claiming)</q-label
                  >
                </div>
                <div class="q-col col-12 col-sm-12 col-md-6">
                  <q-input
                    class="custom-input"
                    rounded
                    outlined
                    dense
                    stack-label
                    v-model="formInputTopUp.receipt_number"
                    label="Receipt No"
                    lazy-rules
                  />
                </div>

                <div class="q-col col-12 col-sm-6 col-md-6">
                  <q-input
                    class="custom-input"
                    rounded
                    outlined
                    dense
                    v-model="formInputTopUp.amount"
                    label="Amount"
                    :rules="[rules.requiredField, rules.moneyValue]"
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
                  class="drawerActive"
                  type="submit"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </div>
              <div></div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="qrMode"
      persistent
      transition-show="flip-down"
      class="qr-dialog"
    >
      <q-card style="width: 360px; height: 450px">
        <div class="qr-background">
          <div class="qr-square"></div>
        </div>
        <q-toolbar style="position: absolute; background: none; z-index: 1">
          <!-- <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
            </q-avatar> -->

          <q-btn flat round dense icon="close" v-close-popup />
          <span
            style="
              text-align: center;
              font-weight: bold;
              width: 100%;
              margin-left: -35px;
              font-size: 20px;
            "
            >{{ qrModeTitle }}</span
          >
        </q-toolbar>
        <div class="stream">
          <qr-stream
            @camera-on="onReady"
            key="qr-component"
            @decode="onDecode"
            class="mb"
          >
            <div style="color: red" class="frame"></div>
          </qr-stream>
        </div>
      </q-card>
    </q-dialog>
    <div v-if="store.roles.includes('CASHIER')">
      <q-btn
        label="SCAN QR CODE"
        @click="startQR"
        class="q-mt-md q-mb-md bg-button1 text-white q-mr-xs"
      />
    </div>

    <div class="card-container" v-if="store.roles.includes('ADMIN')">
      <q-card v-for="card in cards" :key="card.id" class="card">
        <q-card-section class="title">
          <i class="fas fa-users"></i>
          <h4>{{ card.title }}</h4>
        </q-card-section>
        <q-card-section class="card-content">
          <p>{{ card.count }}</p>
        </q-card-section>
        <q-card-section class="card-details">
          <a v-if="card.showDetails" @click="getRedirectUrl(card.id)">
            <p>{{ card.details }}</p>
            <i class="fas fa-arrow-right arrow-icon"></i>
          </a>
        </q-card-section>
      </q-card>
    </div>
    <!-- Chart container -->
    <div class="chart-container">
      <div class="chart-title">
        <i class="fas fa-chart-bar"></i>
        <h3>New clients per month</h3>
      </div>
      <canvas ref="chartCanvas"></canvas>
      <div v-if="loadingChart" class="loading-indicator">Loading...</div>
    </div>
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <h3>{{ selectedUser.title }}</h3>
          <p>{{ selectedUser.details }}</p>
        </q-card-section>
        <q-card-actions>
          <q-btn color="primary" label="Close" @click="closeModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Chart from "chart.js/auto";
import { auth } from "../stores/auth";
import { exportFile, useQuasar } from "quasar";
import { QrcodeStream, QrStream, QrCapture, QrDropzone } from "vue3-qr-reader";
import Receipt from "components/Receipt.vue";
import { ref, onMounted } from "vue";
import api from "./commonAPI";
export default defineComponent({
  components: {
    Receipt,
    QrStream,
    QrCapture,
    QrDropzone,
  },
  setup() {
    const store = auth();
    const qrMode = ref(false);
    const decodedQR = ref("");
    const qrModeTitle = ref("");
    const submitting = ref(false);
    const $q = useQuasar();
    const scannedAccount = ref({});
    const topUpForm = ref(false);
    const claimForm = ref(false);
    const scanDetails = ref({});
    const choiceForm = ref(false);
    const formInputTopUp = ref({});
    const receiptShow= ref(false);
    const receiptDetails = ref({});
    const businessId = ref(store.user.businessId);
    const usertype = ref(store.user.usertype);
    const graphData = ref({});
    const expiringCount = ref([]);
    const chartCanvas = ref(null);
    const loadingChart = ref(false);
    const chartData = ref([0,0,0,0,0,0,0,0,0,0,0,0]);
    const startQR = () => {
      qrMode.value = true;

      decodedQR.value = "";
    };
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
      moneyValue: (v) =>
        !v ||
        /^[0-9]+(\.[0-9]{1,2})?$/.test(v) ||
        "Money value must be valid. Ex. 100 or 100.00",
    });
    const onReady = () => {
      console.log("ready");
    };
    const onDecode = (data) => {
      console.log("wew");
      if (data) {
        decodedQR.value = data;
        console.log(decodedQR);

        scanAccount(decodedQR.value);
        // qrMode.value = false;
        // qrAccountActive.value = true;
      }
    };
    const onHide = () => {};

    const topUpHide = () => {
      formInputTopUp.value = {
        business_id: scanDetails.value.business_id,
        account_number: scanDetails.value.account_number,
      };
    };
    const topUp = () => {
      $q.dialog({
        title: "Top up Reward",
        message:
          "Are you sure you want to add reward for " +
          scanDetails.value.name +
          ` worth <b>₱${formInputTopUp.value.amount} (${
            formInputTopUp.value.amount * scanDetails.value.point_multiplier
          })</b>?`,
        cancel: true,
        html: true,
      }).onOk(() => {
        submitting.value = true;
        api
          .topUp(formInputTopUp.value)
          .then((response) => {
            console.log(response);
            if (response?.error) {
              $q.notify({
                color: "negative",
                position: "top",
                message:
                  JSON.stringify(response?.error) ??
                  JSON.stringify(response?.message) ??
                  "Failed to add points",
                icon: "report_problem",
              });
              submitting.value = false;
            } else {
              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "Points successfully added",
              });
              receiptDetails.value = response
              reScanAccount(response.account_number);


            }
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              position: "top",
              message: error.message ?? "Failed to add points",
              icon: "report_problem",
            });
            submitting.value = false;
          });
      });
    };

    const getGraphDetails = () => {
      loadingChart.value = true;
    if (usertype.value.toUpperCase() == "ADMIN") {
      businessId.value = null;
    }

    api
      .getGraphDetails(businessId.value)
      .then((response) => {
        // console.log(response);
        if (response.users && response.clients) {
          // console.log(response);
          setGraphData(response.clients)
          graphData.value = response;
          // console.log(graphData.value.users);
          const userIndex = cards.value.findIndex(card => card.title === 'Users');
          const clientIndex = cards.value.findIndex(card => card.title === 'Clients');
          const expiringIndex = cards.value.findIndex(card => card.title === 'Expiring Soon!');
          // Update the count value of the object at the found index
          if (userIndex !== -1) {
            cards.value[userIndex].count = graphData.value.users.length; // Replace 'newValue' with the desired count value
          }
          if (clientIndex !== -1) {
            cards.value[clientIndex].count = graphData.value.clients.length; // Replace 'newValue' with the desired count value
          }



          const currentDate = new Date();

          // Calculate the date 11 months ago


          // Filter clients whose 'created_at' date is within the range of 11 months to 12 months ago
          expiringCount.value = graphData.value.clients.filter(client => {
            // Parse 'created_at' date string into a Date object
            const createdAtDate = new Date(client.created_at);

            // Check if 'created_at' date is within the range of 11 months to 12 months ago
            return currentDate > createdAtDate.setMonth(currentDate.getMonth() + 11) && currentDate < createdAtDate.setMonth(currentDate.getMonth() + 12);
          });


          if (expiringIndex !== -1) {
            cards.value[expiringIndex].count = expiringCount.value.length; // Replace 'newValue' with the desired count value
          }
        }

        renderChart()
        loadingChart.value = false;

      })
      .catch((e) => {
        console.log(e)
        $q.notify({
          color: "negative",
          position: "top",
          message: "Loading failed",
          icon: "report_problem",
        });
      });
  };
  getGraphDetails();

  const setGraphData = (clients) => {
    const currentYear = new Date().getFullYear();
    clients.forEach(client => {
    const createdAtDate = new Date(client.created_at);
    const createdAtYear = createdAtDate.getFullYear();
    const createdAtMonth = createdAtDate.getMonth();

    // Check if the client was created in the current year
    if (createdAtYear === currentYear) {
      // Increment the value at the corresponding index in chartData
      chartData.value[createdAtMonth] += 1;
    }
  });



  }

    const claim = () => {
      $q.dialog({
        title: "Top up Reward",
        message:
          "Are you sure you want to claim reward for " +
          scanDetails.value.name +
          ` worth <b>₱${formInputTopUp.value.amount}</b>?`,
        cancel: true,
        html: true,
      }).onOk(() => {
        submitting.value = true;
        api
          .claim(formInputTopUp.value)
          .then((response) => {
            console.log(response);
            if (response?.error) {
              $q.notify({
                color: "negative",
                position: "top",
                message:
                  JSON.stringify(response?.error) ??
                  JSON.stringify(response?.message) ??
                  "Failed to claim points",
                icon: "report_problem",
              });
              submitting.value = false;
            } else {
              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "Points successfully claimed",
              });
              receiptDetails.value = response
              reScanAccount(response.account_number);

            }
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              position: "top",
              message: error.message ?? "Failed to claim points",
              icon: "report_problem",
            });
            submitting.value = false;
          });
      });
    };

    const scanAccount = (code) => {
      api
        .scanAccount(code)
        .then((response) => {
          console.log(response);
          if (response.data?.error || response.data?.message) {
            $q.notify({
              color: "negative",
              position: "top",
              message:
                JSON.stringify(response.data?.error) ??
                JSON.stringify(response.data?.message) ??
                "Failed to Fetch Account",
              icon: "report_problem",
            });
            decodedQR.value = "";
          } else {
            scanDetails.value = response;
            formInputTopUp.value = scanDetails.value;
            choiceForm.value = true;
            qrMode.value = false;
            // if(qrModeTitle.value == "TOP UP"){
            //   topUpForm.value = true;

            // }
            // else if(qrModeTitle.value == "CLAIM"){

            // }
            // else if(qrModeTitle.value == "BALANCE INQUIRY"){

            // }
            // Error response
            // $q.notify({
            //   color: "green-4",
            //   textColor: "white",
            //   icon: "cloud_done",
            //   message: "Points successfully ad",
            // });
          }
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: error.message ?? "Failed to Fetch Account",
            icon: "report_problem",
          });
          decodedQR.value = "";
        });
    };

    const reScanAccount = (code) => {
      api
        .reScanAccount(code)
        .then((response) => {
          console.log(response);
          if (response.data?.error || response.data?.message) {
            $q.notify({
              color: "negative",
              position: "top",
              message:
                JSON.stringify(response.data?.error) ??
                JSON.stringify(response.data?.message) ??
                "Failed to Fetch Account",
              icon: "report_problem",
            });
            decodedQR.value = "";
          } else {
            scanDetails.value = response;
            submitting.value = false;
            topUpForm.value = false;
            claimForm.value = false;
            receiptShow.value = true;
            // if(qrModeTitle.value == "TOP UP"){
            //   topUpForm.value = true;

            // }
            // else if(qrModeTitle.value == "CLAIM"){

            // }
            // else if(qrModeTitle.value == "BALANCE INQUIRY"){

            // }
            // Error response
            // $q.notify({
            //   color: "green-4",
            //   textColor: "white",
            //   icon: "cloud_done",
            //   message: "Points successfully ad",
            // });
          }
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: error.message ?? "Failed to Fetch Account",
            icon: "report_problem",
          });
          decodedQR.value = "";
        });


    };
    const cards = ref([
      {
        id: 1,
        title: "Expiring Soon!",
        count: 0,
        details: "View Details",
        showDetails: true,
      },
      {
        id: 2,
        title: "New Clients",
        count: 0,
        details: "View Details",
        showDetails: true,
      },
      {
        id: 3,
        title: "Users",
        count: 0,
        details: "View Details",
        showDetails: true,
      },
      {
        id: 4,
        title: "Clients",
        count: 0,
        details: "View Details",
        showDetails: true,
      },
    ]);
    const renderChart = () => {
      if (chartCanvas.value) {
        const ctx = chartCanvas.value.getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "New Clients",
                data: chartData.value,
                backgroundColor: "#F1DEC9",
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          },

          plugins: {
            legend: {
              display: false,
            },
          },
          layout: {
            padding: {
              left: 5,
              right: 5,
            },
          },
          elements: {
            bar: {
              borderWidth: 1,
              borderRadius: 5,
              barThickness: 5,
              maxBarThickness: 10,
              barPercentage: 0.6,
            },
          },
        });
      }
    };
    onMounted(() => {
      // renderChart()
    });


    return {
      store,
      qrMode,
      startQR,
      decodedQR,
      onDecode,
      qrModeTitle,
      onReady,
      scannedAccount,
      topUpForm,
      submitting,
      scanDetails,
      rules,
      onHide,
      topUp,
      choiceForm,
      topUpHide,
      formInputTopUp,
      claimForm,
      claim,
      receiptShow,
      graphData,
      receiptDetails,
      cards,
      chartData,
      chartCanvas,
      loadingChart
    };
  },
  name: "IndexPage",
  // data() {
  //   return {
  //     cards: [
  //       {
  //         id: 1,
  //         title: "Expiring Soon!",
  //         count: 100,
  //         details: "View Details",
  //         showDetails: true,
  //       },
  //       {
  //         id: 2,
  //         title: "New Clients",
  //         count: 50,
  //         details: "View Details",
  //         showDetails: true,
  //       },
  //       {
  //         id: 3,
  //         title: "Users",
  //         count: this.graphData?.length,
  //         details: "View Details",
  //         showDetails: true,
  //       },
  //       {
  //         id: 4,
  //         title: "Clients",
  //         count: this.graphData.clients,
  //         details: "View Details",
  //         showDetails: true,
  //       },
  //     ],
  //     showModal: false,
  //     selectedUser: {},
  //   };
  // },
  mounted() {
    // Render the chart
    // this.renderChart();
  },
  methods: {
    openModal(cardId) {
      this.selectedUser = this.cards.find((card) => card.id === cardId);
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    // renderChart() {
    //   const ctx = this.$refs.chartCanvas.getContext("2d");
    //   new Chart(ctx, {
    //     type: "bar", // Use 'bar' for bar graph
    //     data: {
    //       labels: [
    //         "Jan",
    //         "Feb",
    //         "Mar",
    //         "Apr",
    //         "May",
    //         "Jun",
    //         "Jul",
    //         "Aug",
    //         "Sep",
    //         "Oct",
    //         "Nov",
    //         "Dec",
    //       ], // Replace with your actual months
    //       datasets: [
    //         {
    //           label: "New Clients",
    //           data: this.chartData, // Replace with your actual data
    //           backgroundColor: "#F1DEC9", // Bar color
    //         },
    //       ],
    //     },
    //     options: {
    //       scales: {
    //         y: {
    //           beginAtZero: true,
    //         },
    //       },
    //     },
    //     plugins: {
    //       legend: {
    //         display: false,
    //       },
    //     },
    //     layout: {
    //       padding: {
    //         left: 5,
    //         right: 5,
    //       },
    //     },
    //     elements: {
    //       bar: {
    //         borderWidth: 1,
    //         borderRadius: 5,
    //         barThickness: 5, // Adjust the bar thickness here
    //         maxBarThickness: 10,
    //         barPercentage: 0.6, // Adjust the relative thickness of the bars
    //       },
    //     },
    //   });
    // },
    getRedirectUrl(cardId) {
      switch (cardId) {
        case 1:
          return "";
        case 2:
          this.$router.push({ name: 'Pre Registration' });
          break
        case 3:
          this.$router.push({ name: 'Users' });
          break
        case 4:
          this.$router.push({ name: 'Clients' });
          break
        default:
          return "#";
      }
    },
  },
});
</script>

<style scoped>
.qr-square {
}
.stream {
  width: 360px;
  height: 450px;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  font-style: normal;
}

.card {
  flex-basis: calc(20% - 20px);
  margin-bottom: 20px;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 15px 0 !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.card:nth-child(1) .title:before {
  content: "";
  height: 25px;
  position: absolute;
  left: 0;
  width: 7px;
  background: #8d7b68;
}

.card:nth-child(2) .title:before {
  content: "";
  height: 25px;
  position: absolute;
  left: 0;
  width: 7px;
  background: #b9fea1;
}

.card:nth-child(3) .title:before {
  content: "";
  height: 25px;
  position: absolute;
  left: 0;
  width: 7px;
  background: #f1dec9;
}

.card:nth-child(4) .title:before {
  content: "";
  height: 25px;
  position: absolute;
  left: 0;
  width: 7px;
  background: #a5adf6;
}

.title h4,
.title i {
  margin: 0 !important;
  font-size: 16px;
}

.card-content p {
  font-size: 40px;
  font-weight: 400;
  margin: 0;
}

.card-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-decoration: none;
  cursor: pointer;
}

.card-details a {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-details p,
.arrow-icon {
  margin: 0;
  color: #6cc1f0;
  font-size: 14px;
}

.chart-container {
  width: 100%;
  max-width: 1000px; /* You can adjust the max width as needed */
  margin-top: 20px;
  padding: 20px;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  position: relative;
}

.chart-container h3,
.chart-container i {
  font-size: 16px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.chart-container:before {
  content: "";
  height: 25px;
  position: absolute;
  left: 0;
  top: 50px;
  width: 7px;
  background: #b9fea1;
}

@media (max-width: 1260px) {
  .card {
    flex-basis: calc(45% - 20px) !important;
  }
}

@media (max-width: 480px) {
  .card {
    flex-basis: calc(100% - 20px) !important;
  }
}
.loading-indicator {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}
</style>
