<script setup>
import { onMounted, onUnmounted } from "vue";
import DefaultNavbar from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";
import bg0 from "@/assets/img/backgrounds/section-background.jpg";

import Program from '@/views/public/sections/Program.vue'

const body = document.getElementsByTagName("body")[0];

onMounted(async () => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");
});

onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
});
</script>

<template>
  <DefaultNavbar transparent />
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
              Program <span class="text-white"></span>
            </h1>
            <p class="lead mb-4 text-white opacity-8">
              Oboznámte sa s programom konferencie
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6 m-t6">
    <Program class="mb-4" />
  </div>
  <DefaultFooter />
</template>
