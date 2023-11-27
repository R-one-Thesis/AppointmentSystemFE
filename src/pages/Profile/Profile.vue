<!-- Profile.vue -->
<template>
    <div class="container q-pa-md q-col-gutter-md">
      <div class="patient-details" v-if="patientDetails">
        <div class="card">
          <h5>Patient Details</h5>
          <p><b>Fullname:</b> {{ patientDetails.fullname }}</p>
          <p><b>Birthday:</b> {{ patientDetails.birthday }}</p>
          <p><b>Sex:</b> {{ patientDetails.sex }}</p>
          <p><b>Home Address:</b> {{ patientDetails.homeAddress }}</p>
          <p><b>Mobile Number:</b> {{ patientDetails.mobileNumber }}</p>
        </div>
        <div class="medical-record">
          <h5>Medical Record</h5>
          <div class="medical-details">
            <p><b>Physician:</b> {{ patientDetails.physician }}</p>
            <p><b>Physician Address:</b> {{ patientDetails.physicianAddress }}</p>
            <p><b>Reason:</b> {{ patientDetails.reason }}</p>
            <p><b>Hospitalization:</b> {{ patientDetails.hospitalization }}</p>
            <p><b>Conditions:</b> {{ patientDetails.conditions }}</p>
            <p><b>Medication:</b> {{ patientDetails.medication }}</p>
            <p><b>Allergies:</b> {{ patientDetails.allergies }}</p>
            <p><b>Pregnant?:</b> {{ patientDetails.pregnant }}</p>
            <p><b>Expected Date:</b> {{ patientDetails.expectedDate }}</p>
            <p><b>Mens Problems:</b> {{ patientDetails.mensProblems }}</p>
          </div>
        </div>
        <!-- <div class="booking-record">
          <h5>Booking History</h5>
          <div class="booking-details">
            <p>Doctor: {{ patientDetails.doctor }}</p>
            <p>Services: {{ patientDetails.services }}</p>
            <p>Date: {{ patientDetails.date }}</p>
            <p>Time: {{ patientDetails.time }}</p>
            <p>Duration: {{ patientDetails.duration }}</p>
          </div>
        </div> -->
      </div>
      <div v-else>
        <p>No patient details available.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import { auth } from "../../stores/auth";
  import api from "./API";
  const authInstance = auth();
  const $q = useQuasar();
  
  const loading = ref(false);
  const patientDetails = ref(null);
  
  const loadData = async () => {
    loading.value = true;
  
    try {
      const response = await api.viewProfile();
      
      if (response === "401") {
        $q.notify({
          color: "negative",
          position: "top",
          message: "Unauthenticated",
          icon: "report_problem",
        });
        loading.value = false;
        return;
      }
  
    //   const loggedInUserId = auth.patient_id;
      
        const loggedInUserId = authInstance.patient_id;
        console.log(loggedInUserId);
  
        const user = response.data.find((userData) => userData.id === loggedInUserId);
        console.log(user);
  
      if (user) {
        patientDetails.value = {
          fullname: `${user.first_name} ${user.last_name}`,
          birthday: user.birthday,
          sex: user.sex,
          homeAddress: user.home_address,
          mobileNumber: user.mobile_number,
          physician: user.physician,
          physicianAddress: user.physician_address,
          reason: user.reason,
          hospitalization: user.hospitalization,
          conditions: user.conditions,
          medication: user.medication,
          allergies: user.allergies,
          pregnant: user.pregnant,
          expectedDate: user.expected_date,
          mensProblems: user.mens_problems,
          doctor: user.doctor,
          services: user.services,
          date: user.booking_date,
          time: user.booking_time,
          duration: user.booking_duration,
        };
      }
  
      loading.value = false;
    } catch (error) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Loading failed",
        icon: "report_problem",
      });
      loading.value = false;
    }
  };
  
  onMounted(loadData);
  </script>
  
  
<style scoped>
.card {
    width: 400px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
    display: flex;
    padding: 15px;
    flex-direction: column;
}

.medical-record, .booking-record {
    margin-top: 20px;
    width: auto;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    padding: 15px;
    
}

.medical-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.card h5, .medical-record h5 {
    margin: 0 0 15px 0;
}
.card p, .medical-record p, .booking-record p {
    margin-bottom: 10px;
}
</style>