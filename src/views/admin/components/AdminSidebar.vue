<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'

const router = useRouter();

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
  { text: 'Speakers', route: '', icon: 'fa-chalkboard-teacher' },
  { text: 'Stage', route: '', icon: 'fa-tv' },
  { text: 'Prednášky', route: '', icon: 'fa-chalkboard' },
  { text: 'Povedali o nás', route: '', icon: 'fa-newspaper' },
  { text: 'Galéria', route: '', icon: 'fa-images' },
  { text: 'Pridať sponzora', route: '', icon: 'fa-handshake' },
  { text: 'Pridať obsah', route: '', icon: 'fa-code' },
  { text: 'Zoznam účastníkov', route: '', icon: 'fa-users' }
]);
</script>

<template>
  <aside class="m-2 rounded-3 bg-gradient-dark">
    <nav>
      <ul class="list-unstyled">
        <li class="mt-3 pb-2 text-center">
          <router-link class="text-white text-bold text-md" :to="{ name: 'dashboard' }">
            <i class="fas fa-terminal text-center"></i>
            <h3 class="text-white text-md mb-0">byteUnbound - Admin</h3>
          </router-link>
        </li>

        <li class="py-2 px-lg-3 m-lg-2">
          <router-link class="text-white text-md m-3 me-2" :to="{ name: 'dashboard' }">
            <i class="fas fa-pager text-center me-2"></i>
            <span class="sidebar-text">Hlavný panel</span>
          </router-link>
        </li>

        <li v-for="(item, index) in sidebarItems" :key="index" class="py-2 m-lg-2 px-lg-3">
          <router-link class="text-white text-md p-3" :to="{ name: item.route }">
            <i :class="['fas', item.icon, 'text-center', 'me-2']"></i>
            <span class="sidebar-text">{{ item.text }}</span>
          </router-link>
        </li>

        <li class="py-2 px-3 m-2">
          <h3 class="text-white text-md px-3 me-2 sidebar-text">Možnosti</h3>
        </li>
        <li class="py-2 px-lg-3 m-lg-2">
          <router-link class="text-white text-sm p-3" :to="{ name: '' }">
            <i class="fas fa-user-plus text-center me-2"></i>
            <span class="sidebar-text">Pridať admina</span>
          </router-link>
        </li>
        <li class="py-2 px-lg-3 m-lg-2">
          <router-link class="text-white text-sm p-3" :to="{ name: 'home' }">
            <i class="fas fa-home text-center me-2"></i>
            <span class="sidebar-text">Hlavná stránka</span>
          </router-link>
        </li>
        <li class="py-2 px-lg-3 m-lg-2">
          <a class="text-white text-sm p-3" @click="logout">
            <i class="fas fa-sign-out-alt me-2"></i>
            <span class="sidebar-text">Odhlásiť sa</span>
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

li:not(:first-child):not(:nth-last-child(-n+4)):hover,
li:nth-last-child(-n+3):hover {
  background-color: rgba(255, 255, 255, 0.1);
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
