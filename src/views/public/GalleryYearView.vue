<template>
  <div>
    <DefaultNavbar transparent />
    <header class="bg-gradient-dark">
      <div class="page-header min-vh-75" :style="{ backgroundImage: `url(${bg0})` }">
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center mx-auto my-auto">
              <h1 class="text-white">
                Galéria <span class="text-white"></span>
              </h1>
              <p class="lead mb-4 text-white opacity-8">
                Pozrite si fotografie z roku 2022
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item" :class="{ active: true }">
                <div class="row justify-content-center">
                  <div class="col-md-12">
                    <div class="image-container"> <!-- Container div added -->
                      <img :src="currentImage.url" :alt="currentImage.name" class="d-block w-100 gallery-image">
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
        </div>
      </div>
    </div>
    <DefaultFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import DefaultNavbar from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";
import bg0 from "@/assets/img/backgrounds/section-background.jpg";

const images = [
  {
    url: "https://via.placeholder.com/100",
    name: "Image 1"
  },
  {
    url: "https://via.placeholder.com/200",
    name: "Image 2"
  },
  {
    url: "https://via.placeholder.com/300",
    name: "Image 3"
  },
  {
    url: "https://via.placeholder.com/400",
    name: "Image 4"
  },
  // Add more images as needed
];

const currentImageIndex = ref(0);

const currentImage = computed(() => images[currentImageIndex.value]);

const prevSlide = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length;
};

const nextSlide = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
};

onMounted(() => {
  // Add your logic to change the background color on component mount
  document.body.classList.add("bg-gray-200");
});

onUnmounted(() => {
  // Add your logic to revert the background color on component unmount
  document.body.classList.remove("bg-gray-200");
});
</script>

<style scoped>
.gallery-image {
  max-width: 100%;
  height: auto;
}

.image-container {
  border: 1px solid #343a40; /* Add border to create a container around the image */
  border-radius: 5px; /* Optional: Add border radius for slightly rounded corners */
  padding: 10px; /* Optional: Add padding inside the container */
  background-color: #333; /* Set background color to grey */
}
</style>
