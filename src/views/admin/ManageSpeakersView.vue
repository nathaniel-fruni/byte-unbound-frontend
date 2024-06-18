<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import MaterialButton from '@/components/MaterialButton.vue'

const speakers = ref([]);
const partners = ref([]);
const showNewForm = ref(false);
const isEditMode = ref(false);
const currentSpeaker = ref(null);
const getSpeakerImageUrl = (imageName) => {
  return import.meta.env.VITE_API_ENDPOINT + `/storage/images/speakers/${imageName}`;
};
const pictureFileName = ref("");

const first_name = ref("");
const last_name = ref("");
const short_description = ref("");
const long_description = ref("");
const picture = ref("");
const linkedin = ref("");
const partner_id = ref("");

const toggleNewForm = () => {
  showNewForm.value = !showNewForm.value;
  if (!showNewForm.value) {
    resetForm();
  }
};

const resetForm = () => {
  first_name.value = "";
  last_name.value = "";
  short_description.value = "";
  long_description.value = "";
  picture.value = "";
  linkedin.value = "";
  partner_id.value = "";
  isEditMode.value = false;
  pictureFileName.value = "";
};

const populateForm = (speaker) => {
  first_name.value = speaker.first_name;
  last_name.value = speaker.last_name;
  short_description.value = speaker.short_description;
  long_description.value = speaker.long_description;
  picture.value = speaker.picture;
  linkedin.value = speaker.linkedin;
  partner_id.value = speaker.partner_id;
};

const addOrEditSpeaker = async () => {
  if (isEditMode.value) {
    await editSpeaker();
  } else {
    if (!picture.value) {
      alert("Nahrajte fotku.");
      return;
    }
    await addSpeaker();
  }
};

const startEdit = (speaker) => {
  currentSpeaker.value = speaker;
  populateForm(speaker);
  isEditMode.value = true;
  showNewForm.value = true;
};

const fetchPartners = async () => {
  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + `/api/get-partners`
  );
    partners.value = response.data;
  } catch (error) {
    console.error("Error fetching partner data:", error);
  }
};

const fetchSpeakers = async () => {
  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + `/api/get-speakers-admin`
  );
    speakers.value = response.data;
  } catch (error) {
    console.error("Error fetching speaker data:", error);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    picture.value = file;
    pictureFileName.value = file.name;
  }
};

const addSpeaker = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,"$1");

    const formData = new FormData();
    formData.append('first_name', first_name.value);
    formData.append('last_name', last_name.value);
    formData.append('short_description', long_description.value);
    formData.append('long_description', long_description.value);
    formData.append('picture', picture.value);
    formData.append('linkedin', linkedin.value);
    formData.append('partner_id', partner_id.value);

    const response = await axios.post(
        import.meta.env.VITE_API_ENDPOINT + '/api/create-speaker',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
    );
    speakers.value.push(response.data);

    resetForm();
    showNewForm.value = false;
  } catch (error) {
    console.error('Error pri pridávaní:', error);
  }
};

const editSpeaker = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,"$1");

    const formData = new FormData();
    formData.append('first_name', first_name.value);
    formData.append('last_name', last_name.value);
    formData.append('short_description', short_description.value);
    formData.append('long_description', long_description.value);
    formData.append('linkedin', linkedin.value);
    formData.append('partner_id', partner_id.value);
    if (picture.value instanceof File) {
      formData.append('picture', picture.value);
    }
    formData.append('_method', 'PATCH');

    const response = await axios.post(
        import.meta.env.VITE_API_ENDPOINT + `/api/update-speaker/${currentSpeaker.value.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
  );

    const index = speakers.value.findIndex(t => t.id === currentSpeaker.value.id);
    if (index !== -1) {
      speakers.value[index] = response.data;
    }

    resetForm();
    showNewForm.value = false;
  } catch (error) {
    console.error('Error pri úprave:', error);
  }
};

const deleteSpeaker = async (speakerId) => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,"$1");

    await axios.delete(
        import.meta.env.VITE_API_ENDPOINT + `/api/delete-speaker/${speakerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
  );

    speakers.value = speakers.value.filter(t => t.id !== speakerId);
  } catch (error) {
    console.error('Error pri odstraňovaní:', error);
  }
};

