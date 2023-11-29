import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import axios from 'axios'; // Don't forget to import axios

export const auth = defineStore('user', {
  state: () => ({
    authUser: null,
    token: null,
    roles: null,
    admin_id: null,
    patient_id: null,
    darkMode: false,
  }),
  persist: {
    storage: sessionStorage,
    paths: ['user'],
  },
  getters: {
    user: (state) => state.authUser,
  },
  actions: {
    getCSRFToken() {
      // Implement this function based on your server's CSRF token handling
      // For example, if the CSRF token is stored in a cookie, you might do something like this:
      const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
      if (csrfCookie) {
        return csrfCookie.split('=')[1];
      } else {
        // Handle the case where the CSRF token is not found
        console.error('CSRF token not found');
        return null;
      }
    },

    async login(userDetails) {
      try {
        const csrfToken = this.getCSRFToken(); // Use this.getCSRFToken to reference the method

        // Set the CSRF token in the request headers
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        // Your login request
        const response = await api.post('api/login', userDetails);
        console.log(response.data);

        if (response.data.user_type == 'patient') {
          this.patient_id = response.data.patient_id;
        }
        if (response.data.admin_id) {
          this.admin_id = response.data.admin_id;
          console.log(response.data.admin_id);
        }
        if (response.data.user_name) {
          this.authUser = {
            userName: response.data.user_name,
            usertype: response.data.user_type,
          };

          if (response.data.user_type) {
            this.roles = [];
            this.roles.push(response.data.user_type.toUpperCase());
          }

          this.token = response.data.token;
        }

        return response.data;
      } catch (error) {
        console.log(error);
        return error.response;
      }
    },

    async setUser(userDetails) {
      console.log(userDetails);
      if (userDetails) {
        this.authUser = userDetails;
      }
    },
  },
  persist: true,
});
