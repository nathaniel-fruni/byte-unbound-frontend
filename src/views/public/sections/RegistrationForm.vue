<script setup>
import { ref, onMounted, watch } from "vue";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";

// image
import bgContact from "@/assets/img/examples/blog2.jpg";

// tooltip
import setTooltip from "@/assets/js/tooltip";

// store
import { useAppStore } from "@/stores";
const store = useAppStore();

const selectedStage = ref("");
const selectedLecture1 = ref("");
const selectedLecture2 = ref("");
const lectureInfo1 = ref("");
const lectureInfo2 = ref("");
const chosenLectures = ref([]);
const conflictMessage = ref("");

const lectures = {
  lecture1: { name: "Prednáška 1", info: "This is the information for Prednáška 1.", time: "11:00 - 12:00" },
  lecture2: { name: "Prednáška 2", info: "This is the information for Prednáška 2.", time: "11:00 - 12:00" },
  lecture3: { name: "Prednáška 3", info: "This is the information for Prednáška 3.", time: "12:00 - 13:00" },
  lecture4: { name: "AI Stage", info: "This is the information for AI Stage.", time: "12:00 - 13:00" },
  lecture5: { name: "Data Stage", info: "This is the information for Data Stage.", time: "14:00 - 15:00" },
  lecture6: { name: "Extra Stage", info: "This is the information for Extra Stage.", time: "15:00 - 16:00" },
  lecture7: { name: "Special Stage", info: "This is the information for Special Stage.", time: "16:00 - 17:00" },
  lecture8: { name: "Advanced Stage", info: "This is the information for Advanced Stage.", time: "17:00 - 18:00" },
};

watch(selectedLecture1, (newValue) => {
  if (!chosenLectures.value.some((lecture) => lecture.name === lectures[newValue]?.name)) {
    lectureInfo1.value = newValue ? lectures[newValue]?.info : "";
  } else {
    lectureInfo1.value = "";
  }
});

watch(selectedLecture2, (newValue) => {
  if (!chosenLectures.value.some((lecture) => lecture.name === lectures[newValue]?.name)) {
    lectureInfo2.value = newValue ? lectures[newValue]?.info : "";
  } else {
    lectureInfo2.value = "";
  }
});

const hasTimeConflict = (newLecture) => {
  const newLectureTime = lectures[newLecture]?.time;
  return chosenLectures.value.some((lecture) => lecture.time === newLectureTime);
};

const addLecture = (lecture) => {
  if (lecture && !chosenLectures.value.some((l) => l.name === lectures[lecture]?.name)) {
    if (hasTimeConflict(lecture)) {
      conflictMessage.value = `Nemôžete pridať prednášku ${lectures[lecture].name}, pretože už máte inú prednášku v tom čase.`;
    } else {
      chosenLectures.value.push(lectures[lecture]);
      lectureInfo1.value = "";
      lectureInfo2.value = "";
      conflictMessage.value = "";
      if (selectedLecture1.value === lecture) selectedLecture1.value = "";
      if (selectedLecture2.value === lecture) selectedLecture2.value = "";
    }
  }
};

const removeLecture = (lecture) => {
  chosenLectures.value = chosenLectures.value.filter((l) => l !== lecture);
};

const closeConflictMessage = () => {
  conflictMessage.value = "";
};

onMounted(() => {
  setTooltip(store.bootstrap);
});
</script>



