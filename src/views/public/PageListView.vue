<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import DefaultNavbar from "./components/NavbarDefault.vue";
import DefaultFooter from "./components/FooterDefault.vue";
import bg0 from "@/assets/img/backgrounds/section-background.jpg";

const body = document.getElementsByTagName("body")[0];
const pages = ref([]);
const router = useRouter();

const fetchPages = async () => {
  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + `/api/get-pages`
  );
    pages.value = response.data;
  } catch (error) {
    console.error("Error fetching pages data:", error);
  }
};

const navigateToPage = (pageId) => {
  router.push(`/page/${pageId}`);
};

onMounted(async () => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");
  await fetchPages();
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
          :style="{ backgroundImage: `url(${bg0})`}"
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
      <div class="p-4">
        <p class="text-center">Registrácie na konferenciu Prevádzkovateľa (ďalej len „Pravidlá“)</p>
        <p class="text-start">Tento dokument upravuje vybrané práva a povinnosti Prevádzkovateľa, oprávnených a dotknutých osôb pri spracovávaní osobných údajov v rámci registrácie na konferenciu (ďalej len „Konferencia“) poskytovanej Prevádzkovateľom v informačnom systéme prostredníctvom príslušných internetových domén alebo prostredníctvom iných platforiem, ktorými sú najmä, ale nie výlučne, iOS (Apple’s App Store), Android (Google Play), sociálna sieť Facebook, platforma Amazon (ďalej len „Platformy“) vyplývajúce zo zákona č. 18/2018 Z.z. o ochrane osobných údajov (ďalej len „Zákon“).</p>
        <p class="text-start">Prevádzkovateľ:</p>
        <p class="text-start">Názov: ITM Solutions, s.r.o.<br>Sídlo: Ceroviny 427, 95124 Nové Sady, Slovenská republika<br>IČO: 53562496<br>DIČ: 2121410918<br>E-mail: info[a]nconnect.sk<br>Telefónne číslo: +421902170744<br>(ďalej len „Prevádzkovateľ“)</p>
      </div>
      <div class="mb-3">
        <h2 class="text-center mb-4">Obsah</h2>
        <ul class="list-none text-center">
          <li v-for="page in pages" :key="page.id">
            <h6 @click="navigateToPage(page.id)" class="text-dark font-bold hover-effect text-lg" style="cursor: pointer">{{ page.title }}</h6>
          </li>
        </ul>
      </div>
    </div>
    <DefaultFooter />
  </div>
</template>
<style scoped>
.hover-effect:hover {
  text-decoration: underline;
}
ul {
  padding: 0;
  list-style-type: none;
}

.text-center {
  text-align: center;
}
</style>