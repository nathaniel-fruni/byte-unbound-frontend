<script setup>
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../../../assets/js/useWindowsWidth";

const props = defineProps({
  transparent: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  darkText: {
    type: Boolean,
    default: false
  }
});

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value == false) {
  textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);
</script>
<template>
  <nav
    class="navbar navbar-expand-lg top-0"
    :class="{
      'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
        props.transparent,
      'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
        props.sticky,
      'navbar-light bg-white py-3': props.light,
      ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
    }"
  >
    <div
      :class="
        props.transparent || props.light || props.dark
          ? 'container'
          : 'container-fluid px-0'
      "
    >
      <RouterLink
        class="navbar-brand d-none d-md-block"
        :class="[
          (props.transparent && textDark.value) || !props.transparent
            ? 'text-dark font-weight-bolder ms-sm-3'
            : 'text-white font-weight-bolder ms-sm-3'
        ]"
        :to="{ name: 'home' }"
        rel="tooltip"
        title="Designed and Coded by Creative Tim"
        data-placement="bottom"
      >
        byteUnbound
      </RouterLink>
      <button
        class="navbar-toggler shadow-none ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div
        class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0"
        id="navigation"
      >
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li class="nav-item dropdown dropdown-hover mx-2">
            <RouterLink
              :to="{ name: 'home' }"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <span>Domov</span>
            </RouterLink>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <RouterLink
              :to="{ name: 'speakers' }"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <span>Speakers</span>
            </RouterLink>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <RouterLink
              :to="{ name: 'program' }"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <span>Program</span>
            </RouterLink>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <RouterLink
              :to="{ name: 'contact' }"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <span>Galéria</span>
            </RouterLink>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <RouterLink
              :to="{ name: 'contact' }"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <span>Kontakt</span>
            </RouterLink>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <RouterLink
              :to="{ name: 'registration' }"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <span>Registrácia</span>
            </RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item mx-2">
            <RouterLink :to="{ name: 'dashboard' }">
              <span class="btn btn-sm mb-0 bg-gradient-dark">Admin</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>