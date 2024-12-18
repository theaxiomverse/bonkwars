<template>
  <div class="app">
    <DefaultHeader />

    <main class="flex-grow container mx-auto px-4 py-8">
      <AppLoader :is-loading="isAppKitLoading" message="Initializing Bonk Wars..." />
      <slot />
    </main>


  </div>
</template>

<script lang="ts" setup>
import AppLoader from '@/components/AppLoader.vue';
const isAppKitLoading = ref(true);

onMounted(async () => {
  try {
    isAppKitLoading.value = false;
  } catch (Error) {
  console.log(Error);}
})
</script>