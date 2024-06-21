<script setup>
import AdminSidebar from '@/views/admin/components/AdminSidebar.vue';
import { onMounted, onUnmounted } from 'vue'

const body = document.getElementsByTagName("body")[0];

onMounted(async () => {
  body.classList.add("bg-gray-200");
});

onUnmounted(() => {
  body.classList.remove("bg-gray-200");
});
</script>
<template>
  <div>
    <AdminSidebar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>
<style scoped>
.main-content {
  margin-left: 250px;
  padding: 20px;
}
@media (max-width: 768px) {
  .main-content {
    margin-left: 70px;

  }
}
</style>