<template>
  <section class="py-lg-5">
    <div class="container rounded-container">
      <div class="row">
        <div class="col">
          <div class="card box-shadow-xl overflow-hidden mb-5 rounded">
            <div class="row">
              <div
                  class="col-lg-5 position-relative bg-cover px-0 rounded-container"
                  :style="{ backgroundImage: `url(${bgContact})` }"
                  loading="lazy"
              >
                <div class="z-index-2 text-center d-flex h-100 w-100 d-flex m-auto justify-content-center rounded">
                  <div class="mask bg-gradient-dark opacity-5 rounded"></div>
                  <div class="p-5 ps-sm-8 position-relative text-start my-auto z-index-2 rounded">
                    <h3 class="text-white">Registračný formulár</h3>
                    <p class="text-white opacity-8 mb-4">
                      Vyberte si prednášky na ktorých sa chcete zúčastniť
                    </p>

                    <div class="row">
                      <div class="col-md-12 mb-3">
                        <label class="text-white opacity-8" for="stageDropdown">Vyberte Stage</label>
                        <select id="stageDropdown" class="form-control rounded-input" v-model="selectedStage">
                          <option value="">Vyberte Stage</option>
                          <option value="softDevStage">Soft Dev Stage</option>
                          <option value="aiDataStage">AI and Data Stage</option>
                        </select>
                      </div>
                    </div>

                    <div class="row">
                      <div v-if="selectedStage === 'softDevStage'" class="col-md-12 mb-3">
                        <label class="text-white opacity-8" for="dropdown1">Vyberte prednášku</label>
                        <select id="dropdown1" class="form-control rounded-input" v-model="selectedLecture1">
                          <option value="">Vyberte prednášku</option>
                          <option value="lecture1">Prednáška 1</option>
                          <option value="lecture2">Prednáška 2</option>
                          <option value="lecture3">Prednáška 3</option>
                        </select>
                      </div>

                      <div v-if="selectedStage === 'aiDataStage'" class="col-md-12 mb-3">
                        <label class="text-white opacity-8" for="dropdown2">AI and Data Stage</label>
                        <select id="dropdown2" class="form-control rounded-input" v-model="selectedLecture2">
                          <option value="">Vyberte prednášku</option>
                          <option value="lecture4">AI Stage</option>
                          <option value="lecture5">Data Stage</option>
                          <option value="lecture6">Extra Stage</option>
                          <option value="lecture7">Special Stage</option>
                          <option value="lecture8">Advanced Stage</option>
                        </select>
                      </div>
                    </div>

                    <div v-if="selectedLecture1 && lectureInfo1" class="bg-white text-dark p-3 mt-3 rounded-container">
                      <p>{{ lectureInfo1 }}</p>
                      <p>{{ lectures[selectedLecture1].time }}</p>
                      <div class="d-flex justify-content-end">
                        <MaterialButton
                            variant="gradient"
                            color="success"
                            @click="addLecture(selectedLecture1)"
                            class="mb-0 rounded-button"
                        >
                          Chcem sa zúčastniť
                        </MaterialButton>
                      </div>
                    </div>

                    <div v-if="selectedLecture2 && lectureInfo2" class="bg-white text-dark p-3 mt-3 rounded-container">
                      <p>{{ lectureInfo2 }}</p>
                      <p>{{ lectures[selectedLecture2].time }}</p>
                      <div class="d-flex justify-content-end">
                        <MaterialButton
                            variant="gradient"
                            color="success"
                            @click="addLecture(selectedLecture2)"
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
                          Rozumiem
                        </button>
                      </div>
                    </div>

                    <!-- Green Block -->
                    <div class="bg-white text-dark p-3 mt-8 rounded-container">
                      <h5>Vybrané prednášky:</h5>
                      <ul v-if="chosenLectures.length">
                        <li
                            v-for="lecture in chosenLectures"
                            :key="lecture.name"
                            class="d-flex justify-content-between align-items-center"
                        >
                          <div>{{ lecture.name }}
                          <p>{{ lecture.time }}</p></div>
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
              <div class="col-lg-7">
                <form class="p-3" id="contact-form" method="post">
                  <div class="card-header px-4 py-sm-5 py-3 rounded">
                    <h2>Osobné údaje</h2>
                    <p class="lead">
                      Prosím vyplnite všetky polia ďalšie informácie vám budú
                      zaslané na e-mailovú adresu
                    </p>
                  </div>
                  <div class="card-body pt-1">
                    <div class="row">
                      <div class="col-md-12 pe-2 mb-3">
                        <MaterialInput
                            class="input-group-static mb-4 rounded-input"
                            label="Meno"
                            type="text"
                            placeholder="Meno"
                        />
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <MaterialInput
                            class="input-group-static mb-4 rounded-input"
                            label="Priezvisko"
                            type="text"
                            placeholder="Priezvisko"
                        />
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <MaterialInput
                            class="input-group-static mb-4 rounded-input"
                            label="E-mail"
                            type="email"
                            placeholder="E-mail"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>




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
