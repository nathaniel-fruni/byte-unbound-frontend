<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import MaterialButton from '@/components/MaterialButton.vue'

const testimonials = ref([]);
const currentIndex = ref(0);

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

const nextTestimonial = () => {
  currentIndex.value = (currentIndex.value + 1) % testimonials.value.length;
};

const prevTestimonial = () => {
  currentIndex.value = (currentIndex.value - 1 + testimonials.value.length) % testimonials.value.length;
};

onMounted(async () => {
  await fetchTestimonials();

  setInterval(() => {
    nextTestimonial();
  }, 3000);
});

const displayStyle = (index) => {
  return index === currentIndex.value ? 'block' : 'none';
};
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
      <div class="row mt-6 d-flex flex-column-reverse flex-md-row align-items-center">
        <div class="col-md-auto d-flex align-items-center justify-content-center mb-4 mb-md-0">
          <MaterialButton color="dark" variant="gradient" @click="prevTestimonial" class="btn mx-2">
            <i class="fas fa-arrow-left"></i>
          </MaterialButton>
        </div>
        <div class="col">
          <div class="row">
            <div class="col-lg-12 col-md-6 mb-4" v-for="(testimonial, index) in testimonials" :key="index" :style="{ display: displayStyle(index) }">
              <div class="card bg-gradient-dark card-plain" style="height: 100%;">
                <div class="card-body d-flex flex-column justify-content-between">
                  <img v-if="testimonial.image" :src="getTestimonalImageUrl(testimonial.image)" :alt="testimonial.name" class="avatar avatar-lg border-radius-lg shadow mt-n5" style="object-fit: cover; max-height: 200px;" />
                  <div class="author">
                    <div class="name">
                      <h6 class="mb-0 font-weight-bolder text-white">{{ testimonial.name }}</h6>
                    </div>
                  </div>
                  <p class="mt-4 text-white">{{ testimonial.testimonal_text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-auto d-flex align-items-center justify-content-center mb-4 mb-md-0">
          <MaterialButton color="dark" variant="gradient" @click="nextTestimonial" class="btn mx-2">
            <i class="fas fa-arrow-right"></i>
          </MaterialButton>
        </div>
      </div>
    </div>
  </section>
</template>
