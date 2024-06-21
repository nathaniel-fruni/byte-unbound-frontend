<script setup>
import Stages from '@/views/admin/sections/Stages.vue'
import TimeSlots from '@/views/admin/sections/TimeSlots.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'

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
<template class="">
  <div class="col-lg-12 bg-gradient-dark rounded-3 p-2 px-2 shadow-blur mb-3 text-center">
    <h3 class="text-white"><i class="fas fa-tv me-2"></i>Stage a časové okná</h3>
  </div>

  <div class="card card-body shadow-xl mx-3 mx-md-4 p-4 d-flex justify-content-center align-content-center">
    <h4 class="text-center mb-3">{{ conference.title }}</h4>

    <div class="d-lg-flex d-sm-block">
      <div class="col-lg-8 col-md-12 mb-4">
        <TimeSlots />
      </div>
      <div class="col-lg-4 col-md-12 mb-4">
        <Stages />
      </div>
    </div>
  </div>
</template>