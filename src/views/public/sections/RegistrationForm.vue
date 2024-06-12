<script setup>
import { ref, onMounted, watch } from "vue";
// Vue Material Kit 2 components
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialTextArea from "@/components/MaterialTextArea.vue";

// image
import bgContact from "@/assets/img/examples/blog2.jpg";

// tooltip
import setTooltip from "@/assets/js/tooltip";

// store
import { useAppStore } from "@/stores";
const store = useAppStore();

const selectedLecture1 = ref("");
const selectedLecture2 = ref("");
const lectureInfo1 = ref("");
const lectureInfo2 = ref("");
const chosenLectures = ref([]); // Define as reactive ref array

const lectures = {
  lecture1: { name: "Prednáška 1", info: "This is the information for Prednáška 1." },
  lecture2: { name: "Prednáška 2", info: "This is the information for Prednáška 2." },
  lecture3: { name: "Prednáška 3", info: "This is the information for Prednáška 3." },
  lecture4: { name: "AI Stage", info: "This is the information for AI Stage." },
  lecture5: { name: "Data Stage", info: "This is the information for Data Stage." },
  lecture6: { name: "Extra Stage", info: "This is the information for Extra Stage." },
  lecture7: { name: "Special Stage", info: "This is the information for Special Stage." },
  lecture8: { name: "Advanced Stage", info: "This is the information for Advanced Stage." },
};

watch(selectedLecture1, (newValue) => {
  lectureInfo1.value = newValue ? lectures[newValue].info : "";
});

watch(selectedLecture2, (newValue) => {
  lectureInfo2.value = newValue ? lectures[newValue].info : "";
});

const addLecture = (lecture) => {
  if (lecture && !chosenLectures.value.includes(lecture)) {
    chosenLectures.value.push(lectures[lecture]); // Push the lecture object, not just the ID
    // Clearing lecture info after adding it to the list
    lectureInfo1.value = "";
    lectureInfo2.value = "";
  }
};

const removeLecture = (lecture) => {
  chosenLectures.value = chosenLectures.value.filter((l) => l !== lecture);
};

onMounted(() => {
  setTooltip(store.bootstrap);
});
</script>




<template>
  <section class="py-lg-5">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="card box-shadow-xl overflow-hidden mb-5">
            <div class="row">
              <div
                  class="col-lg-5 position-relative bg-cover px-0"
                  :style="{ backgroundImage: `url(${bgContact})` }"
                  loading="lazy"
              >
                <div class="z-index-2 text-center d-flex h-100 w-100 d-flex m-auto justify-content-center">
                  <div class="mask bg-gradient-dark opacity-5"></div>
                  <div class="p-5 ps-sm-8 position-relative text-start my-auto z-index-2">
                    <h3 class="text-white">Registračný formulár</h3>
                    <p class="text-white opacity-8 mb-4">
                      Vyberte si prednášky na ktorých sa chcete zúčastniť
                    </p>

                    <!-- Row for dropdowns -->
                    <div class="row">
                      <!-- Dropdown 1 -->
                      <div class="col-md-6 mb-3">
                        <label class="text-white opacity-8" for="dropdown1">Soft Dev Stage</label>
                        <select id="dropdown1" class="form-control" v-model="selectedLecture1">
                          <option value="">Vyberte prednášku</option>
                          <option value="lecture1">Prednáška 1</option>
                          <option value="lecture2">Prednáška 2</option>
                          <option value="lecture3">Prednáška 3</option>
                        </select>
                      </div>
                      <!-- Dropdown 2 -->
                      <div class="col-md-6 mb-3">
                        <label class="text-white opacity-8" for="dropdown2">AI and Data Stage</label>
                        <select id="dropdown2" class="form-control" v-model="selectedLecture2">
                          <option value="">Vyberte prednášku</option>
                          <option value="lecture4">AI Stage</option>
                          <option value="lecture5">Data Stage</option>
                          <option value="lecture6">Extra Stage</option>
                          <option value="lecture7">Special Stage</option>
                          <option value="lecture8">Advanced Stage</option>
                        </select>
                      </div>
                    </div>

                    <!-- Lecture information -->
                    <div v-if="selectedLecture1 && lectureInfo1" class="bg-white text-dark p-3 mt-3">
                      <p>{{ lectureInfo1 }}</p>
                      <div class="d-flex justify-content-end">
                        <MaterialButton
                            variant="gradient"
                            color="success"
                            @click="addLecture(selectedLecture1)"
                            class="mb-0"
                        >
                          Chcem sa zúčastniť
                        </MaterialButton>
                      </div>
                    </div>

                    <div v-if="selectedLecture2 && lectureInfo2" class="bg-white text-dark p-3 mt-3">
                      <p>{{ lectureInfo2 }}</p>
                      <div class="d-flex justify-content-end">
                        <MaterialButton
                            variant="gradient"
                            color="success"
                            @click="addLecture(selectedLecture2)"
                            class="mb-0"
                        >
                          Chcem sa zúčastniť
                        </MaterialButton>
                      </div>
                    </div>


                    <div v-if="chosenLectures.length" class="bg-white text-dark p-3 mt-3">
                      <h5>Vybrané prednášky:</h5>
                      <ul>
                        <li v-for="lecture in chosenLectures" :key="lecture" class="d-flex justify-content-between align-items-center">
                          <div>{{ lecture.name }}</div>
                          <div>
                            <button class="btn btn-danger btn-sm" @click="removeLecture(lecture)">Odstrániť</button>
                          </div>
                        </li>
                      </ul>
                    </div>



                  </div>
                </div>
              </div>
              <div class="col-lg-7">
                <form class="p-3" id="contact-form" method="post">
                  <div class="card-header px-4 py-sm-5 py-3">
                    <h2>Say Hi!</h2>
                    <p class="lead">We'd like to talk with you.</p>
                  </div>
                  <div class="card-body pt-1">
                    <div class="row">
                      <div class="col-md-12 pe-2 mb-3">
                        <MaterialInput
                            class="input-group-static mb-4"
                            label="My name is"
                            type="text"
                            placeholder="Full Name"
                        />
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <MaterialInput
                            class="input-group-static mb-4"
                            label="I'm looking for"
                            type="text"
                            placeholder="What you love"
                        />
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <MaterialTextArea
                            class="input-group-static mb-4"
                            placeholder="I want to say that..."
                            :rows="6"
                        >
                          Your message
                        </MaterialTextArea>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6 text-end ms-auto">
                        <MaterialButton
                            variant="gradient"
                            color="success"
                            type="submit"
                            class="mb-0"
                        >
                          Send Message
                        </MaterialButton>
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
