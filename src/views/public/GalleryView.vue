<template>
  <div>
    <DefaultNavbar transparent />
    <header class="bg-gradient-dark">
      <div class="page-header min-vh-75" :style="{ backgroundImage: `url(${bg0})` }">
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center mx-auto my-auto">
              <h1 class="text-white">
                Galéria <span class="text-white"></span>
              </h1>
              <p class="lead mb-4 text-white opacity-8">
                Pozrite si fotografie z predošlých ročníkov konferencie
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div v-for="gallery in galleries" :key="gallery.id" class="col-12 col-sm-12 col-md-12 col-lg-4 mb-3">
          <div class="card shadow-sm p-4 mb-4">
            <div class="card-body p-0">
              <!-- Use :to attribute to generate dynamic route -->
              <RouterLink :to="{ name: 'galleryYear', params: { year: gallery.name } }" class="d-block text-center">
                <span class="btn btn-lg mb-0 bg-gradient-dark w-100 py-5">
                  {{ gallery.name }}
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DefaultFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import DefaultNavbar from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";
import bg0 from "@/assets/img/backgrounds/section-background.jpg";
import axios from "axios";

const body = document.getElementsByTagName("body")[0];
const galleries = ref([]);

onMounted(async () => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + "/api/get-galleries"
    );
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

