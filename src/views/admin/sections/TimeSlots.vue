<script setup>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
import MaterialButton from '@/components/MaterialButton.vue';
import VueTimepicker from 'vue3-timepicker';
import 'vue3-timepicker/dist/VueTimepicker.css';

const timeSlots = ref([]);
const stages = ref([]);
const selectedStageId = ref(null);
const talks = ref([]);

const showNewForm = ref(false);
const isEditMode = ref(false);
const currentTimeSlot = ref(null);

const talk_id = ref("");
const start_time = ref(null);
const end_time = ref(null);
const isTalksEmpty = computed(() => talks.value.length === 0);

const fetchStages = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-stages"
    );
    stages.value = response.data;
    if (stages.value.length > 0) {
      selectedStageId.value = stages.value[0].id;
      await fetchTimeSlots();
    }
  } catch (error) {
    console.error("Error fetching stages data:", error);
  }
};

const fetchTimeSlots = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + `/api/get-timeSlot-byStageId/${selectedStageId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    timeSlots.value = response.data;
  } catch (error) {
    console.error("Error fetching time slot data:", error);
  }
};

const fetchTalks = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + `/api/get-unassignedTalks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    talks.value = response.data;
  } catch (error) {
    console.error("Error fetching talk data:", error);
  }
};

const toggleNewForm = () => {
  showNewForm.value = !showNewForm.value;
  if (!showNewForm.value) {
    resetForm();
  }
};

const resetForm = () => {
  start_time.value = null;
  end_time.value = null;
  talk_id.value = "";
  currentTimeSlot.value = null;
  showNewForm.value = false;
  isEditMode.value = false;
  fetchTalks();
  fetchTimeSlots();
};

const populateForm = (timeSlot) => {
  start_time.value = formatTime(timeSlot.start_time);
  end_time.value = formatTime(timeSlot.end_time);
  talk_id.value = timeSlot.talk_id;
};

const addOrEditTimeSlot = async () => {
  if (isEditMode.value) {
    await editTimeSlot();
  } else {
    await addTimeSlot();
  }
};

const addTimeSlot = async () => {
  if (isTimeSlotOverlap(start_time.value, end_time.value)) {
    alert('Čas sa prelína s iným časovým oknom.');
    return;
  }

  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.post(
      import.meta.env.VITE_API_ENDPOINT + `/api/create-timeSlot`,
      {
        start_time: start_time.value,
        end_time: end_time.value,
        talk_id: talk_id.value,
        stage_id: selectedStageId.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    timeSlots.value.push(response.data);
    resetForm();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      alert(error.response.data.error);
    } else {
      console.error('Error adding time slot:', error);
    }
  }
};

const editTimeSlot = async () => {
  if (isTimeSlotOverlap(start_time.value, end_time.value)) {
    alert('Čas sa prelína s iným časovým oknom.');
    return;
  }

  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.patch(
      import.meta.env.VITE_API_ENDPOINT + `/api/update-timeSlot/${currentTimeSlot.value.id}`,
      {
        start_time: start_time.value,
        end_time: end_time.value,
        talk_id: talk_id.value,
        stage_id: selectedStageId.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const index = timeSlots.value.findIndex(t => t.id === currentTimeSlot.value.id);
    if (index !== -1) {
      timeSlots.value[index] = response.data;
    }

    resetForm();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      alert(error.response.data.error);
    } else {
      console.error('Error adding time slot:', error);
    }
  }
};

