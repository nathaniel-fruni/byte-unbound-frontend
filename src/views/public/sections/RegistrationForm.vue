<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import MaterialButton from "@/components/MaterialButton.vue";

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const successMessage = ref("");

const register = async () => {
  try {
    if (chosenLectures.value.length === 0) {
      successMessage.value = "Neboli zvolené žiadne prednášky.";
      return;
    }

    const formData = new FormData();
    formData.append("first_name", first_name.value);
    formData.append("last_name", last_name.value);
    formData.append("email", email.value);
    formData.append("talk_ids", JSON.stringify(chosenLectures.value.map(lecture => lecture.id)));

    const response = await axios.post(import.meta.env.VITE_API_ENDPOINT + '/api/register-attendee',
        formData
    );

    if (response.status === 201) {
      successMessage.value = "Registrácia úspešná!";
      resetForm();
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        if(error.response.data.talk) {
          successMessage.value = error.response.data.message + error.response.data.talk;
        } else {
          successMessage.value = error.response.data.message;
        }
      } else if (error.response.status === 400) {
        successMessage.value = "Invalid input for talk_ids.";
      } else if (error.response.status === 500) {
        successMessage.value = "Registration failed. Please try again later.";
      } else {
        successMessage.value = "An unexpected error occurred.";
      }
    } else {
      console.error("Error during registration:", error);
      successMessage.value = "An error occurred during registration.";
    }
  }
};

const stages = ref([]);
const talks = ref([]);
const timeSlots = ref([]);
const selectedStage = ref("");
const selectedLecture = ref("");
const chosenLectures = ref([]);
const lectureInfo = ref("");
const speakerInfo = ref(null);
const conflictMessage = ref("");

const fetchStages = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-stages`);
    stages.value = response.data;
  } catch (error) {
    console.error("Error fetching stages:", error);
  }
};

const fetchTalks = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-talks`);
    talks.value = response.data;
  } catch (error) {
    console.error("Error fetching talks:", error);
  }
};

