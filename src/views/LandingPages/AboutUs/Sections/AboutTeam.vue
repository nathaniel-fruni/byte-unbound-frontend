<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import HorizontalTeamCard from "@/examples/cards/teamCards/HorizontalTeamCard.vue";

const speakers = ref([]);

const getSpeakerImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/speakers/${imageName}`;
};

onMounted(async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + '/api/get-speakers'
    );
    speakers.value = response.data;
  } catch (error) {
    console.error("Error fetching speaker data:", error);
  }
});
</script>

<template>
  <section class="pb-5 position-relative bg-gradient-dark mx-n3">
    <div class="container">
      <div class="row">
        <div class="col-md-8 text-start mb-5 mt-5">
          <h3 class="text-white z-index-1 position-relative">
            Speakers
          </h3>
        </div>
      </div>
      <div class="row">
        <div
          v-for="(speaker, index) in speakers"
          :key="index"
          class="col-lg-6 col-12"
        >
          <HorizontalTeamCard
            class="mt-4"
            :image="getSpeakerImageUrl(speaker.picture)"
            :profile="{
              name: speaker.first_name + ' ' + speaker.last_name,
              link: speaker.linkedin,
            }"
            :position="{ label: speaker.partner.name, color: 'success' }"
            :short_description="speaker.short_description"
          />
        </div>
      </div>
    </div>
  </section>
</template>
