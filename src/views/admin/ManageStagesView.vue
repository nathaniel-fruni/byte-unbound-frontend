<script setup>
import Stages from '@/views/admin/sections/Stages.vue'
import TimeSlots from '@/views/admin/sections/TimeSlots.vue'
</script>
<template class="">
  <div class="col-lg-12 bg-gradient-dark rounded-3 p-2 px-2 shadow-blur mb-3 text-center">
    <h3 class="text-white">Stage a časové okná</h3>
  </div>

  <div class="d-lg-flex d-sm-block">
    <div class="col-lg-8 col-md-12 mb-4">
      <TimeSlots />
    </div>
    <div class="col-lg-4 col-md-12 mb-4">
      <Stages />
    </div>
  </div>
</template>