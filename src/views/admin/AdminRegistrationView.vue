<script setup>
import { ref } from "vue";
import axios from "axios";
import MaterialButton from '@/components/MaterialButton.vue';

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const password = ref("");
const c_password = ref("");
const successMessage = ref("");

const registerAdmin = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + '/api/auth/register', {
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

    first_name.value = "";
    last_name.value = "";
    email.value = "";
    password.value = "";
    c_password.value = "";

    successMessage.value = "Nový admin úspešne pridaný.";
  } catch (error) {
    console.error('An error occurred:', error);
    successMessage.value = "Nastala chyba pri registrácii. Skúste to znova.";
  }
};
</script>

<template>
  <section>
    <div class="container text-center d-flex justify-content-center align-content-center vh-100 ">
      <div class="row justify-content-center">
        <div class="col">
          <div class="card box-shadow-xl overflow-hidden mb-5">
            <div class="row">
              <div>
                <form class="p-3" id="contact-form" @submit.prevent="registerAdmin" role="form">
                  <div class="card-header px-4 py-sm-5 py-3">
                    <h2>Pridanie nového admina</h2>
                    <p class="lead">Vyplňte potrebné údaje</p>
                  </div>
                  <div class="card-body pt-1">
                    <div class="row">
                      <div class="mb-3 custom-input">
                        <input type="text" v-model="first_name" class="form-control" placeholder="Meno" required />
                      </div>
                      <div class="mb-3 custom-input">
                        <input type="text" v-model="last_name" class="form-control" placeholder="Priezvisko" required />
                      </div>
                      <div class="mb-3 custom-input">
                        <input type="email" v-model="email" class="form-control" placeholder="Email" required />
                      </div>
                      <div class="mb-3 custom-input">
                        <input type="password" v-model="password" class="form-control" placeholder="Heslo" required />
                      </div>
                      <div class="mb-3 custom-input">
                        <input type="password" v-model="c_password" class="form-control" placeholder="Heslo znova" required />
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
                  <div v-if="successMessage" class="alert alert-dark mt-3 text-white" role="alert">
                    {{ successMessage }}
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
<style scoped>
.custom-input .form-control {
  border: none;
  border-bottom: 1px solid #ced4da;
  border-radius: 0;
  box-shadow: none;
  transition: border-color 0.3s ease-in-out;
}

.custom-input .form-control:focus {
  border-bottom: 1px solid #495057;
  box-shadow: none;
}
</style>