const deleteTimeSlot = async (timeSlotId) => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    await axios.delete(
      import.meta.env.VITE_API_ENDPOINT + `/api/delete-timeSlot/${timeSlotId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchTimeSlots();
    await fetchTalks();
  } catch (error) {
    console.error('Error deleting time slot:', error);
  }
};

const startEdit = (timeSlot) => {
  currentTimeSlot.value = timeSlot;
  populateForm(timeSlot);
  isEditMode.value = true;
  showNewForm.value = true;
};

const handleStageChange = async (event) => {
  selectedStageId.value = event.target.value;
  await fetchTimeSlots();
};

const isTimeSlotOverlap = (newStartTime, newEndTime) => {
  const newStart = new Date(newStartTime);
  const newEnd = new Date(newEndTime);

  for (const slot of timeSlots.value) {
    const existingStart = new Date(slot.start_time);
    const existingEnd = new Date(slot.end_time);

    if (currentTimeSlot.value && (slot.id === currentTimeSlot.value.id)) {
      continue;
    }

    if (
      (newStart > existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd < existingEnd) ||
      (newStart < existingStart && newEnd > existingEnd)
    ) {
      return true;
    }
  }
  return false;
};

function formatTime(dateTime) {
  const date = new Date(dateTime);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  return `${hours}:${minutes}`;
}

watch(currentTimeSlot, (newTimeSlot) => {
  if (newTimeSlot) {
    populateForm(newTimeSlot);
  }
});

onMounted(async () => {
  await fetchStages();
  await fetchTalks();
});
</script>

<template>
  <div class="">
    <div class="card card-body shadow-dark rounded-3 mx-md-4 p-4">
      <h3 class="col-12 text-center mt-2">Spravovanie časových okien</h3>
      <div class="row justify-content-center mt-2">
        <div class="row justify-content-center text-center py-2">
          <div class="col-auto">
            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
              <div class="row justify-content-center">
                <div v-for="stage in stages" :key="stage.id" class="col-lg-6 col-sm-12">
                  <div class="form-check">
                    <input class="btn-check" type="radio" name="conference" :id="'conference' + stage.id" :value="stage.id" v-model="selectedStageId" @change="handleStageChange">
                    <label class="btn btn-outline-dark w-100 mb-2" :for="'conference' + stage.id">{{ stage.name }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12 col-md-12 mb-3" v-for="(timeSlot, index) in timeSlots" :key="index">
            <div class="card bg-gradient-white card card-body shadow-dark" style="height: 100%;">
              <div class="card-body d-flex flex-column justify-content-between">
                <div class="author">
                  <div class="">
                    <h6 class="mb-0 font-weight-bolder text-dark">{{ formatTime(timeSlot.start_time) }} - {{ formatTime(timeSlot.end_time) }}</h6>
                    <p class="text-dark mb-0">{{timeSlot.talk.title}}</p>
                  </div>
                </div>
                <div class="text-end d-flex justify-content-end">
                  <div class="me-3">
                    <h6 class="mb-0 text-uppercase text-secondary text-sm icon-button" @click="startEdit(timeSlot)">
                      <i class="fas fa-pen text-center me-2"></i>
                    </h6>
                  </div>
                  <div>
                    <h6 class="mb-0 text-uppercase text-danger text-sm icon-button" @click="deleteTimeSlot(timeSlot.id)">
                      <i class="fas fa-trash text-center me-2"></i>
                    </h6>
                  </div>
                </div>
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
        ><i class="fas fa-plus me-2"></i>Pridať okno</MaterialButton>
      </div>

      <div v-show="showNewForm || isEditMode">
        <div v-if="isTalksEmpty && !isEditMode" class="text-center text-danger">
          <p class="mt-3">Žiadne prednášky pre pridelenie.</p>
        </div>
        <form v-if="isEditMode || (showNewForm && !isTalksEmpty)" @submit.prevent="addOrEditTimeSlot">
          <div v-if="!isEditMode" class="mb-3 custom-input">
            <label for="partner_id">Prednáška</label>
            <select v-model="talk_id" class="form-control" required>
              <option v-for="talk in talks" :value="talk.id" :key="talk.id">
                {{ talk.title }}
              </option>
            </select>
          </div>
          <div class="mb-3 custom-input">
            <VueTimepicker v-model="start_time" format="HH:mm" class="form-control" placeholder="Začiatok" required />
          </div>
          <div class="mb-3 custom-input">
            <VueTimepicker v-model="end_time" format="HH:mm" class="form-control" placeholder="Koniec" required />
          </div>
          <div class="text-center">
            <MaterialButton
              variant="gradient"
              color="dark"
              type="submit"
              class="mb-0 col-3"
            >Odoslať</MaterialButton>
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

@media (max-width: 576px) {
  .form-check-inline {
    display: block;
    width: 100%;
  }
}

.btn-check + .btn {
  width: 100%;
  margin-bottom: 0.5rem;
}

.btn-check:checked + .btn-outline-dark {
  background-image: linear-gradient(180deg, rgba(34,34,34,1) 0%, rgba(51,51,51,1) 100%);
  border-color: rgba(34,34,34,1);
  color: white;
}
</style>
