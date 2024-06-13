<script setup>
import { ref } from "vue";
import axios from "axios";
import MaterialButton from '@/components/MaterialButton.vue';

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const password = ref("");
const c_password = ref("");

const registerAdmin = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + '/api/auth/register',  {
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      password: password.value,
      c_password: c_password.value
    },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    console.log(response.data);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
</script>
<template>
  <section>
    <div class="container text-center d-flex justify-content-center align-content-center vh-100">
      <div class="row justify-content-center">
        <div class="col">
          <div class="card box-shadow-xl overflow-hidden mb-5 col-12">
            <div class="row">
              <div>
                <form class="p-3" id="contact-form" @submit.prevent="registerAdmin" role="form">
                  <div class="card-header px-4 py-sm-5 py-3">
                    <h2>Pridanie nového admina</h2>
                    <p class="lead">Vyplňte potrebné údaje</p>
                  </div>
                  <div class="card-body pt-1">
                    <div class="row">
                      <div class="col-md-12 pe-2 mb-3">
                        <input
                          id="first_name"
                          v-model="first_name"
                          class="input-group-outline rounded-2 col-12 p-2 px-2 text-sm"
                          placeholder="Meno"
                          type="text"
                          is-required="true"
                        />
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <input
                          id="last_name"
                          v-model="last_name"
                          class="input-group-outline rounded-2 col-12 p-2 px-2 text-sm"
                          placeholder="Priezvisko"
                          type="text"
                          is-required="true"
                        />
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <input
                          id="email"
                          v-model="email"
                          class="input-group-outline rounded-2 col-12 p-2 px-2 text-sm"
                          placeholder="Email"
                          type="email"
                          is-required="true"
                        />
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <input
                          id="password"
                          v-model="password"
                          class="input-group-outline rounded-2 col-12 p-2 px-2 text-sm"
                          placeholder="Heslo"
                          type="password"
                          is-required="true"
                        />
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <input
                          id="c_password"
                          v-model="c_password"
                          class="input-group-outline rounded-2 col-12 p-2 px-2 text-sm"
                          placeholder="Heslo"
                          type="password"
                          is-required="true"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6 text-end ms-auto">
                        <MaterialButton
                          variant="gradient"
                          color="dark"
                          type="submit"
                          class="mb-0"
                        >Pridať</MaterialButton
                        >
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>