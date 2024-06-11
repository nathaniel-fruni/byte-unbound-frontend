<template>
  <div>
    <DefaultNavbar transparent />
    <header class="bg-gradient-dark">
      <div class="page-header min-vh-75" :style="{ backgroundImage: `url(${bg0})` }">
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center mx-auto my-auto">
              <h1 class="text-white">Galéria</h1>
              <p class="lead mb-4 text-white opacity-8">Pozrite si fotografie z predošlých ročníkov konferencie</p>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6 m-t6">
      <div v-for="gallery in galleries" :key="gallery.id" class="card card-plain">
        <div class="card-header p-0 position-relative bg-gradient-success">
          <RouterLink :to="'/gallery/' + gallery.id">
            <div class="card-header p-0 position-relative bg-gradient-success">
              {{ gallery.name }}
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
    <DefaultFooter/>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DefaultNavbar from "./NavbarDefault.vue";
import DefaultFooter from "./FooterDefault.vue";
import bg0 from "@/assets/img/backgrounds/section-background.jpg";
import axios from "axios";
import { RouterLink } from "vue-router";

const body = document.getElementsByTagName("body")[0];
const galleries = ref([]);

onMounted(async () => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-galleries`);
    galleries.value = response.data;
  } catch (error) {
    console.error("Error fetching gallery data:", error);
  }
});

onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
});
</script>
