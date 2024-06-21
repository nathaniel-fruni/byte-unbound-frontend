<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MaterialButton from '@/components/MaterialButton.vue';

const sponsors = ref([]);
const getSponsorImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/sponsors/${imageName}`;
};
const isLogoMissing = ref(false);

const fetchSponsors = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + `/api/get-sponsors`
    );
    sponsors.value = response.data;
  } catch (error) {
    console.error("Error fetching sponsor data:", error);
  }
};

const showNewForm = ref(false);
const name = ref("");
const logo = ref("");
const logoFileName = ref("");

const toggleNewForm = () => {
  showNewForm.value = !showNewForm.value;
  if (!showNewForm.value) {
    resetForm();
  }
};

const resetForm = () => {
  name.value = "";
  logo.value = "";
  logoFileName.value = "";
  isLogoMissing.value = false;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    logo.value = file;
    logoFileName.value = file.name;
    isLogoMissing.value = false;
  }
};

const addSponsor = async () => {
  if (!logo.value) {
    isLogoMissing.value = true;
    return;
  }

  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,"$1");

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('logo', logo.value);

    const response = await axios.post(
      import.meta.env.VITE_API_ENDPOINT + '/api/create-sponsor',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    sponsors.value.push(response.data);

    resetForm();
    showNewForm.value = false;
  } catch (error) {
    console.error('Error pri pridávaní:', error);
  }
};

onMounted(async () => {
  await fetchSponsors();
});
</script>

<template>
  <section>
    <div class="container-fluid px-3">
      <div class="row justify-content-center">
        <div
          class="container mb-4 card card-body shadow-xl mx-3 mx-md-4 p-4 d-flex justify-content-center align-content-center">

          <div class="col-lg-12 text">
            <div class="card card-body bg-gradient-white">
              <div class="table-responsive">
                <table class="table align-items-center text-center">
                  <tbody>
                  <template v-for="sponsor in sponsors" :key="sponsor.id">
                    <tr>
                      <td>
                        <p class="text-dark text-bold m-0">{{ sponsor.name }}</p>
                        <img :src="getSponsorImageUrl(sponsor.logo)"
                             style="object-fit: contain; max-height: 45px"
                             :alt="sponsor.name"
                             class="img-fluid sponsor-logo" />
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="text-center">
            <MaterialButton
              variant="gradient"
              color="dark"
              @click="toggleNewForm"
              class="mb-0 mt-3 col-lg-12 col-sm-12"
            ><i class="fas fa-plus me-2"></i>Pridať
            </MaterialButton>
          </div>

          <div v-if="showNewForm" class="mt-4">
            <form @submit.prevent="addSponsor">
              <div class="mb-3 custom-input">
                <input type="text" v-model="name" class="form-control" placeholder="Meno sponzora" required />
              </div>
              <div class="mb-3 custom-input">
                <input type="file" @change="handleFileUpload" id="file-upload" hidden />
                <label for="file-upload" class="btn btn-secondary btn-block">Nahrajte obrázok</label>
                <span v-if="logoFileName">{{ logoFileName }}</span>
              </div>
              <div class="text-center">
                <MaterialButton
                  variant="gradient"
                  color="dark"
                  type="submit"
                  class="mb-0 col-9"
                >Odoslať
                </MaterialButton>
                <p v-if="isLogoMissing" class="text-danger mt-2">Nahrajte obrázok.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-input {
  position: relative;
}

.btn-block {
  display: block;
  width: 100%;
}
</style>
