<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import MaterialButton from '@/components/MaterialButton.vue'

const talks = ref([]);
const speakers = ref([]);
const showNewForm = ref(false);
const isEditMode = ref(false);
const currentTalk = ref(null);

const title = ref("");
const description = ref("");
const capacity = ref("");
const speaker_id = ref("");

const toggleNewForm = () => {
  showNewForm.value = !showNewForm.value;
  if (!showNewForm.value) {
    resetForm();
  }
};

const resetForm = () => {
  title.value = "";
  description.value = "";
  capacity.value = "";
  speaker_id.value = "";
  isEditMode.value = false;
};

const populateForm = (talk) => {
  title.value = talk.title;
  description.value = talk.description;
  capacity.value = talk.capacity;
  speaker_id.value = talk.speaker_id;
};

const addOrEditTalk = async () => {
  if (isEditMode.value) {
    await editTalk();
  } else {
    await addTalk();
  }
};

const startEdit = (talk) => {
  currentTalk.value = talk;
  populateForm(talk);
  isEditMode.value = true;
  showNewForm.value = true;
};

const fetchSpeakers = async () => {
  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + `/api/get-speakers`
  );
    speakers.value = response.data;
  } catch (error) {
    console.error("Error fetching speaker data:", error);
  }
};

const fetchTalks = async () => {
  try {
    const response = await axios.get(
        import.meta.env.VITE_API_ENDPOINT + `/api/get-talks`
  );
    talks.value = response.data;
  } catch (error) {
    console.error("Error fetching talk data:", error);
  }
};

const addTalk = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).$)|^.*$/,"$1");

    const response = await axios.post(
        import.meta.env.VITE_API_ENDPOINT + '/api/create-talk', {
          title: title.value,
          description: description.value,
          capacity: capacity.value,
          remaining_capacity: capacity.value,
          speaker_id: speaker_id.value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    talks.value.push(response.data);

    resetForm();
    showNewForm.value = false;
  } catch (error) {
    console.error('Error pri pridávaní:', error);
  }
};

const editTalk = async () => {
  try {
    const min_capacity = currentTalk.value.capacity - currentTalk.value.remaining_capacity;
    if (min_capacity > capacity.value) {
      alert("Zadajte kapacitu väčšiu ako " + min_capacity);
    } else {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).$)|^.*$/,"$1");

      console.log(currentTalk.value.id);

      const response = await axios.patch(
          import.meta.env.VITE_API_ENDPOINT + `/api/update-talk/${currentTalk.value.id}`, {
        title: title.value,
        description: description.value,
        capacity: capacity.value,
        remaining_capacity: currentTalk.value.remaining_capacity + (capacity.value - currentTalk.value.capacity),
        speaker_id: speaker_id.value
      },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
    );

      const index = talks.value.findIndex(t => t.id === currentTalk.value.id);
      if (index !== -1) {
        talks.value[index] = response.data;
      }

      resetForm();
      showNewForm.value = false;
    }
  } catch (error) {
    console.error('Error pri úprave:', error);
  }
};

const deleteTalk = async (talkId) => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).$)|^.*$/,"$1");

    await axios.delete(
        import.meta.env.VITE_API_ENDPOINT + `/api/delete-talk/${talkId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
  );

    talks.value = talks.value.filter(t => t.id !== talkId);
  } catch (error) {
    console.error('Error pri odstraňovaní:', error);
  }
};

onMounted(async () => {
  await fetchSpeakers();
  await fetchTalks();
});
</script>

<template>
  <div class="col-lg-12 bg-gradient-dark rounded-3 p-2 px-2 shadow-blur mb-3 text-center">
    <h3 class="text-white">Prednášky</h3>
  </div>
  <div class="card card-body shadow-xl mx-3 mx-md-4 p-4 d-flex justify-content-center align-content-center">
    <div class="col-lg-12 px-4">
      <div class="col-lg-12 col-md-12 mb-4 mt-3" v-for="(talk, index) in talks" :key="index">
        <div class="card bg-gradient-dark card-plain" style="height: 100%;">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h6 class="mb-0 font-weight-bolder text-white">{{ talk.title }}</h6>
              <p class="mt-2 text-white">{{ talk.description }}</p>
              <p class="text-white text-sm">Speaker: {{talk.speaker.first_name + " " + talk.speaker.last_name}}</p>
              <p class="text-secondary">Kapacita: {{talk.capacity}}</p>
              <p class="text-success">Zostávajúca kapacita: {{talk.remaining_capacity}}</p>
            </div>
            <div class="text-end d-flex justify-content-end">
              <div class="me-3">
                <h6 class="mb-0 text-uppercase text-secondary text-sm icon-button" @click="startEdit(talk)">
                  <i class="fas fa-pen text-center me-2"></i>
                </h6>
              </div>
              <div>
                <h6 class="mb-0 text-uppercase text-danger text-sm icon-button" @click="deleteTalk(talk.id)">
                  <i class="fas fa-trash text-center me-2"></i>
                </h6>
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
            class="mb-0 col-lg-9 col-sm-12"
        ><i class="fas fa-plus me-2"></i>Pridať prednášku</MaterialButton>
      </div>

      <div v-if="showNewForm" class="mt-4">
        <form @submit.prevent="addOrEditTalk">
          <div class="mb-3 custom-input">
            <input type="text" v-model="title" class="form-control" placeholder="Názov prednášky" required />
          </div>
          <div class="mb-3 custom-input">
            <textarea v-model="description" class="form-control" placeholder="Text" rows="3" required></textarea>
          </div>
          <div class="mb-3 custom-input">
            <label for="partner_id">Speaker</label>
            <select v-model="speaker_id" class="form-control" required>
              <option v-for="speaker in speakers" :value="speaker.id" :key="speaker.id">
                {{ speaker.first_name }} {{ speaker.last_name }}
              </option>
            </select>
          </div>
          <div class="mb-3 custom-input">
            <input type="number" v-model="capacity" class="form-control" placeholder="Kapacita" required />
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