<script setup>
import AttendeesTable from '@/views/admin/components/AttendeesTable.vue'
import CreateSponsor from '@/views/admin/sections/CreateSponsor.vue'
</script>

<template>

  <div class="d-lg-flex d-sm-block">
    <div class="col-8">
      <h3 class="text-center"><i class="fas fa-users me-2"></i>Zoznam účatníkov</h3>
      <AttendeesTable />
    </div>
    <div class="col-4 ">
      <h3 class="text-center"><i class="fas fa-handshake me-2"></i>Sponzori</h3>
      <CreateSponsor />
    </div>
  </div>

</template>

<style scoped>

</style>