<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  partners: {
    type: Array,
    default: () => []
  }
});

const getPartnerImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/partners/${imageName}`;
};
</script>

<template>
  <section class="pt-4" id="count-stats">
    <div class="container">
      <div class="row mb-7">
        <div
            v-for="partner in partners"
            :key="partner.id"
            class="col-lg-2 col-md-4 col-6 mb-4"
        >
          <a :href="partner.website" target="_blank" rel="noopener noreferrer">
            <img
                class="w-100 opacity-7"
                :src="getPartnerImageUrl(partner.logo)"
                :alt="partner.name"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
