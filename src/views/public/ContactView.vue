<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import DefaultNavbar from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";
import bg0 from "@/assets/img/backgrounds/section-background.jpg";
import Organizers from '@/views/public/sections/Organizers.vue'
import axios from 'axios'

const body = document.getElementsByTagName("body")[0];
const conference = ref({});

const fetchNewestConference = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-newestConference"
    );
    conference.value = response.data;
  } catch (error) {
    console.error("Error fetching the newest conference data:", error);
  }
};

onMounted(async () => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  await fetchNewestConference();
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
              Kontakt <span class="text-white"></span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6 m-t6">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-12 mb-4 mb-md-0 py-3 mt-4 align-content-center">
          <iframe
            class="google-map border-radius-lg"
            v-if="conference.address"
            width="100%"
            height="250"
            style="border:0"
            :src="`https://maps.google.com/maps?q=${encodeURIComponent(conference.address.building + ', ' + conference.address.street + ' ' + conference.address.number + ', ' + conference.address.postal_code + ' ' + conference.address.city)}&output=embed`"
            allowfullscreen>
          </iframe>
        </div>
        <Organizers />
      </div>
    </div>
  </div>
  <DefaultFooter />
</template>