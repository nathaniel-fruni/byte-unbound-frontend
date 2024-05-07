<script setup>
import { defineProps, ref } from "vue";
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
});

const MAX_DESCRIPTION_LENGTH = 100;

const truncatedDescription = ref(
  props.short_description.slice(0, MAX_DESCRIPTION_LENGTH)
);
const isDescriptionOverflowed = ref(
  props.short_description.length > MAX_DESCRIPTION_LENGTH
);

</script>

<template>
  <div class="card card-profile">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-12 mt-n5">
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
            {{ truncatedDescription }}
            <span v-if="isDescriptionOverflowed">
        <MaterialButton
          variant="gradient"
          color="dark"
          size="sm"

          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Viac o mne
        </MaterialButton>

              <!-- Modal -->
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Your modal title
                </h5>
                <MaterialButton
                  color="none"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                </MaterialButton>
              </div>
              <div class="modal-body">
                Society has put up so many boundaries, so many limitations on
                what’s right and wrong that it’s almost impossible to get a pure
                thought out.
                <br /><br />
                It’s like a little kid, a little boy, looking at colors, and no
                one told him what colors are good, before somebody tells you you
                shouldn’t like pink because that’s for girls, or you’d instantly
                become a gay two-year-old.
              </div>
              <div class="modal-footer justify-content-end">
                <MaterialButton
                  variant="gradient"
                  color="dark"
                  data-bs-dismiss="modal"
                >
                  Zavrieť
                </MaterialButton>
              </div>
            </div>
          </div>
        </div>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
