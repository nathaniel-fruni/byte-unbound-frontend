<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stages = ref([]);
const rowsByStage = ref({});
const selectedTalkDescription = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-timeSlots"
    );
    const timeSlots = response.data;
    timeSlots.forEach(slot => {
      if (!rowsByStage.value[slot.stage.name]) {
        rowsByStage.value[slot.stage.name] = [];
        stages.value.push(slot.stage.name);
      }
      rowsByStage.value[slot.stage.name].push(slot);
    });
    if (stages.value.length > 0) {
      activeStage.value = stages.value[0];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const activeStage = ref(null);

function toggleStage(stage) {
  if (activeStage.value === stage) {
    activeStage.value = null;
    selectedTalkDescription.value = null;
  } else {
    activeStage.value = stage;
  }
}

function formatTime(dateTime) {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return new Date(dateTime).toLocaleTimeString([], options);
}

function selectTalkDescription(description) {
  selectedTalkDescription.value = selectedTalkDescription.value === description ? null : description;
}
</script>
<template>
  <section class="pt-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <div class="card bg-gradient-dark">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                <th class="col-lg-2 text-white">Stage</th>
                <th class="col-lg-2 text-white">Čas</th>
                <th class="col-lg-8 text-white">Prednáška</th>
                </thead>
                <tbody>
                <template v-for="stage in stages" :key="stage">
                  <tr @click="toggleStage(stage)" style="cursor: pointer;">
                    <td class="text-white">{{ stage }}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <template v-if="activeStage === stage">
                    <tr v-for="row in rowsByStage[stage]" :key="row.id" @click="selectTalkDescription(row.talk.description)">
                      <td></td>
                      <td class="text-white">{{ formatTime(row.start_time) }} - {{ formatTime(row.end_time) }}</td>
                      <td class="text-white">
                        <div>
                          <p class="text-bold">{{ row.talk.title }} <i class="fas fa-terminal mx-2"></i></p>
                          <div v-if="selectedTalkDescription === row.talk.description" class="text-wrap mb-2">
                            <p class="text-white">{{ selectedTalkDescription }}</p>
                            <p class="text-white">Speaker: <span class="text-secondary mx-2">{{ row.talk.speaker.first_name + ' ' + row.talk.speaker.last_name }}</span> {{ row.talk.speaker.partner.name }}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
