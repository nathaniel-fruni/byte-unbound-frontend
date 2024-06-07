<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const testimonials = ref([]);

const getTestimonalImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/testimonals/${imageName}`;
};

const fetchTestimonials = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-testimonals"
    );
    testimonials.value = response.data;
  } catch (error) {
    console.error("Error fetching testimonal data:", error);
  }
};

onMounted(async () => {
  await fetchTestimonials();
});
</script>

<template>
  <section class="py-7">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 mx-auto text-center">
          <h2 class="mb-3">
            Povedali o nás
          </h2>
          <p class="lead">
            Prečítajte si, čo účastníci našej konferencie hovoria o ich nezabudnuteľných zážitkoch a prínosoch z účasti.
          </p>
        </div>
      </div>
      <div class="row mt-6">
        <template v-for="(testimonial, index) in testimonials" :key="index">
          <div class="col-lg-4 col-md-6 mb-4">
            <div :class="`card bg-gradient-dark card-plain'}`" style="height: 100%;">
              <div class="card-body d-flex flex-column justify-content-between">
                <img
                  v-if="testimonial.image"
                  :src="getTestimonalImageUrl(testimonial.image)"
                  :alt="testimonial.name"
                  class="avatar avatar-lg border-radius-lg shadow mt-n5"
                  style="object-fit: cover; max-height: 200px;"
                />
                <div class="author">
                  <div class="name">
                    <h6
                      class="mb-0 font-weight-bolder text-white"
                    >
                      {{ testimonial.name }}
                    </h6>
                  </div>
                </div>
                <p class="mt-4 text-white">
                  {{ testimonial.testimonal_text }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
