<template>
  <main class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Donnez votre <span class="text-primary">avis</span>
        </h1>
        <p class="text-lg text-gray-600">
          Partagez votre expérience avec nos solutions.
        </p>
      </header>

      <div class="bg-white rounded-xl shadow-lg p-8">
        <p class="text-sm text-gray-500 mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <IconInfoCircle class="inline-block h-4 w-4 mr-2 text-blue-600" />
          Votre témoignage sera examiné par notre équipe avant publication. Par défaut, il ne sera pas visible
          publiquement. Nous nous réservons le droit de ne pas le publier ou de le modifier.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="author" class="block text-sm font-medium text-gray-700">Votre nom</label>
            <input type="text" id="author" v-model="form.author" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Votre rôle (optionnel)</label>
            <input type="text" id="role" v-model="form.role"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>

          <div>
            <label for="company" class="block text-sm font-medium text-gray-700">Votre entreprise (optionnel)</label>
            <input type="text" id="company" v-model="form.company"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>

          <div>
            <label for="content" class="block text-sm font-medium text-gray-700">Votre témoignage</label>
            <textarea id="content" v-model="form.content" rows="5" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
            <div class="flex items-center space-x-1">
              <button type="button" v-for="star in 5" :key="star" @click="form.note = star" class="focus:outline-none">
                <IconStarFilled v-if="form.note >= star" class="h-6 w-6 text-yellow-400" />
                <IconStar v-else class="h-6 w-6 text-gray-300" />
              </button>
            </div>
          </div>

          <div>
            <label for="avatar" class="block text-sm font-medium text-gray-700">URL de votre avatar (optionnel)</label>
            <input type="url" id="avatar" v-model="form.avatar"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Plateforme(s) concernée(s)</label>
            <div class="relative">
              <div class="flex items-center mb-2">
                <input type="checkbox" id="allPlatforms" v-model="selectAllPlatforms"
                  class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label for="allPlatforms" class="ml-2 block text-sm text-gray-900">Toutes les plateformes</label>
              </div>

              <div v-if="!selectAllPlatforms">
                <div class="relative">
                  <input type="text" v-model="platformSearchQuery" @focus="showPlatformDropdown = true"
                    @blur="hidePlatformDropdown" placeholder="Rechercher une plateforme..."
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary pr-10" />
                  <IconSearch class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                <div v-if="selectedPlatformNames.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="name in selectedPlatformNames" :key="name"
                    class="px-2 py-1 bg-primary text-white text-xs rounded-full">
                    {{ name }}
                  </span>
                </div>

                <ul v-if="showPlatformDropdown && filteredPlatforms.length > 0"
                  class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                  <li v-for="platform in filteredPlatforms" :key="platform.id"
                    @mousedown.prevent="togglePlatformSelection(platform.id)"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                    <span>{{ platform.name }}</span>
                    <IconCheck v-if="form.platformIds.includes(platform.id)" class="h-5 w-5 text-primary" />
                  </li>
                </ul>
                <p v-else-if="showPlatformDropdown && platformSearchQuery && filteredPlatforms.length === 0"
                  class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 px-4 py-2 text-gray-500">
                  Aucune plateforme trouvée.
                </p>
              </div>
            </div>
          </div>

          <button type="submit" :disabled="testimonyStore.submissionLoading"
            class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed">
            <div class="flex items-center justify-center gap-2">
              <IconLoader v-if="testimonyStore.submissionLoading" class="w-5 h-5 animate-spin" />
              <span v-else>Envoyer mon témoignage</span>
            </div>
          </button>
        </form>

        <div v-if="testimonyStore.submissionSuccess"
          class="mt-6 p-4 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
          <IconCheck class="w-5 h-5" />
          <span>Témoignage envoyé avec succès ! Il sera examiné avant publication.</span>
        </div>
        <div v-if="testimonyStore.submissionError"
          class="mt-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
          <IconAlertCircle class="w-5 h-5" />
          <span>{{ testimonyStore.submissionError }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useTestimonyStore } from '@/stores/testimonies';
import { useSolutionStore } from '@/stores/solutions';
import { IconStar, IconStarFilled, IconLoader, IconCheck, IconAlertCircle, IconInfoCircle, IconSearch } from '@tabler/icons-vue';

const testimonyStore = useTestimonyStore();
const solutionStore = useSolutionStore();

const form = ref({
  author: '',
  role: '',
  company: '',
  content: '',
  note: 0,
  avatar: '',
  platformIds: [] as string[],
});

const selectAllPlatforms = ref(false);
const platformSearchQuery = ref('');
const showPlatformDropdown = ref(false);

// Watcher pour gérer la sélection de "Toutes les plateformes"
watch(selectAllPlatforms, (newValue) => {
  if (newValue) {
    form.value.platformIds = [];
    platformSearchQuery.value = '';
  }
});

// Filtrer les plateformes basées sur la recherche
const filteredPlatforms = computed(() => {
  if (!platformSearchQuery.value) {
    return solutionStore.solutions;
  }
  const query = platformSearchQuery.value.toLowerCase();
  return solutionStore.solutions.filter(platform =>
    platform.name.toLowerCase().includes(query)
  );
});

// Noms des plateformes sélectionnées pour l'affichage
const selectedPlatformNames = computed(() => {
  return form.value.platformIds.map(id => {
    const platform = solutionStore.solutions.find(s => s.id === id);
    return platform ? platform.name : '';
  }).filter(Boolean);
});

// Toggle la sélection d'une plateforme individuelle
const togglePlatformSelection = (platformId: string) => {
  const index = form.value.platformIds.indexOf(platformId);
  if (index > -1) {
    form.value.platformIds.splice(index, 1);
  } else {
    form.value.platformIds.push(platformId);
  }
  selectAllPlatforms.value = false;
};

// Masquer la liste déroulante
const hidePlatformDropdown = () => {
  setTimeout(() => {
    showPlatformDropdown.value = false;
  }, 150);
};

// Récupérer les solutions au montage pour la sélection de plateforme
onMounted(() => {
  solutionStore.fetchSolutions(undefined, undefined, true);
});

const handleSubmit = async () => {
  try {
    const payload = {
      author: form.value.author,
      role: form.value.role || undefined,
      company: form.value.company || undefined,
      content: form.value.content,
      note: form.value.note > 0 ? form.value.note : undefined,
      avatar: form.value.avatar || undefined,
      platformId: selectAllPlatforms.value ? null : (form.value.platformIds.length > 0 ? form.value.platformIds : null),
    };
    await testimonyStore.submitTestimony(payload);
    form.value = {
      author: '',
      role: '',
      company: '',
      content: '',
      note: 0,
      avatar: '',
      platformIds: [],
    };
    selectAllPlatforms.value = false;
    platformSearchQuery.value = '';
  } catch (error) {
  }
};

useHead({
  title: 'Donnez votre avis',
});
</script>
