<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import MetricCard from '@/views/admin/components/MetricCard.vue';
import AttendeesTable from '@/views/admin/sections/AttendeesTable.vue';
import CreateSponsor from '@/views/admin/sections/CreateSponsor.vue';

const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

const fetchMetric = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return {};
  }
};

const registrationsMetric = ref({});
const sponsorMetric = ref({});
const stageMetric = ref({});
const talkMetric = ref({});

onMounted(async () => {
  registrationsMetric.value = await fetchMetric(import.meta.env.VITE_API_ENDPOINT + '/api/get-registrationsMetric');
  sponsorMetric.value = await fetchMetric(import.meta.env.VITE_API_ENDPOINT + '/api/get-sponsorsMetric');
  stageMetric.value = await fetchMetric(import.meta.env.VITE_API_ENDPOINT + '/api/get-stagesMetric');
  talkMetric.value = await fetchMetric(import.meta.env.VITE_API_ENDPOINT + '/api/get-talksMetric');
});
</script>

<template>
  <div class="d-flex justify-content-center container-fluid">
    <MetricCard
      title="Počet účastníkov"
      :metricValue="registrationsMetric.current_year_unique_users"
      :percentageDifference="registrationsMetric.percentage_difference"
      iconClass="fas fa-users"
      avatarClass="bg-gradient-dark"
    />
    <MetricCard
      title="Počet sponzorov"
      :metricValue="sponsorMetric.current_year_unique_sponsors"
      :percentageDifference="sponsorMetric.percentage_difference"
      iconClass="fas fa-handshake"
      avatarClass="bg-gradient-primary"
    />
    <MetricCard
      title="Počet stage-ov"
      :metricValue="stageMetric.current_year_unique_stages"
      :percentageDifference="stageMetric.percentage_difference"
      iconClass="fas fa-tv"
      avatarClass="bg-gradient-success"
    />
    <MetricCard
      title="Počet prednášok"
      :metricValue="talkMetric.current_year_talks"
      :percentageDifference="talkMetric.percentage_difference"
      iconClass="fas fa-chalkboard"
      avatarClass="bg-gradient-info"
    />
  </div>

  <div class="d-lg-flex d-sm-block">
    <div class="col-lg-8 col-md-12 mb-4">
      <h3 class="text-center"><i class="fas fa-users me-2"></i>Zoznam účatníkov</h3>
      <AttendeesTable />
    </div>
    <div class="col-lg-4 col-md-12 mb-4">
      <h3 class="text-center"><i class="fas fa-handshake me-2"></i>Sponzori</h3>
      <CreateSponsor />
    </div>
  </div>
</template>
