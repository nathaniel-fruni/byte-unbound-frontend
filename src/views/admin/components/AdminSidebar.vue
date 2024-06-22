<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const selectedItem = ref(0);

const logout = async () => {
  try {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

    await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/auth/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
    document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    router.push('/sign-in');
  } catch (error) {
    console.error('Odhlásenie neúspešné: ', error);
  }
};

const sidebarItems = ref([
  { text: 'Hlavný panel', route: 'dashboard', icon: 'fa-th' },
  { text: 'Povedali o nás', route: 'manage-testimonials', icon: 'fa-newspaper' },
  { text: 'Galéria', route: 'add-gallery', icon: 'fa-images' },
  { text: 'Speakers', route: 'manage-speakers', icon: 'fa-chalkboard-teacher' },
  { text: 'Prednášky', route: 'manage-talks', icon: 'fa-chalkboard' },
  { text: 'Stage', route: 'manage-stages', icon: 'fa-tv' },
  { text: 'Pridať obsah', route: 'add-content', icon: 'fa-code' },
  { text: 'Pridať admina', route: 'admin-registration', icon: 'fa-user-plus' },
  { text: 'Hlavná stránka', route: 'home', icon: 'fa-home' },
  { text: 'Odhlásiť sa', route: '', icon: 'fa-sign-out-alt', action: logout }
]);

const setSelectedItem = (index) => {
  selectedItem.value = index;
};

const resetToDefault = () => {
  setSelectedItem(0);
};

const updateSelectedItem = () => {
  const currentRoute = route.name;
  const foundIndex = sidebarItems.value.findIndex(item => item.route === currentRoute);
  if (foundIndex !== -1) {
    setSelectedItem(foundIndex);
  } else {
    resetToDefault();
  }
};

onMounted(() => {
  updateSelectedItem();
});

watch(route, () => {
  updateSelectedItem();
});

</script>

<template>

  <aside class="m-2 rounded-3 bg-gradient-dark">
    <nav >
      <ul class="list-unstyled">
        <li class="mt-3 pb-2 text-center options">
          <router-link class="text-white text-bold text-md" :to="{ name: 'dashboard' }" @click="resetToDefault">
            <i class="fas fa-terminal text-center"></i>
            <h3 class="text-white text-md mb-0">nConnect - Admin</h3>
          </router-link>
        </li>

        <li v-for="(item, index) in sidebarItems.slice(0, 7)" :key="index" class="py-2 m-lg-2 px-lg-3"
            :class="{ 'selected': selectedItem === index }" @click="setSelectedItem(index)">
          <router-link class="text-white text-md p-3" :to="{ name: item.route }">
            <i :class="['fas', item.icon, 'text-center', 'me-2']"></i>
            <span class="sidebar-text">{{ item.text }}</span>
          </router-link>
        </li>

        <li class="py-2 px-3 m-2 options">
          <h3 class="text-white text-md px-3 me-2 sidebar-text options ">Možnosti</h3>
        </li>

        <li v-for="(item, index) in sidebarItems.slice(7, 10)" :key="index" class="py-2 m-lg-2 px-lg-3"
            :class="{ 'selected': selectedItem === index + 7 }" @click="setSelectedItem(index + 7)">
          <router-link v-if="item.route" class="text-white text-sm p-3" :to="{ name: item.route }">
            <i :class="['fas', item.icon, 'text-center', 'me-2']"></i>
            <span class="sidebar-text">{{ item.text }}</span>
          </router-link>
          <a v-else class="text-white text-sm p-3" @click="() => { setSelectedItem(9); item.action(); }">
            <i :class="['fas', item.icon, 'text-center', 'me-2']"></i>
            <span class="sidebar-text">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
aside {
  width: 250px;
  position: fixed;
  height: calc(100% - 20px);
  background-color: #333;
}

li {
  border-radius: 10px;
}

li.selected {
  background-color: rgba(255, 255, 255, 0.1);
}


li:not(.options):hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.li .options {
  pointer-events: none;
}
.options:hover {
  background-color: transparent !important;
  pointer-events: none;
}

@media (max-width: 768px) {
  aside {
    width: 60px;
  }

  .sidebar-text {
    display: none;
  }

  .fa-terminal {
    display: none;
  }

  .mt-3.pb-2.text-center h3 {
    display: none;
  }

  .list-unstyled {
    text-align: center;
  }

  li i {
    margin-right: 0;
  }
}
</style>
