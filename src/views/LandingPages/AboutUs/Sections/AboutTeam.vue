<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import HorizontalTeamCard from "@/examples/cards/teamCards/HorizontalTeamCard.vue";

const speakers = ref([]);
const showModal = ref(false);
const modalContent = ref('');
const modalTitle = ref('');

const getSpeakerImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/speakers/${imageName}`;
};

const openModal = (speakerDetails) => {
  modalTitle.value = `${speakerDetails.firstName} ${speakerDetails.lastName}`;
  modalContent.value = speakerDetails.description;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_ENDPOINT + '/api/get-speakers');
    speakers.value = response.data;
  } catch (error) {
    console.error("Error fetching speaker data:", error);
  }
});

watch(showModal, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <section class="pb-5 position-relative bg-gradient-dark custom-rounded ">
    <div class="container">
      <div class="row">
        <div
            v-for="(speaker, index) in speakers"
            :key="index"
            class="col-lg-6 col-12"
        >
          <HorizontalTeamCard
              class="mt-4"
              :image="getSpeakerImageUrl(speaker.picture)"
              :profile="{ name: speaker.first_name + ' ' + speaker.last_name, link: speaker.linkedin }"
              :position="{ label: speaker.partner.name, color: 'success' }"
              :short_description="speaker.short_description"
              :long_description="speaker.long_description"
              @show-modal="openModal"
              @close-modal="closeModal"
          />
        </div>
      </div>
    </div>
  </section>

  <div v-if="showModal" class="modal fade show d-flex align-items-center justify-content-center" style="display: block;" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitle }}</h5>
          <button type="button" class="close white" @click="closeModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p v-html="modalContent"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn bg-gradient-dark" @click="closeModal">Zavrieť</button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" @click="closeModal"></div>
  </div>
</template>
<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.1);
}
.custom-rounded {
  border-radius: 20px;
}
</style>
