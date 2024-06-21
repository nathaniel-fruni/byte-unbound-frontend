<script setup>
import { onMounted, onUnmounted } from "vue";
import DefaultNavbar from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";
import RegistrationForm from "./sections/RegistrationForm.vue";
import bg0 from "@/assets/img/backgrounds/section-background.jpg";

const body = document.getElementsByTagName("body")[0];

onMounted(async () => {
  body.classList.add("bg-gray-200");
});

onUnmounted(() => {
  body.classList.remove("bg-gray-200");
});
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
    <div
        class="page-header min-vh-75"
        :style="{ backgroundImage: `url(${bg0})` }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center mx-auto my-auto">
            <h1 class="text-white">
              Registrácia <span class="text-white"></span>
            </h1>
            <p class="lead mb-4 text-white opacity-8">
              Registrujte sa na prednášky a získajte nové vedomosti!
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6 m-t6">
    <RegistrationForm />
  </div>
  <DefaultFooter />
  </div>
</template>
