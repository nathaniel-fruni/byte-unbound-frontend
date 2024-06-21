<script setup>
import { onMounted, onUnmounted, ref} from 'vue';
import { RouterLink } from 'vue-router'
import NavbarDefault from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";
import Header from "./components/Header.vue";
import MainInfo from "./components/MainInfo.vue";
import PresentationTestimonials from "./sections/PresentationTestimonials.vue";
import vueMkHeader from "@/assets/img/backgrounds/main-background.jpg";
import Speakers from '@/views/public/sections/Speakers.vue';
import Program from '@/views/public/sections/Program.vue';
import Organizers from './sections/Organizers.vue';
import axios from 'axios';

const body = document.getElementsByTagName("body")[0];

const conference = ref({});
const sponsors = ref([]);

const getSponsorImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/sponsors/${imageName}`;
};

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

const fetchSponsors = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-sponsors"
    );
    sponsors.value = response.data;
  } catch (error) {
    console.error("Error fetching sponsor data:", error);
  }
};

onMounted(async () => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");

  await fetchSponsors();
  await fetchNewestConference();
});

onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});
</script>


<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>

  <Header>
    <div
      class="page-header min-vh-75"
      :style="`background-image: url(${vueMkHeader})`"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row">
          <div class="col-lg-6 text-center mx-auto position-relative">
            <h1
              class="text-white pt-3 mt-n5 me-2"
              :style="{ display: 'inline-block ' }"
            >
              {{conference.title}}
            </h1>
            <p class="lead text-white px-5 mt-3" :style="{ fontWeight: '500' }">
              {{conference.short_description}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Header>

  <div>
    <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6 mb-6">
    <MainInfo :conference="conference" />
    <div class="text-center mb-7">
      <RouterLink :to="{ name: 'program' }"><span class="m-3 col-lg-3 col-sm-12 btn btn-sm mb-0 bg-gradient-dark px-5 py-3 mt-4">Program</span></RouterLink>
      <RouterLink :to="{ name: 'speakers' }"><span class="m-3 col-lg-3 col-sm-12 btn btn-sm mb-0 bg-gradient-dark px-5 py-3 mt-4">Speakers</span></RouterLink>
      <RouterLink :to="{ name: 'registration' }"><span class="m-3 col-lg-3 col-sm-12 btn btn-sm mb-0 bg-gradient-dark px-5 py-3 mt-4">Registrácia</span></RouterLink>
    </div>

    <div>
      <section>
        <div class="container">
          <div class="row">
            <div class="col-lg-8 my-auto">
              <h3>Pár slov o konferencii</h3>
              <p class="pe-5">
                {{conference.long_description}}
              </p>
            </div>
            <div class="col-lg-4 mt-lg-0 mt-5 ps-lg-0 ps-0">
              <h6 class="mt-3">
                <i class="fas fa-terminal"></i> {{conference.info1}}
              </h6>
              <h6 class="mt-3">
                <i class="fas fa-terminal"></i> {{conference.info2}}
              </h6>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>

    <h2 class="text-center mb-7">Speakers</h2>
    <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6 m-t6">
      <Speakers />
    </div>

    <div class="card card-body blur shadow-blur mx-3 mx-md-4 mb-6 mt-5">
    <h2 class="text-center mt-3">Program</h2>
    <Program />

    <PresentationTestimonials />

    <div class="container">
      <div class="row">
        <div class="d-flex flex-column w-100 text-center pb-2">
          <h3>Naši sponzori</h3>
          <div class="d-flex justify-content-center mt-3 flex-wrap">
            <div v-for="sponsor in sponsors" :key="sponsor.id" class="col-6 col-sm-4 col-md-3 col-lg-2 mb-3 d-flex justify-content-center">
              <a :href="sponsor.website" data-bs-toggle="tooltip" data-bs-placement="bottom" :title="sponsor.name">
                <img :src="getSponsorImageUrl(sponsor.logo)" :alt="sponsor.name" class="w-100 sponsor-logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </div>
  <DefaultFooter />
</template>

<style>
.sponsor-logo {
  height: 100px;
  width: 100px;
  object-fit: contain;
}
</style>
