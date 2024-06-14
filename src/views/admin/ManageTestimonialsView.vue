<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import MaterialButton from '@/components/MaterialButton.vue';

const testimonials = ref([]);
const conferences = ref([]);
const selectedConferenceId = ref(null);

const showNewForm = ref(false);
const isEditMode = ref(false);
const currentTestimonial = ref(null);

const name = ref("");
const image = ref("");
const testimonal_text = ref("");

const getTestimonalImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/testimonals/${imageName}`;
};

const fetchConferences = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-conferences"
    );
    conferences.value = response.data;
    if (conferences.value.length > 0) {
      selectedConferenceId.value = conferences.value[0].id;
      await fetchTestimonials();
    }
  } catch (error) {
    console.error("Error fetching conferences data:", error);
  }
};

const fetchTestimonials = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + `/api/get-testimonials-byConference/${selectedConferenceId.value}`
    );
    testimonials.value = response.data;
  } catch (error) {
    console.error("Error fetching testimonal data:", error);
  }
};

const toggleNewForm = () => {
  showNewForm.value = !showNewForm.value;
  if (!showNewForm.value) {
    resetForm();
  }
};

const resetForm = () => {
  name.value = "";
  image.value = "";
  testimonal_text.value = "";
  currentTestimonial.value = null;
  isEditMode.value = false;
};

const populateForm = (testimonial) => {
  name.value = testimonial.name;
  image.value = testimonial.image;
  testimonal_text.value = testimonial.testimonal_text;
};

const addOrEditTestimonial = async () => {
  if (isEditMode.value) {
    await editTestimonial();
  } else {
    await addTestimonial();
  }
};

const addTestimonial = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.post(
      import.meta.env.VITE_API_ENDPOINT + '/api/create-testimonal', {
        name: name.value,
        image: image.value,
        testimonal_text: testimonal_text.value,
        conference_id: selectedConferenceId.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    testimonials.value.push(response.data);

    resetForm();
    showNewForm.value = false;
  } catch (error) {
    console.error('Error pri pridávaní:', error);
  }
};

const editTestimonial = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.patch(
      import.meta.env.VITE_API_ENDPOINT + `/api/update-testimonal/${currentTestimonial.value.id}`, {
        name: name.value,
        image: image.value,
        testimonal_text: testimonal_text.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const index = testimonials.value.findIndex(t => t.id === currentTestimonial.value.id);
    if (index !== -1) {
      testimonials.value[index] = response.data;
    }

    resetForm();
    showNewForm.value = false;
  } catch (error) {
    console.error('Error pri úprave:', error);
  }
};

const deleteTestimonial = async (testimonialId) => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    await axios.delete(
      import.meta.env.VITE_API_ENDPOINT + `/api/delete-testimonal/${testimonialId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    testimonials.value = testimonials.value.filter(t => t.id !== testimonialId);
  } catch (error) {
    console.error('Error pri odstraňovaní:', error);
  }
};

const startEdit = (testimonial) => {
  currentTestimonial.value = testimonial;
  populateForm(testimonial);
  isEditMode.value = true;
  showNewForm.value = true;
};

const handleConferenceChange = async (event) => {
  selectedConferenceId.value = event.target.value;
  await fetchTestimonials();
};

onMounted(async () => {
  await fetchConferences();
});
</script>

<template class="">
  <div class="col-lg-12 bg-gradient-dark rounded-3 p-2 px-2 shadow-blur mb-3 text-center">
    <h3 class="text-white">Povedali o nás</h3>
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

      <div class="row">
        <div class="col-lg-6 col-md-6 mb-4 mt-1 pt-3" v-for="(testimonial, index) in testimonials" :key="index">
          <div class="card bg-gradient-dark card-plain" style="height: 100%;">
            <div class="card-body d-flex flex-column justify-content-between">
              <img v-if="testimonial.image" :src="getTestimonalImageUrl(testimonial.image)" :alt="testimonial.name" class="avatar avatar-lg border-radius-lg shadow mt-n5" style="object-fit: cover; max-height: 200px;" />
              <div class="author">
                <div class="name">
                  <h6 class="mb-0 font-weight-bolder text-white">{{ testimonial.name }}</h6>
                </div>
              </div>
              <div class="text-end d-flex justify-content-end">
                <div class="me-3">
                  <h6 class="mb-0 text-uppercase text-secondary text-sm icon-button" @click="startEdit(testimonial)">
                    <i class="fas fa-pen text-center me-2"></i>
                  </h6>
                </div>
                <div>
                  <h6 class="mb-0 text-uppercase text-danger text-sm icon-button" @click="deleteTestimonial(testimonial.id)">
                    <i class="fas fa-trash text-center me-2"></i>
                  </h6>
                </div>
              </div>
              <p class="mt-4 text-white">{{ testimonial.testimonal_text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <MaterialButton
        variant="gradient"
        color="dark"
        @click="toggleNewForm"
        class="mb-0 col-lg-4 col-sm-12"
      ><i class="fas fa-plus me-2"></i>Pridať</MaterialButton>
    </div>

    <div v-if="showNewForm" class="mt-4">
      <form @submit.prevent="addOrEditTestimonial">
        <div class="mb-3 custom-input">
          <input type="text" v-model="name" class="form-control" placeholder="Meno" required />
        </div>
        <div class="mb-3 custom-input">
          <input type="text" v-model="image" class="form-control" placeholder="URL obrázka" required />
        </div>
        <div class="mb-3 custom-input">
          <textarea v-model="testimonal_text" class="form-control" placeholder="Text" rows="3" required></textarea>
        </div>
        <div class="text-center">
          <MaterialButton
            variant="gradient"
            color="dark"
            type="submit"
            class="mb-0 col-2"
          >{{ isEditMode.value ? 'Upraviť' : 'Odoslať' }}</MaterialButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.custom-input .form-control {
  border: none;
  border-bottom: 1px solid #ced4da;
  border-radius: 0;
  box-shadow: none;
  transition: border-color 0.3s ease-in-out;
}

.custom-input .form-control:focus {
  border-bottom: 1px solid #495057;
  box-shadow: none;
}

.icon-button {
  cursor: pointer;
  padding: 0.15rem;
  border-radius: 0.40rem;
  transition: box-shadow 0.3s ease-in-out;
}

.icon-button:active {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

@media (max-width: 576px) {
  .form-check-inline {
    display: block;
    width: 100%;
  }

  .btn-check + .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

.btn-check:checked + .btn-outline-dark {
  background-image: linear-gradient(180deg, rgba(34,34,34,1) 0%, rgba(51,51,51,1) 100%);
  border-color: rgba(34,34,34,1);
  color: white;
}
</style>

