<template>
  <div
    class="q-px-none q-py-md text-bold"
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
      gap: 10px;
    "
  >
    <!-- <q-item-label> {{ userProfile.business_name ?? userProfile.first_name }} </q-item-label> -->

    <q-btn class="text-color1" round>
      <q-avatar size="40px">
        <q-icon name="account_circle" />
      </q-avatar>
      <q-menu>
        <q-list bordered>
          <q-item v-ripple>
            <q-item-section avatar>
              <q-avatar
                color="teal"
                text-color="white"
                icon="account_circle"
              ></q-avatar>
            </q-item-section>

            <q-item-section>
              <!-- <q-item-label> {{ userProfile.first_name }}</q-item-label>
              <q-item-label caption lines="1">
                {{ userProfile.email }}</q-item-label
              > -->
            </q-item-section>
          </q-item>
          <q-separator></q-separator>

          <!--
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white" icon="settings"></q-avatar>
        </q-item-section>

        <q-item-section>Settings</q-item-section>
      </q-item>
      -->

          <q-item :loading="loggingOut" clickable v-ripple v-close-popup @click="logout()">
            <q-item-section avatar>
              <q-avatar
                rounded
                color="purple"
                text-color="white"
                icon="logout"
              ></q-avatar>
            </q-item-section>

            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { exportFile, useQuasar } from "quasar";

import { auth } from "../stores/auth";
import { useRouter } from "vue-router";
import { api } from "../boot/axios"; // Import the 'api' instance instead of 'axios'

const authInstance = auth();
const $q = useQuasar();
const router = useRouter();
// const userProfile = ref({});
// const userId = ref(authInstance.authUser.id);
// const userDetails = ref(authInstance.authUser);
const loggingOut = ref(false);

// const getUserDetails = async () => {
//   if (userId) {
//     // Fetch user details from local storage using the user ID
//     const userDetails = await api.get("api/users/" + userId.value);
//     // console.log(userDetails);
//     if (userDetails.status == "200") {
//       userProfile.value = userDetails.data.user;
//     } else {
//       $q.notify({
//         color: "negative",
//         position: "top",
//         message: "System encountered an error",
//         icon: "report_problem",
//       });

//       logout();
//     }
//   }
// };
// getUserDetails();

const logout = () => {
  
  loggingOut.value = true;
  api
    .get("api/logout")
    .then((response) => {
      
      authInstance.token = null;
      authInstance.authUser = null;
      authInstance.roles = null;
      localStorage.clear()
      window.location.reload();
      // console.log(response)
      
      loggingOut.value = false;
     
      
    })
    .catch((error) => {
      // console.log(error)
      $q.notify({
        color: "negative",
        position: "top",
        message: error.message ?? "Encountered an error while logging out",
        icon: "report_problem",
      });
      authInstance.token = null;
      authInstance.authUser = null;
      authInstance.roles = null;
      localStorage.clear()
      window.location.reload();
      loggingOut.value = false;
      
    });

    
};
</script>
