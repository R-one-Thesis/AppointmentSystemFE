import { defineStore } from 'pinia'
import { api } from "../boot/axios";
export const auth = defineStore('user', {
  state: () => ({
    authUser: null,
    token: null,
    roles: null,
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
  

    // async getToken(){
    //     await api.get("/sanctum/csrf-cookie");

    // },
    async login(userDetails){
        
        try {
            const data = await api.post("api/login", userDetails)
            console.log(data.data)

            if(data.data.user){

                this.authUser = 
                {id: data.data.user.id,
                 usertype: data.data.user.user_type, 
                 userTypeId: data.data.user.user_type_id, 
                 businessName : data.data.user.business_name,
                 businessId: data.data.user.business_id
               
                };
                if(data.data.user.roles){
                  this.roles = data.data.user.roles.map((role) => role.toUpperCase());
                  this.roles.push(data.data.user.user_type.toUpperCase())

                }
                else{
                  this.roles = [data.data.user.user_type.toUpperCase()]

                } 
                this.token = data.data.token;
                
               
            }
            // this.authUser = data.data;
            return data.data;
        } catch (error) {
            console.log(error)
            return error.response;
        }
        
    },
   
    async setUser(userDetails){
        console.log(userDetails)
        if (userDetails){

            this.authUser = userDetails;
            
        }

    },
    


    


  },
  persist: true,
})
