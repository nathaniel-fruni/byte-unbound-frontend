<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  title: String,
  metricValue: Number,
  percentageDifference: Number,
  iconClass: String,
  avatarClass: String,
});

const percentageClass = computed(() => {
  return {
    'text-success': props.percentageDifference >= 0,
    'text-danger': props.percentageDifference < 0,
  };
});

const formattedDifference = computed(() => {
  const prefix = props.percentageDifference >= 0 ? '+' : '-';
  return `${prefix}${Math.abs(props.percentageDifference)}%`;
});
</script>

<template>
  <div class="col-lg-3 col-md-6 mb-4 mt-1 p-3">
    <div class="card bg-white card-body shadow-xl card-plain" style="height: 100%;">
      <div class="card-body d-flex flex-column justify-content-between">
        <div class="d-flex justify-content-start">
          <div :class="['mt-n5 avatar avatar-lg border-radius-lg shadow', avatarClass]">
            <i :class="[iconClass, 'text-white']" style="font-size: 24px;"></i>
          </div>
        </div>
        <div>
          <h6 class="mb-0 text-secondary text-end">{{ title }}</h6>
          <h3 class="text-dark text-end">{{ metricValue }}</h3>
          <hr>
          <p :class="[percentageClass, 'mb-0', 'text-end']">{{ formattedDifference }} <span class="text-secondary">ako minulý rok</span></p>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.card {
  border-radius: 15px;
}
.avatar {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 0.5rem 0;
}
</style>
