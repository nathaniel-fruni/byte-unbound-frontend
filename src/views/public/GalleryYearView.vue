<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import DefaultNavbar from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";
import bg0 from "@/assets/img/backgrounds/section-background.jpg";
import axios from "axios";
import { useRoute } from 'vue-router';

const body = document.getElementsByTagName("body")[0];
const images = ref([]);
const route = useRoute();
const selectedYear = ref(route.params.year);
const galleries = ref([]);

const fetchGalleries = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-galleries`);
    galleries.value = response.data;

    buildYearToGalleryIdMap();

    fetchImages();
  } catch (error) {
    console.error("Error fetching galleries data:", error);
  }
};

const fetchImages = async () => {
  try {
    const galleryId = getGalleryId(selectedYear.value);
    if (!galleryId) {
      console.error(`Gallery for year ${selectedYear.value} not found.`);
      return;
    }

    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-gallery-images-byGalleryId/${galleryId}`);
    images.value = response.data;
  } catch (error) {
    console.error("Error fetching images data:", error);
  }
};

const getImageUrl = (imageName) => {
  return `${import.meta.env.VITE_API_ENDPOINT}/storage/images/gallery/${imageName}`;
};

const buildYearToGalleryIdMap = () => {
  galleries.value.forEach(gallery => {
    yearToGalleryIdMap.value[gallery.name] = gallery.id;
  });
};

const yearToGalleryIdMap = ref({});

const getGalleryId = (year) => {
  return yearToGalleryIdMap.value[year];
};

const currentImageIndex = ref(0);

const prevSlide = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length;
};

const nextSlide = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
};

onMounted(() => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  fetchGalleries();
});

onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
});


watch(selectedYear, () => {
  fetchImages();
});
</script>

<template>
  <div>
    <div class="container position-sticky z-index-sticky top-0">
      <div class="row">
        <div class="col-12">

          <DefaultNavbar :sticky="true" />
        </div>
      </div>
    </div>

    <header class="bg-gradient-dark">
      <div class="page-header min-vh-75" :style="{ backgroundImage: `url(${bg0})` }">
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center mx-auto my-auto">
              <h1 class="text-white">
                Galéria <span class="text-white">{{ selectedYear }}</span>
              </h1>
              <p class="lead mb-4 text-white opacity-8">
                Pozrite si fotografie z roku {{ selectedYear }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div v-if="images.length > 0" id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div v-for="(image, index) in images" :key="image.id" :class="{ 'carousel-item': true, 'active': index === currentImageIndex }">
                <div class="row justify-content-center">
                  <div class="col-md-12">
                    <div class="image-container">
                      <img :src="getImageUrl(image.image)" :alt="image.image" class="d-block w-100 gallery-image">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" @click="prevSlide">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" @click="nextSlide">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <div v-else class="text-center mt-5">
            <h3>Už čoskoro!</h3>
            <p class="lead">Zatiaľ nie sú zverejnené fotografie z roku {{ selectedYear }}.</p>
          </div>
        </div>
      </div>
    </div>
    <DefaultFooter />
  </div>
</template>



<style scoped>
.gallery-image {
  max-width: 100%;
  height: auto;
}

.image-container {
  border-radius: 8px;
  padding: 10px;
  background-color: #333;
}
</style>