onMounted(async () => {
  await fetchSpeakers();
  await fetchPartners();
});
</script>

<template>
  <div class="col-lg-12 bg-gradient-dark rounded-3 p-2 px-2 shadow-blur mb-3 text-center">
    <h3 class="text-white">Speakers</h3>
  </div>
  <div class="card card-body shadow-xl mx-3 mx-md-4 p-4 d-flex justify-content-center align-content-center">
    <div class="col-lg-12 px-4">
      <div class="col-lg-12 col-md-12 mb-4 mt-1 pt-3" v-for="(speaker, index) in speakers" :key="index">
        <div class="card bg-gradient-dark card-plain" style="height: 100%;">
          <div class="card-body d-flex flex-column justify-content-between">
            <img v-if="speaker.picture" :src="getSpeakerImageUrl(speaker.picture)" :alt="speaker.last_name" class="avatar avatar-lg border-radius-lg shadow mt-n5" style="object-fit: cover; max-height: 200px;" />
            <div class="author">
              <div class="name">
                <h6 class="mb-0 font-weight-bolder text-white">{{ speaker.first_name + " " + speaker.last_name }}</h6>
                <p class="text-secondary">{{speaker.partner.name}}</p>
              </div>
            </div>
            <div class="text-end d-flex justify-content-end">
              <div class="me-3">
                <h6 class="mb-0 text-uppercase text-secondary text-sm icon-button" @click="startEdit(speaker)">
                  <i class="fas fa-pen text-center me-2"></i>
                </h6>
              </div>
              <div>
                <h6 class="mb-0 text-uppercase text-danger text-sm icon-button" @click="deleteSpeaker(speaker.id)">
                  <i class="fas fa-trash text-center me-2"></i>
                </h6>
              </div>
            </div>
            <p class="mt-2 text-white">{{ speaker.short_description }}</p>
            <p class="text-white">{{ speaker.long_description }}</p>
            <p v-if="speaker.linkedin">
              <a class="text-info" :href="speaker.linkedin" target="_blank">LinkedIn</a>
            </p>
            <p v-else>
              No LinkedIn profile available
            </p>
          </div>
        </div>
      </div>
      <div class="text-center">
        <MaterialButton
            variant="gradient"
            color="dark"
            @click="toggleNewForm"
            class="mb-0 col-lg-9 col-sm-12"
        ><i class="fas fa-plus me-2"></i>Pridať speaker-a</MaterialButton>
      </div>

      <div v-if="showNewForm" class="mt-4">
        <form @submit.prevent="addOrEditSpeaker">
          <div class="mb-3 custom-input">
            <input type="text" v-model="first_name" class="form-control" placeholder="Meno" required />
          </div>
          <div class="mb-3 custom-input">
            <input type="text" v-model="last_name" class="form-control" placeholder="Priezvisko" required />
          </div>
          <div class="mb-3 custom-input">
            <textarea v-model="short_description" class="form-control" placeholder="Krátky popis" rows="2" required></textarea>
          </div>
          <div class="mb-3 custom-input">
            <textarea v-model="long_description" class="form-control" placeholder="Dlhý popis" rows="4" required></textarea>
          </div>
          <div class="mb-3 custom-input">
            <input type="text" v-model="linkedin" class="form-control" placeholder="Linkedin link" required />
          </div>
          <div class="mb-3 custom-input">
            <label for="partner_id">Partner</label>
            <select v-model="partner_id" class="form-control" required>
              <option v-for="partner in partners" :value="partner.id" :key="partner.id">
                {{ partner.name }}
              </option>
            </select>
          </div>
          <div class="mb-3 custom-input">
            <label for="file-upload" class="btn btn-secondary btn-block">Nahrajte obrázok</label>
            <input type="file" @change="handleFileUpload" id="file-upload" style="display: none;" />
            <span v-if="pictureFileName">{{ pictureFileName }}</span>
          </div>
          <div class="text-center">
            <MaterialButton
                variant="gradient"
                color="dark"
                type="submit"
                class="mb-0 col-6"
            >{{ isEditMode.value ? 'Upraviť' : 'Odoslať' }}</MaterialButton>
          </div>
        </form>
      </div>
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
</style>