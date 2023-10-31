<template>
    <div class="login-container justify-center column items-center">
        <q-card class="q-ma-xl form-card">
            <div class="row custom-container">
                <!-- <div class="col bg-primary rounded-left-borders md-hide xs-hide sm-hide">
                    <div class="row full-width full-height flex flex-center">
                    </div>
                </div> -->
                <div class="col">
                    <div class="row q-pa-sm justify-center" style="min-height: 60vh;  ">
                        <div class="col-8 login-image">
                            <q-card-section class="full-height flex column justify-center q-p-lg">
                                <div class="flex column items-center justify-center q-mb-lg">
                                    <div class="text-h4 text-uppercase q-my-none text-weight-bold text-primary q-mb-sm text-center">
                                        Dental Clinic Online Appointment System</div>
                                    <p class="mt-4">Please login in using your account</p>
                                </div>
                                <q-form class="q-gutter-md">
                                    <q-input rounded outlined v-model="userInput.email" dense
                                    :rules="[rules.requiredField]" class="full-width custom-input"
                                        label="Email Address" autocomplete name="username" />
                                    <q-input class="custom-input full-width" :readonly="viewing != false" rounded
                                        outlined stack-label dense label="Password" v-model="userInput.password" name="password"
                                        :type="isPwd ? 'password' : 'text'" :rules="[rules.requiredField]">
                                        <template v-slot:append>
                                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                                                class="cursor-pointer" @click="isPwd = !isPwd"></q-icon>
                                        </template>
                                    </q-input>
                                    <q-btn class="full-width no-caps q-pa-sm custom-btn" color="primary" label="Sign in" rounded
                                        @click="login" :loading="loading"></q-btn>
                                    <div class="text-center row justify-between">
                                        <a href="/">Back to home</a>
                                        <a href="#/Register">Dont have account?</a>
                                    </div>
                                </q-form>
                            </q-card-section>
                        </div>
                    </div>
                </div>
            </div>
        </q-card>
    </div>
</template>
<style scoped>
    .login-container {
        height: 100vh;
        /* margin: 0 20px; */
    }
    .form-card {
        width: 40vw;
        margin: 0 auto;
    }

    @media screen and (max-width:768px) {
        .form-card {
            width: 100%;
        }

        .login-container {
            height: 100vh;
            padding: 0 20px;
        }
    }
</style>
<script setup>
    import {
        ref
    } from "vue";
    import {
        exportFile,
        useQuasar
    } from "quasar";
    import {
        auth
    } from "../../stores/auth";
    import {
        useRouter
    } from 'vue-router'
    import api from "./API";
    const $q = useQuasar()
    const router = useRouter()
    const authInstance = auth();
    const userInput = ref({});
    const loading = ref(false);
    const isPwd = ref(true);
    const viewing = ref(false);

    const rules = ref({
        requiredField: (v) => !!v || "Required field.",
        
     
      
    });
    const login = async () => {
        console.log(userInput.value)
        try {
            loading.value = true
            const result = await authInstance.login(userInput.value);
            if (result.status < 200 || result.status >= 300) {

                $q.notify({
                    color: "negative",
                    position: "top",
                    message: result.data?.message ?? "Authentication failed",
                    icon: "report_problem",
                });
                loading.value = false
            } else {
                loading.value = false
                window.location.reload();
            }
        } catch (error) {
            $q.notify({
                color: "negative",
                position: "top",
                message: "System encountered an error",
                icon: "report_problem",
            });
            console.log(error)
            loading.value = false

        }

    }
</script>
