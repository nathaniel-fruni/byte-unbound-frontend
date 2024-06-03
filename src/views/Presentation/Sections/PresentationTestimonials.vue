<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import DefaultReviewCard from "@/examples/cards/reviewCards/DefaultReviewCard.vue";

const testimonials = ref([]);

const getTestimonalImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/testimonals/${imageName}`;
};

onMounted(async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_ENDPOINT +'/api/get-testimonals');
    testimonials.value = response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
  }
});
</script>

<template>
  <section class="py-7">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 mx-auto text-center">
          <h2 class="text-gradient text-success mb-3">
            Povedali o nás
          </h2>
          <p class="lead">
            Prečítajte si, čo účastníci našej konferencie hovoria o ich nezabudnuteľných zážitkoch a prínosoch z účasti.
          </p>
        </div>
      </div>
      <div class="row mt-6">
        <template v-for="(testimonial, index) in testimonials" :key="index">
          <DefaultReviewCard
            :image="getTestimonalImageUrl(testimonial.image)"
            :name="testimonial.name"
            :review="testimonial.testimonal_text"
            color="bg-gradient-dark"
          />
        </template>
      </div>
    </div>
  </section>
</template>
