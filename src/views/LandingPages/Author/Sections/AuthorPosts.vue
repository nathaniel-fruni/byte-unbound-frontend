<script setup>
import TransparentBlogCard from "../../../../examples/cards/blogCards/TransparentBlogCard.vue";
import post1 from "@/assets/img/examples/testimonial-6-2.jpg";
import post2 from "@/assets/img/examples/testimonial-6-3.jpg";
import { onMounted, ref } from 'vue'
import axios from 'axios'

const organizers = ref([]);
const getOrganizerImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/organizers/${imageName}`;
};

const fetchOrganizers = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-organizers"
    );
    organizers.value = response.data;
  } catch (error) {
    console.error("Error fetching organizer data:", error);
  }
};

onMounted(async () => {
  await fetchOrganizers();
});
</script>
<template>
  <section class="py-3 mt-4">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h3 class="mb-5">Kontakt</h3>
        </div>
      </div>
      <div class="row">
        <div v-for="organizer in organizers" :key="organizer.id" class="col-lg-6 col-sm-3">
          <TransparentBlogCard
            :image="getOrganizerImageUrl(organizer.image)"
            :name="`${organizer.first_name} ${organizer.last_name}`"
            :phone="organizer.phone"
            :email="organizer.email"
          />
        </div>
      </div>
    </div>
  </section>
</template>

