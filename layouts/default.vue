<template>
  <AppHeader />
  <NotificationManager /> 
  <main>
    <slot />
  </main>
  <AppFooter />
  <FeedbackButton />
</template>

<script setup lang="ts">
import { NotificationManager, FeedbackButton } from '@/components/utils';
</script>
