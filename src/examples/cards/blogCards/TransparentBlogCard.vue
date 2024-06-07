<script setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="card card-plain">
    <div class="card-header p-0 position-relative">
      <a class="d-block blur-shadow-image">
        <img
          :src="image"
          :alt="name"
          class="img-fluid shadow border-radius-lg card-img"
          loading="lazy"
        />
      </a>
    </div>
    <div class="card-body px-0">
      <h5>
        <a class="text-dark font-weight-bold">{{ name }}</a>
      </h5>
      <h6>
        <a class="text-dark font-weight-bold">Organizátor</a>
      </h6>
      <p class="contact-info">{{ phone }}</p>
      <p class="contact-info">{{ email }}</p>
    </div>
  </div>
</template>

<style scoped>
.card-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 0.5rem;
}
.contact-info {
  margin: 0;
}
</style>
