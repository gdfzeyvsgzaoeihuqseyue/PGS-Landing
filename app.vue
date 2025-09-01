<template>
  <div class="min-h-screen mt-16 bg-gray-50 font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NewsletterModal />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: '%s | PRO GESTION SOFT',
})
</script>