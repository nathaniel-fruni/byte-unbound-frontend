<template>
  <section class="">
    <div class="rounded-container  ">
      <div class="row">
        <div class="col">
          <div class="card box-shadow-xl overflow-hidden mb-5 rounded pb-3">
            <div class="row">
              <div class="col-lg-6 position-relative bg-cover px-0 rounded-container m-5 p-5" loading="lazy">
                <div class="z-index-0 text-center d-flex h-100 w-100 d-flex m-auto justify-content-left rounded">
                  <div class="mask bg-gradient-dark opacity-8 "></div>
                  <div class="p-5  position-relative text-start rounded">
                    <h3 class="text-white">Registračný formulár</h3>
                    <p class="text-white opacity-9 mb-4">Vyberte si prednášky, na ktorých sa chcete zúčastniť</p>
                    <div class="row">
                      <div class="col-lg-12 col-md-12 mb-3">
                        <label class="text-white opacity-8 " for="stageDropdown">Vyberte Stage</label>
                        <select id="stageDropdown" class="form-control rounded-input" v-model="selectedStage">
                          <option value="">Vyberte Stage</option>
                          <option v-for="stage in stages" :key="stage.id" :value="stage.id">{{ stage.name }}</option>
                        </select>
                      </div>
                    </div>

                    <div v-if="selectedStage" class="col-md-12 mb-3">
                      <label class="text-white opacity-8" for="dropdown">Vyberte prednášku</label>
                      <select id="dropdown" class="form-control rounded-input" v-model="selectedLecture">
                        <option value="">Vyberte prednášku</option>
                        <option
                            v-for="talk in timeSlots.filter(ts => ts.stage_id === selectedStage).map(ts => ts.talk)"
                            :key="talk.id"
                            :value="talk.id"
                        >
                          {{ talk.title }}
                        </option>
                      </select>
                    </div>

                    <div v-if="selectedLecture && speakerInfo" class="bg-white text-dark p-3 mt-3 rounded-container">
                      <h5>{{ speakerInfo.first_name }} {{ speakerInfo.last_name }}</h5>
                      <p>{{ getLectureTitle(selectedLecture) }}</p>
                      <p>{{ getLectureDescription(selectedLecture) }}</p>
                      <p v-if="getLectureTime(selectedLecture)">
                        <strong>Time:</strong> {{ getLectureTime(selectedLecture) }}
                      </p>
                      <div class="d-flex justify-content-end">

                        <MaterialButton
                            variant="gradient"
                            color="success"
                            @click="addLecture(selectedLecture)"
                            class="mb-0 rounded-button"
                        >
                          Chcem sa zúčastniť
                        </MaterialButton>
                      </div>
                    </div>

                    <!-- Red Block -->
                    <div v-if="conflictMessage" class="bg-danger text-white p-3 mt-3 rounded-container">
                      <p>{{ conflictMessage }}</p>
                      <div class="d-flex justify-content-end">
                        <button class="btn btn-danger rounded-button" @click="closeConflictMessage">
                          Zavrieť
                        </button>
                      </div>
                    </div>

                    <!-- Green Block -->
                    <div class="bg-white text-dark p-3 mt-8 rounded-container">
                      <h5>Vybrané prednášky:</h5>
                      <ul v-if="chosenLectures.length">
                        <li
                            v-for="lecture in chosenLectures"
                            :key="lecture.id"
                            class="d-flex justify-content-between align-items-center"
                        >
                          <div>{{ lecture.title }}</div>
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

              <!-- Adjusted form section -->
              <div class="col-lg-5  bg-gradient-dark opacity-8 rounded">
                <form class="p-3" id="contact-form" method="post">
                  <div class="card-header px-4 py-sm-5 py-3 rounded">
                    <h2>Osobné údaje</h2>
                    <p class="lead">
                      Prosím vyplňte všetky polia. Ďalšie informácie vám budú zaslané na e-mailovú adresu.
                    </p>
                  </div>
                  <div class="card-body pt-1">
                    <div class="row">
                      <div class="col-md-12 pe-2 mb-3">
                        <!-- Form fields for personal data -->
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <!-- End adjusted form section -->

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>



<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import MaterialButton from "@/components/MaterialButton.vue";

const selectedStage = ref("");
const selectedLecture = ref("");
const lectureInfo = ref("");
const chosenLectures = ref([]);
const conflictMessage = ref("");
const stages = ref([]);
const talks = ref([]);
const timeSlots = ref([]);
const speakerInfo = ref(null);

// Function to fetch speaker information
const fetchSpeakerInfo = async (speakerId) => {
  try {
    const response = await axios.get(`http://localhost/projekt_backend/byte-unbound-backend/public/api/get-speaker-byId/${speakerId}`);
    speakerInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching speaker info:", error);
  }
};

// Watch for changes in selectedLecture and fetch speaker info accordingly
watch(selectedLecture, async (newValue) => {
  if (newValue) {
    const lecture = talks.value.find(t => t.id === newValue);
    if (lecture) {
      await fetchSpeakerInfo(lecture.speaker_id); // Assuming speaker_id is available in the talks data
    }
    lectureInfo.value = getLectureDescription(newValue);
  } else {
    lectureInfo.value = "";
    speakerInfo.value = null;
  }
});

// Function to check if lecture has time conflict
const hasTimeConflict = (newLecture) => {
  const newLectureSlot = timeSlots.value.find(ts => ts.talk_id === newLecture);
  return chosenLectures.value.some((lecture) => {
    const chosenSlot = timeSlots.value.find(ts => ts.talk_id === lecture.id);
    return newLectureSlot.start_time === chosenSlot.start_time;
  });
};

// Function to add a lecture to chosenLectures
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

// Function to remove a lecture from chosenLectures
const removeLecture = (lecture) => {
  chosenLectures.value = chosenLectures.value.filter((l) => l.id !== lecture.id);
};

// Function to close conflict message
const closeConflictMessage = () => {
  conflictMessage.value = "";
  // Reset other relevant states as needed
  lectureInfo.value = "";
  selectedLecture.value = "";
};

// Function to fetch stages from API
const fetchStages = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-stages`);
    stages.value = response.data;
  } catch (error) {
    console.error("Error fetching stages:", error);
  }
};

// Function to fetch talks from API
const fetchTalks = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-talks`);
    talks.value = response.data;
  } catch (error) {
    console.error("Error fetching talks:", error);
  }
};

// Function to fetch time slots from API
const fetchTimeSlots = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/get-timeSlots`);
    timeSlots.value = response.data;
  } catch (error) {
    console.error("Error fetching time slots:", error);
  }
};

// Function to get lecture description
const getLectureDescription = (lectureId) => {
  const lecture = talks.value.find(t => t.id === lectureId);
  return lecture ? lecture.description : "";
};

// Function to get lecture time
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

// Function to get lecture title
const getLectureTitle = (lectureId) => {
  const lecture = talks.value.find(t => t.id === lectureId);
  return lecture ? lecture.title : "";
};

// Lifecycle hook to fetch data on component mount
onMounted(async () => {
  try {
    await fetchStages();
    await fetchTalks();
    await fetchTimeSlots();
  } catch (error) {
    console.error("Error during onMounted lifecycle:", error);
  }
});
</script>

<style scoped>
.rounded {
  border-radius: 1rem !important;
}
.rounded-container {
  border-radius: 1rem !important;
}
.rounded-button {
  border-radius: 2rem !important;
}
</style>
