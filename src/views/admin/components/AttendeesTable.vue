<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const conferences = ref([]);
const selectedConferenceId = ref(null);
const activeUser = ref(null);

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  const formattedDate = new Intl.DateTimeFormat('sk-SK').format(date).replace(/-/g, '.');
  return formattedDate;
};

const fetchConferences = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + "/api/get-conferences"
    );
    conferences.value = response.data;
    if (conferences.value.length > 0) {
      selectedConferenceId.value = conferences.value[conferences.value.length-1].id;
      await fetchUsers();
    }
  } catch (error) {
    console.error("Error fetching conferences data:", error);
  }
};

const fetchUsers = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_ENDPOINT + `/api/get-users/${selectedConferenceId.value}`
    );
    users.value = response.data;
    activeUser.value = null;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const handleConferenceChange = async (event) => {
  selectedConferenceId.value = event.target.value;
  await fetchUsers();
};

const toggleActiveUser = (user) => {
  activeUser.value = activeUser.value === user ? null : user;
};

onMounted(async () => {
  await fetchConferences();
});
</script>

<template>
  <section>
    <div class="container-fluid px-3">
      <div class="row justify-content-center">
        <div class="container mb-4 card card-body shadow-xl mx-3 mx-md-4 p-4 d-flex justify-content-center align-content-center">
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

          <div class="col-lg-12 text">
            <div class="card card-body bg-gradient-white shadow-dark rounded-3">
              <div class="table-responsive">
                <table class="table align-items-center text-center">
                  <thead>
                  <tr class="d-none d-lg-table-row">
                    <th class="col-lg-4 text-sm text-uppercase">Meno</th>
                    <th class="col-lg-4 text-sm text-uppercase">Počet prednášok</th>
                    <th class="col-lg-4 text-sm text-uppercase">Registrácia</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="user in users" :key="user.id">
                    <tr @click="toggleActiveUser(user)" style="cursor: pointer;">
                      <td>
                        <p class="text-dark text-bold m-0">{{ user.first_name + " " + user.last_name }}</p>
                        <p class="text-sm">{{user.email}}</p>
                      </td>
                      <td>{{user.registration.length}}</td>
                      <td class="text-dark">{{formatDateTime(user.registration[0].registered_at)}}</td>
                    </tr>
                    <template v-if="activeUser === user">
                      <tr v-for="registration in user.registration" :key="registration.id">
                        <td colspan="4" class="text-center">
                          <div>
                            <p class="text-wrap text-bold text-uppercase text-sm mb-2">Registrované prednášky</p>
                            <p class="text-wrap text-sm">
                              {{ registration.talk.title }}
                              <i v-if="registration.attended === 1" class="fas fa-check text-success px-2"></i>
                              <i v-else class="fas fa-times text-danger px-2"></i>
                            </p>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container-fluid {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

.row {
  margin-right: 0;
  margin-left: 0;
}

.container {
  max-width: 100%;
}

.btn-group {
  display: flex;
  justify-content: center;
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
