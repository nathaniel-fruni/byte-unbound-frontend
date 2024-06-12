<script setup>
import logoDark from "@/assets/img/favicon.png";
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { onMounted, ref } from 'vue'

defineProps({
  socials: {
    type: Array,
    icon: String,
    link: String,
    default: () => [
      {
        icon: '<i class="fab fa-facebook text-lg opacity-8"></i>',
        link: "https://www.facebook.com/CreativeTim/"
      },
      {
        icon: '<i class="fab fa-twitter text-lg opacity-8"></i>',
        link: "https://twitter.com/creativetim"
      },
      {
        icon: '<i class="fab fa-dribbble text-lg opacity-8"></i>',
        link: "https://dribbble.com/creativetim"
      },
      {
        icon: '<i class="fab fa-github text-lg opacity-8"></i>',
        link: "https://github.com/creativetimofficial"
      },
      {
        icon: '<i class="fab fa-youtube text-lg opacity-8"></i>',
        link: "https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w"
      }
    ]
  },
});
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
  await fetchNewestConference();
});
</script>

<template>
  <footer class="footer pt-5 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4 ms-auto">
          <div>
            <RouterLink
              :to="{ name: 'home' }"
            >
              <img :src="logoDark" class="mb-3 footer-logo" alt="main_logo" />
            </RouterLink>
            <h6 class="font-weight-bolder mb-4">{{ conference.title }}</h6>
          </div>
          <div>
            <ul class="d-flex flex-row ms-n3 nav">
              <li
                class="nav-item"
                v-for="{ icon, link } of socials"
                :key="link"
              >
                <a
                  class="nav-link pe-1"
                  :href="link"
                  target="_blank"
                  v-html="icon"
                >
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-md-3 col-sm-6 col-6 mb-4">
          <h6 class="text-sm">registrácia</h6>
          <ul class="flex-column ms-n3 nav">
            <li class="nav-item">
              <RouterLink
                :to="{ name: 'contact' }"
                class="nav-link d-flex cursor-pointer align-items-center"
              >
                <span>registrácia</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="col-md-3 col-sm-6 col-6 mb-4">
          <h6 class="text-sm">konferencia</h6>
          <ul class="flex-column ms-n3 nav">
            <li class="nav-item">
              <RouterLink
                :to="{ name: 'program' }"
                class="nav-link d-flex cursor-pointer align-items-center"
              >
                <span>program</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                :to="{ name: 'speakers' }"
                class="nav-link d-flex cursor-pointer align-items-center"
              >
                <span>speakers</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                :to="{ name: 'gallery' }"
                class="nav-link d-flex cursor-pointer align-items-center"
              >
                <span>galéria</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="col-md-3 col-sm-6 col-6 mb-4">
          <h6 class="text-sm">info</h6>
          <ul class="flex-column ms-n3 nav">
            <li class="nav-item" v-if="conference.address">
              <span class="nav-link">
                {{ conference.address.building + " " + conference.address.street + " " + conference.address.number + ", " + conference.address.city}}
              </span>
            </li>
            <li class="nav-item">
              <span class="nav-link">
                info@byteunbound.sk
              </span>
            </li>
            <li class="nav-item">
              <RouterLink
                :to="{ name: 'contact' }"
                class="nav-link d-flex cursor-pointer align-items-center"
              >
                <span>kontakt</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="col-12">
          <div class="text-center">
            <p class="text-dark my-4 text-sm font-weight-normal">
              All rights reserved. Copyright ©
              {{ new Date().getFullYear() }}
              Material Kit by
              <a href="https://www.creative-tim.com" target="_blank"
              >Creative Tim</a
              >.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
