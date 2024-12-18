<template>
  <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-base-100 bg-opacity-75">
    <div class="flex flex-col items-center">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p v-if="message" class="mt-4 text-lg">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from 'vue';

interface Props {
  isLoading: boolean;
  message?: string; // Optional message to display
}

const props = defineProps<Props>();
const { isLoading, message } = toRefs(props);
</script>