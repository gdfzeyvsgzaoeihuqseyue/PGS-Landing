<template>
  <div class="flex flex-col min-h-screen">
    <prefSettings />
    <ErrorPage :error="errorData" class="flex-grow" />
    <footer class="py-4 border-t bg-WtBAct">
      </footer>
  </div>
</template>

<script setup>
import { useSharedFiles } from '~/stores/sharedFiles';
import ErrorPage from '~/components/ErrorPage.vue';

const sharedFiles = useSharedFiles();

const props = defineProps({
  error: Object,
});

const errorData = computed(() => {
  const { statusCode, statusMessage } = props.error;
  let title = "Oups ! Une erreur est survenue";
  let message = "Désolé, une erreur inattendue est survenue. Veuillez réessayer plus tard.";

  if (statusCode === 404) {
    title = "Oups ! Page introuvable";
    message = "Désolé, la page que vous recherchez semble s'être perdue.";
  } else if (statusCode === 403) {
    title = "Accès Interdit";
    message = "Désolé, vous n'avez pas l'autorisation d'accéder à cette page.";
  }

  return { statusCode, title, message };
});

useHead({
  title: computed(() => `Erreur ${errorData.value.statusCode}`),
});

definePageMeta({
  layout: false
});
</script>