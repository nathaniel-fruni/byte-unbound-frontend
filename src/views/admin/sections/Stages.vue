<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import MaterialButton from '@/components/MaterialButton.vue'

const stages = ref([]);
const showNewForm = ref(false);
const isEditMode = ref(false);
const currentStage = ref(null);

const name = ref("");

const toggleNewForm = () => {
  showNewForm.value = !showNewForm.value;
  if (!showNewForm.value) {
    resetForm();
  }
};

const resetForm = () => {
  name.value = "";
  isEditMode.value = false;
};

const populateForm = (stage) => {
  name.value = stage.name;
};

const addOrEditStage = async () => {
  if (isEditMode.value) {
    await editStage();
  } else {
    await addStage();
  }
};

const fetchStages = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + `/api/get-stages`
    );
    stages.value = response.data;
  } catch (error) {
    console.error("Error fetching stage data:", error);
  }
};

const addStage = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.post(
      import.meta.env.VITE_API_ENDPOINT + '/api/create-stage', {
        name: name.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    stages.value.push(response.data);

    resetForm();
    showNewForm.value = false;
  } catch (error) {
    console.error('Error pri pridávaní:', error);
  }
};

const editStage = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const response = await axios.patch(
      import.meta.env.VITE_API_ENDPOINT + `/api/update-stage/${currentStage.value.id}`, {
        name: name.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const index = stages.value.findIndex(t => t.id === currentStage.value.id);
    if (index !== -1) {
      stages.value[index] = response.data;
    }

    resetForm();
    showNewForm.value = false;
  } catch (error) {
    console.error('Error pri úprave:', error);
  }
};

const deleteStage = async (stageId) => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    await axios.delete(
      import.meta.env.VITE_API_ENDPOINT + `/api/delete-stage/${stageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    stages.value = stages.value.filter(t => t.id !== stageId);
  } catch (error) {
    console.error('Error pri odstraňovaní:', error);
  }
};

const startEdit = (stage) => {
  currentStage.value = stage;
  populateForm(stage);
  isEditMode.value = true;
  showNewForm.value = true;
};

onMounted(async () => {
  await fetchStages();
});
</script>

<template>
  <h3 class="col-lg-5 col-md-5 col-sm-5 text-center mt-5">Spravovanie stage-ov</h3>
  <div class="col-lg-5 px-4">
    <div class="col-lg-12 col-md-12 mb-4 mt-3" v-for="(stage, index) in stages" :key="index">
      <div class="card bg-gradient-dark card-plain" style="height: 100%;">
        <div class="card-body d-flex flex-column justify-content-between">
          <div class="author">
            <div class="name">
              <h6 class="mb-0 font-weight-bolder text-white">{{ stage.name }}</h6>
            </div>
          </div>
          <div class="text-end d-flex justify-content-end">
            <div class="me-3">
              <h6 class="mb-0 text-uppercase text-secondary text-sm icon-button" @click="startEdit(stage)">
                <i class="fas fa-pen text-center me-2"></i>
              </h6>
            </div>
            <div>
              <h6 class="mb-0 text-uppercase text-danger text-sm icon-button" @click="deleteStage(stage.id)">
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
        class="mb-0 col-lg-12 col-sm-12"
      ><i class="fas fa-plus me-2"></i>Pridať stage</MaterialButton>
    </div>

    <div v-if="showNewForm" class="mt-4">
      <form @submit.prevent="addOrEditStage">
        <div class="mb-3 custom-input">
          <input type="text" v-model="name" class="form-control" placeholder="Názov stage-u" required />
        </div>
        <div class="text-center">
          <MaterialButton
            variant="gradient"
            color="dark"
            type="submit"
            class="mb-0 col-9"
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
</style>