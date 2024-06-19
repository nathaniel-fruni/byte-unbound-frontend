<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import MaterialButton from '@/components/MaterialButton.vue';

const gallery = ref([]);
const conferences = ref([]);
const selectedConferenceId = ref(null);

const images = ref([]);
const imageFileNames = ref([]);

const getGalleryImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/gallery/${imageName}`;
};

const fetchConferences = async () => {
  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + "/api/get-conferences"
    );
    conferences.value = response.data;
    if (conferences.value.length > 0) {
      selectedConferenceId.value = conferences.value[0].id;
      await fetchGallery();
    }
  } catch (error) {
    console.error("Error fetching conferences data:", error);
  }
};

const fetchGallery = async () => {
  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + `/api/get-gallery-byConference/${selectedConferenceId.value}`
    );
    gallery.value = response.data;
  } catch (error) {
    console.error("Error fetching gallery data:", error);
  }
};

const addPictures = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,"$1");

    const formData = new FormData();
    formData.append('conference_id', selectedConferenceId.value);
    images.value.forEach(image => {
      formData.append('images[]', image);
    });

    const response = await axios.post(
        import.meta.env.VITE_API_ENDPOINT + '/api/create-gallery',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
    );

    const newImages = response.data;
    const existingGallery = gallery.value.find(g => g.conference_id === selectedConferenceId.value);
    if (existingGallery) {
      existingGallery.gallery_image.push(...newImages);
    } else {
      const newGallery = {
        conference_id: selectedConferenceId.value,
        gallery_image: newImages
      };
      gallery.value.push(newGallery);
    }

    images.value.splice(0);
    imageFileNames.value.splice(0);
    toggleUploadArea();
  } catch (error) {
    console.error('Error pri pridávaní:', error);
  }
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    images.value.push(files[i]);
    imageFileNames.value.push(files[i].name);
  }
};

const handleConferenceChange = async (event) => {
  selectedConferenceId.value = event.target.value;
  await fetchGallery();
};

const toggleUploadArea = () => {
  const uploadArea = document.getElementById('upload-area');
  uploadArea.classList.toggle('d-none');
};

onMounted(async () => {
  await fetchConferences();
});
</script>

<template>
  <div class="col-lg-12 bg-gradient-dark rounded-3 p-2 px-2 shadow-blur mb-3 text-center">
    <h3 class="text-white">Galéria</h3>
  </div>

  <div class="card card-body shadow-xl mx-3 mx-md-4 p-4 d-flex justify-content-center align-content-center">
    <div class="col">

      <div class="container-fluid mb-4">
        <div class="row justify-content-center text-center py-2">
          <div class="col-lg-6 mx-auto">
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
              <div v-for="conference in conferences" :key="conference.id" class="form-check form-check-inline d-flex flex-column flex-sm-row">
                <input class="btn-check" type="radio" name="conference" :id="'conference' + conference.id" :value="conference.id" v-model="selectedConferenceId" @change="handleConferenceChange">
                <label class="btn btn-outline-dark" :for="'conference' + conference.id">{{ conference.title }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mb-4">
        <MaterialButton
            variant="gradient"
            color="secondary"
            @click="toggleUploadArea"
            class="col-lg-4 col-sm-12"
        ><i class="fas fa-plus me-2"></i>Nahrať fotky</MaterialButton>
      </div>

      <div id="upload-area" class="d-none text-center mb-4">
        <form @submit.prevent="addPictures">
          <div class="custom-input mb-3">
            <input type="file" @change="handleFileUpload" id="file-upload" multiple hidden />
            <label for="file-upload" class="btn btn-secondary btn-block">Nahrajte fotky</label>
            <div v-if="imageFileNames.length" class="mt-3">
              <p v-for="(name, index) in imageFileNames" :key="index">{{ name }}</p>
            </div>
          </div>
          <div class="text-center">
            <MaterialButton
                variant="gradient"
                color="secondary"
                type="submit"
                class="mb-6 col-lg-4 col-sm-12"
            ><i class="fas fa-upload me-2"></i>Odoslať</MaterialButton>
          </div>
        </form>
      </div>

      <div class="row d-flex justify-content-center">
        <template v-if="gallery.length > 0">
          <div v-for="(galleryItem) in gallery" :key="galleryItem.id" class="col-12 mb-4">
            <div class="row">
              <div class="col-md-4 mb-4" v-for="(gallery_image, imgIndex) in galleryItem.gallery_image" :key="imgIndex">
                <div class="img-container">
                  <img :src="getGalleryImageUrl(gallery_image.image)" class="img-fluid border-radius-lg shadow" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="col-12 text-center">
            <p class="text-muted">Zatiaľ žiadne obrázky.</p>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>

<style scoped>
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.img-container img {
  max-height: 100%;
  max-width: 100%;
  object-fit: cover;
}

.d-none {
  display: none;
}

.custom-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.custom-input input[type="file"] {
  display: none;
}

.custom-input label {
  cursor: pointer;
}

.custom-input p {
  margin: 0;
}
</style>
