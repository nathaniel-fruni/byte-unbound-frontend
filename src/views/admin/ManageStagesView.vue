<script setup>
import Program from '@/views/public/sections/Program.vue';
import Stages from '@/views/admin/sections/Stages.vue'
</script>
<template class="">
  <div class="col-lg-12 bg-gradient-dark rounded-3 p-2 px-2 shadow-blur mb-3 text-center">
    <h3 class="text-white">Stage a časové okná</h3>
  </div>
  <div class="card card-body shadow-xl mx-3 mx-md-4 p-4 d-flex justify-content-center align-content-center">
    <div class="col">
      <h3 class="text-dark text-center">
        Program <span class="text-white"></span>
      </h3>
      <Program />
      <Stages />
    </div>
  </div>
</template>
