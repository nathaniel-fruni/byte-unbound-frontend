<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import MaterialButton from "@/components/MaterialButton.vue";
import DefaultNavbar from '@/views/public/components/NavbarDefault.vue';

const email = ref("");
const password = ref("");
const incorrectLogin = ref(false);

const router = useRouter();

const signIn = async () => {
  try {
    await axios.get(import.meta.env.VITE_API_ENDPOINT + '/sanctum/csrf-cookie');
    const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + '/api/auth/login', {
      email: email.value,
      password: password.value
    });
    incorrectLogin.value = false;

    const accessToken = response.data.accessToken;
    document.cookie = `access_token=${accessToken};path=/;`;
    router.push('/admin');
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.error('Validation error:', error.response.data);
    } else {
      console.error('An error occurred:', error);
      incorrectLogin.value = true;
    }
  }
};
</script>
<template>
  <div>

    <div class="container position-sticky z-index-sticky top-0">
      <div class="row">
        <div class="col-12">
          <DefaultNavbar :sticky="true" />
        </div>
      </div>
    </div>

    <header class="bg-gradient-dark">
      <div class="page-header align-items-start min-vh-100" :style="{ backgroundImage: 'url(/src/assets/img/backgrounds/main-background.jpg)' }">
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container my-auto">
          <div class="row">
            <div class="col-lg-4 col-md-8 col-12 mx-auto">
              <div class="card z-index-0 fadeIn3 fadeInBottom">
                <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div class="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                    <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">Prihlásenie</h4>
                  </div>
                </div>
                <div class="card-body">
                  <form @submit.prevent="signIn" role="form" class="text-start">
                    <input id="email" v-model="email" class="input-group-outline rounded-2 col-12 p-2 px-2 mb-3 text-sm" placeholder="Email" type="email" required />
                    <input id="password" v-model="password" class="input-group-outline rounded-2 col-12 p-2 px-2 text-sm" placeholder="Heslo" type="password" required />
                    <div class="text-center">
                      <MaterialButton class="my-4 mb-2" variant="gradient" color="dark" fullWidth>Prihlásiť sa</MaterialButton>
                    </div>
                  </form>
                </div>
                <div v-if="incorrectLogin" class="text-center text-danger">
                  <p>Nesprávne prihlasovacie údaje.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>




