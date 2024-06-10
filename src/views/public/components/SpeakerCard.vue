<script setup>
import { defineProps, defineEmits, ref } from "vue";
import MaterialButton from "@/components/MaterialButton.vue";

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  profile: {
    type: Object,
    required: true,
  },
  position: {
    type: Object,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  long_description: {
    type: String,
    required: true,
  },
});

const emitEvent = defineEmits(['show-modal', 'close-modal']);

const MAX_DESCRIPTION_LENGTH = 100;

const truncatedDescription = ref(
    props.short_description.slice(0, MAX_DESCRIPTION_LENGTH)
);
const isDescriptionOverflowed = ref(
    props.short_description.length > MAX_DESCRIPTION_LENGTH
);

const handleShowMore = () => {
  emitEvent('close-modal');
  const fullDescription = `${props.short_description}<br>${props.long_description}`;
  const speakerDetails = {
    name: props.profile.name,
    description: fullDescription,
    firstName: props.profile.name.split(' ')[0], // Extracting the first name
    lastName: props.profile.name.split(' ')[1] // Extracting the last name
  };
  emitEvent('show-modal', speakerDetails);
};
</script>

<template>
  <div class="card card-profile m-4 ">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-12 mt-n4">
        <a :href="profile.link">
          <div class="p-3 pe-md-0">
            <img
                class="w-100 border-radius-md shadow-lg"
                :src="image"
                :alt="profile.name"
            />
          </div>
        </a>
      </div>
      <div class="col-lg-8 col-md-6 col-12 my-auto">
        <div class="card-body ps-lg-0">
          <h5 class="mb-0">{{ profile.name }}</h5>
          <h6 :class="`text-${position.color}`">{{ position.label }}</h6>
          <p class="mb-0">
            {{ truncatedDescription }}...
            <span v-if="isDescriptionOverflowed">
              <MaterialButton
                  variant="gradient"
                  color="dark"
                  size="sm"
                  @click="handleShowMore"
              >
                Viac o mne
              </MaterialButton>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
