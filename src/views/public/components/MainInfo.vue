<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const conference = ref(null);
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

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  const formattedDate = new Intl.DateTimeFormat('sk-SK').format(date).replace(/\-/g, '.');
  const formattedTime = date.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
  return { formattedDate, formattedTime };
};
</script>


<template>
  <section class="pt-3" id="count-stats">
    <div class="container" v-if="conference">
      <div class="row">
        <div class="col-lg-9 z-index-2 border-radius-xl mx-auto py-3">
          <div class="row align-items-center">
            <div class="col-md-4 position-relative">
              <div class="text-center">
                <h4 class="d-flex align-items-center justify-content-center">
                  <i class="fas fa-door-open me-2 align-middle"></i>
                  <span class="align-middle">{{ formatDateTime(conference.start_date).formattedTime }}</span>
                </h4>
              </div>
            </div>
            <div class="col-md-4 position-relative">
              <div class="text-center">
                <h1 class="text-gradient text-dark">
                  {{ conference.location.location }}
                </h1>
                <h4>
                  {{ formatDateTime(conference.start_date).formattedDate }}
                </h4>
              </div>
            </div>
            <div class="col-md-4 position-relative">
              <div class="text-center">
                <h4 class="d-flex align-items-center justify-content-center">
                  <i class="fas fa-door-closed me-2 align-middle"></i>
                  <span class="align-middle">{{ formatDateTime(conference.end_date).formattedTime }}</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <p>Loading...</p>
    </div>
  </section>
</template>