const fetchTimeSlots = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-timeSlots`);
    timeSlots.value = response.data;
  } catch (error) {
    console.error("Error fetching time slots:", error);
  }
};

const fetchSpeakerInfo = async (speakerId) => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_ENDPOINT + `/api/get-speaker-byId/${speakerId}`);
    speakerInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching speaker info:", error);
  }
};

const getLectureDescription = (lectureId) => {
  const lecture = talks.value.find(t => t.id === lectureId);
  return lecture ? lecture.description : "";
};

const getLectureTime = (lectureId) => {
  const timeSlot = timeSlots.value.find(ts => ts.talk_id === lectureId);
  if (timeSlot) {
    const startTime = new Date(timeSlot.start_time);
    const endTime = new Date(timeSlot.end_time);

    const formattedStartTime = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
    const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    return `${formattedStartTime} - ${formattedEndTime}`;
  }
  return "";
};

const getLectureTitle = (lectureId) => {
  const lecture = talks.value.find(t => t.id === lectureId);
  return lecture ? lecture.title : "";
};

const addLecture = (lecture) => {
  const lectureData = talks.value.find(t => t.id === lecture);
  if (lectureData) {
    if (chosenLectures.value.some((l) => l.id === lectureData.id)) {
      conflictMessage.value = `Túto prednášku ste si už zvolili.`;
    } else if (hasTimeConflict(lecture)) {
      conflictMessage.value = `Nemôžete pridať prednášku ${lectureData.title}, pretože už máte inú prednášku v tom čase.`;
    } else {
      chosenLectures.value.push(lectureData);
      lectureInfo.value = "";
      conflictMessage.value = "";
      selectedLecture.value = "";
    }
  }
};

const removeLecture = (lecture) => {
  chosenLectures.value = chosenLectures.value.filter((l) => l.id !== lecture.id);
};

const hasTimeConflict = (newLecture) => {
  const newLectureSlot = timeSlots.value.find(ts => ts.talk_id === newLecture);
  return chosenLectures.value.some((lecture) => {
    const chosenSlot = timeSlots.value.find(ts => ts.talk_id === lecture.id);
    return newLectureSlot.start_time === chosenSlot.start_time;
  });
};
const closeConflictMessage = () => {
  conflictMessage.value = "";
  lectureInfo.value = "";
  selectedLecture.value = "";
};
const resetForm = () => {
  first_name.value = "";
  last_name.value = "";
  email.value = "";
  selectedStage.value = "";
  selectedLecture.value = "";
  chosenLectures.value = [];
};

onMounted(async () => {
  try {
    await fetchStages();
    await fetchTalks();
    await fetchTimeSlots();
  } catch (error) {
    console.error("Error during onMounted lifecycle:", error);
  }
});

watch(selectedLecture, async (newValue) => {
  if (newValue) {
    const lecture = talks.value.find(t => t.id === newValue);
    if (lecture) {
      await fetchSpeakerInfo(lecture.speaker_id);
    }
    lectureInfo.value = getLectureDescription(newValue);
  } else {
    lectureInfo.value = "";
    speakerInfo.value = null;
  }
});
</script>

<template>
  <section class="">
    <div class="rounded-container  ">
      <div class="row">
        <div class="col">
          <div class="card box-shadow-xl overflow-hidden  rounded ">
            <div class="row">
              <div class="col-lg-7 position-relative " loading="lazy">
                <div class="z-index-0 text-center d-flex h-100 w-100 d-flex m-auto justify-content-left rounded">
                  <div class="mask bg-gradient-dark"></div>
                  <div class="p-5 col-12  position-relative text-start rounded">
                    <h3 class="text-white">Registračný formulár</h3>
                    <p class="text-white opacity-9 mb-4">Vyberte si prednášky, na ktorých sa chcete zúčastniť</p>

                    <div class="mb-3 custom-input">
                      <label class="text-white">Vyberte stage</label>
                      <select id="stageDropdown" class="form-control rounded-input text-white" v-model="selectedStage">
                        <option v-for="stage in stages" :key="stage.id" :value="stage.id" class="text-dark">{{ stage.name }}</option>
                      </select>
                    </div>

                    <div v-if="selectedStage" class="mb-3 custom-input">
                      <label class="text-white">Vyberte prednášku</label>
                      <select v-model="selectedLecture" class="form-control text-white" required>
                        <option
                            class="text-dark"
                            v-for="talk in timeSlots.filter(ts => ts.stage_id === selectedStage).map(ts => ts.talk)"
                            :key="talk.id"
                            :value="talk.id"
                        >
                          {{ talk.title }}
                        </option>
                      </select>
                    </div>

                    <div v-if="selectedLecture && speakerInfo" class="bg-white text-dark p-3 mt-3 rounded-3">
                      <h5>{{ getLectureTitle(selectedLecture) }}</h5>
                      <p class="text-secondary text-bold">{{ speakerInfo.first_name }} {{ speakerInfo.last_name }}</p>
                      <p>{{ getLectureDescription(selectedLecture) }}</p>
                      <p v-if="getLectureTime(selectedLecture)">
                        <strong>Čas:</strong> {{ getLectureTime(selectedLecture) }}
                      </p>
                      <div class="d-flex justify-content-end">
                        <MaterialButton
                            variant="gradient"
                            color="dark"
                            @click="addLecture(selectedLecture)"
                            class="mb-0 rounded-button"
                        >
                          Chcem sa zúčastniť
                        </MaterialButton>
                      </div>
                    </div>

                    <div v-if="conflictMessage" class="bg-danger text-white p-3 mt-3 rounded-container">
                      <p>{{ conflictMessage }}</p>
                      <div class="d-flex justify-content-end">
                        <button class="btn btn-danger rounded-button" @click="closeConflictMessage">
                          Zavrieť
                        </button>
                      </div>
                    </div>

                    <div class="bg-white text-dark p-3 mt-6 rounded-3">
                      <h5>Vybrané prednášky:</h5>
                      <ul v-if="chosenLectures.length">
                        <li
                            v-for="lecture in chosenLectures"
                            :key="lecture.id"
                            class="d-flex  align-items-center"
                        >
                          <p class="text-secondary text-bold">{{ getLectureTime(lecture.id) }}</p>
                          <p class="px-3">{{ lecture.title }}</p>
                          <div>
                            <button
                                class="btn btn-danger btn-sm rounded-button"
                                @click="removeLecture(lecture)"
                            >
                              Odstrániť
                            </button>
                          </div>
                        </li>
                      </ul>
                      <p v-else>Nemáte aktívne žiadne prednášky.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-5 ">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12 mb-3 p-2">
                      <div>
                        <form class="p-3" id="contact-form" @submit.prevent="register" role="form">
                          <div class="card-header px-4 py-sm-5 py-3">
                            <h2>Osobné údaje</h2>
                            <p class="lead">Vyplňte potrebné údaje. Ďalšie informácie Vám budú zaslané na zadanú e-mailovú adresu.</p>
                          </div>
                          <div class="card-body pt-1">
                            <div class="row">
                              <div class="mb-3 custom-input">
                                <input type="text" v-model="first_name" class="form-control" placeholder="Meno" required />
                              </div>
                              <div class="mb-3 custom-input">
                                <input type="text" v-model="last_name" class="form-control" placeholder="Priezvisko" required />
                              </div>
                              <div class="mb-3 custom-input">
                                <input type="email" v-model="email" class="form-control" placeholder="Email" required />
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6 text-center ms-auto">
                                <MaterialButton
                                    variant="gradient"
                                    color="dark"
                                    type="submit"
                                    class="mb-0"
                                >Registrovať</MaterialButton
                                >
                              </div>
                            </div>
                          </div>
                          <div v-if="successMessage" class="alert alert-dark mt-3 text-white" role="alert">
                            {{ successMessage }}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
</style>
