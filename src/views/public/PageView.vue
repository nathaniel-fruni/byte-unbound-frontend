<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import bg0 from '@/assets/img/backgrounds/section-background.jpg';
import MaterialButton from '@/components/MaterialButton.vue';
import DefaultNavbar from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";

const body = document.getElementsByTagName("body")[0];
const router = useRouter();
const page = ref({});
const route = useRoute();
const selectedPageId = ref(route.params.id);

const fetchPage = async () => {
  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + `/api/get-page/${selectedPageId.value}`
  );
    page.value = response.data;
  } catch (error) {
    console.error("Error fetching page data:", error);
  }
};

const back = () => {
  router.push(`/page-list`);
};

onMounted(async () => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");
  await fetchPage();
});
onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
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
      <div
          class="page-header min-vh-75"
          :style="{ backgroundImage: `url(${bg0})` }"
      >
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center mx-auto my-auto">
              <h1 class="text-white">
                Ochrana osobných údajov <span class="text-white"></span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6 m-t6">
      <h1 class="text-center mb-4 mt-3">{{ page.title }}</h1>
      <div v-html="page.content" class="mb-4 mx-5 text-start"></div>
      <div class="text-center mb-4">
        <MaterialButton
            variant="gradient"
            color="dark"
            @click="back"
            class="col-lg-3 col-sm-3"
        >Späť na obsah</MaterialButton>
      </div>
    </div>
    <DefaultFooter />
  </div>
</template>