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
        <p class="text-sm text-gray-500 mb-6 p-4 bg-primary/10 rounded-md border border-primary/20">
          <IconInfoCircle class="inline-block h-4 w-4 mr-2 text-primary" />
          Votre témoignage sera examiné par notre équipe avant publication. Nous nous réservons le droit de ne pas le
          publier s'il ne respecte pas nos conditions d'utilisation.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="author" class="block text-sm font-medium text-gray-700">
              Votre nom
              <span class="text-red-500">*</span>
            </label>
            <input type="text" id="author" v-model="form.author" placeholder="Votre nom et prénom" required
              class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700">Votre rôle</label>
              <input type="text" id="role" v-model="form.role" placeholder="Ex: Directeur Marketing"
                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400" />
            </div>

            <div>
              <label for="company" class="block text-sm font-medium text-gray-700">Votre entreprise</label>
              <input type="text" id="company" v-model="form.company"
                placeholder="Nom de votre entreprise ou organisation"
                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400" />
            </div>
          </div>

          <div>
            <label for="content" class="block text-sm font-medium text-gray-700">
              Votre témoignage
              <span class="text-red-500">*</span>
            </label>
            <textarea id="content" v-model="form.content" rows="5" placeholder="Partagez votre expérience avec nous..."
              required
              class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
            <div class="flex items-center">
              <div v-for="starValue in 5" :key="starValue"
                class="relative w-6 h-6 cursor-pointer transition-transform hover:scale-110"
                @mousemove="updateHover(starValue, $event)" @mouseleave="resetHover"
                @click="setRating(starValue, $event)">
                <IconStarFilled v-if="currentRating >= starValue" class="absolute inset-0 h-6 w-6 text-yellow-400" />
                <IconStarHalfFilled v-else-if="currentRating > starValue - 1 && currentRating < starValue"
                  class="absolute inset-0 h-6 w-6 text-yellow-400" />
                <IconStar v-else class="absolute inset-0 h-6 w-6 text-gray-300" />
              </div>
              <div class="px-1 bg-gray-50 rounded-lg border border-gray-200 ml-2 justify-center">
                <div>
                  <span class="text-2xl font-bold text-gray-900">{{ currentRating > 0 ? currentRating.toFixed(1) : '0.0'
                    }}</span>
                  <span class="text-gray-500 text-sm ml-1">/ 5.0</span>
                </div>
                <div class="text-sm text-gray-500">
                  {{ getRatingText(currentRating) }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label for="avatar" class="block text-sm font-medium text-gray-700">URL de votre avatar</label>
            <input type="url" id="avatar" v-model="form.avatar" placeholder="Collez ici l'URL de votre photo de profil"
              class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Plateforme concernée
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="relative">
                <input type="text" v-model="platformSearchQuery" @focus="showPlatformDropdown = true"
                  @blur="hidePlatformDropdown" placeholder="Rechercher une plateforme..."
                  class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder-gray-400" />
                <IconSearch class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              <div v-if="selectedPlatformName" class="mt-2 flex flex-wrap gap-2">
                <span class="px-2 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-1">
                  {{ selectedPlatformName }}
                  <span v-if="wasPreSelected" class="text-xs opacity-75">(auto)</span>
                </span>
              </div>

              <ul v-if="showPlatformDropdown && filteredPlatforms.length > 0"
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                <li v-for="platform in filteredPlatforms" :key="platform.id"
                  @mousedown.prevent="togglePlatformSelection(platform.id)"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                  <span>{{ platform.name }}</span>
                  <IconCheck v-if="form.platformId === platform.id" class="h-5 w-5 text-primary" />
                </li>
              </ul>
              <p v-else-if="showPlatformDropdown && platformSearchQuery && filteredPlatforms.length === 0"
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 px-4 py-2 text-gray-500">
                Aucune plateforme trouvée.
              </p>
            </div>
          </div>

          <button type="submit" :disabled="testimonyStore.submissionLoading"
            class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed">
            <div class="flex items-center justify-center gap-2">
              <IconLoader v-if="testimonyStore.submissionLoading" class="w-5 h-5 animate-spin" />
              <IconSend v-else class="w-5 h-5" />
              <span>
                {{ testimonyStore.submissionLoading ? 'Envoi en cours...' : 'Publier mon témoignage' }}
              </span>
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
import { useRoute } from 'vue-router';
import { useTestimonyStore } from '@/stores/testimonies';
import { useSolutionStore } from '@/stores/solutions';
import { IconStar, IconStarFilled, IconStarHalfFilled, IconLoader, IconSend, IconCheck, IconAlertCircle, IconInfoCircle, IconSearch } from '@tabler/icons-vue';

const route = useRoute();
const testimonyStore = useTestimonyStore();
const solutionStore = useSolutionStore();

const form = ref({
  author: '',
  role: '',
  company: '',
  content: '',
  note: 0 as number, // Initialisé à 0, peut être décimal
  avatar: '',
  platformId: null as string | null,
});

const platformSearchQuery = ref('');
const showPlatformDropdown = ref(false);
const wasPreSelected = ref(false);

// --- Logique de notation par étoiles ---
const hoverRating = ref(0);
const isHovering = ref(false);

const currentRating = computed(() => isHovering.value ? hoverRating.value : form.value.note);

const getRatingText = (rating: number) => {
  if (rating === 0) return 'Sélectionnez votre note';
  if (rating <= 1) return 'Très déçu';
  if (rating <= 2) return 'Déçu';
  if (rating <= 3) return 'Satisfait';
  if (rating <= 4) return 'Très satisfait';
  return 'Excellent';
};

const calculateStarRating = (starValue: number, event: MouseEvent): number => {
  const starElement = event.currentTarget as HTMLElement;
  const rect = starElement.getBoundingClientRect();
  const offsetX = event.clientX - rect.left; // Position de la souris relative à l'élément étoile
  const starWidth = rect.width;

  if (offsetX <= starWidth / 2) {
    return starValue - 0.5;
  } else {
    return starValue;
  }
};

const updateHover = (starValue: number, event: MouseEvent) => {
  isHovering.value = true;
  hoverRating.value = calculateStarRating(starValue, event);
};

const resetHover = () => {
  isHovering.value = false;
  hoverRating.value = 0;
};

const setRating = (starValue: number, event: MouseEvent) => {
  form.value.note = calculateStarRating(starValue, event);
  isHovering.value = false; // Arrête l'effet de survol après le clic
};
// --- Fin Logique de notation par étoiles ---


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

// Nom de la plateforme sélectionnée pour l'affichage
const selectedPlatformName = computed(() => {
  if (form.value.platformId) {
    const platform = solutionStore.solutions.find(s => s.id === form.value.platformId);
    return platform ? platform.name : '';
  }
  return '';
});

// Fonction pour pré-sélectionner une plateforme depuis l'URL
const preSelectPlatformFromUrl = () => {
  const platformParam = route.query.platform as string;

  if (platformParam && solutionStore.solutions.length > 0) {
    const platform = solutionStore.solutions.find(s =>
      s.slug?.toLowerCase() === platformParam.toLowerCase() ||
      s.name.toLowerCase() === platformParam.toLowerCase()
    );

    if (platform) {
      form.value.platformId = platform.id;
      wasPreSelected.value = true;
      console.log(`✅ Plateforme "${platform.name}" pré-sélectionnée depuis l'URL`);
    } else {
      console.warn(`⚠️ Plateforme "${platformParam}" non trouvée`);
    }
  }
};

// Toggle la sélection d'une plateforme individuelle
const togglePlatformSelection = (platformId: string) => {
  if (form.value.platformId === platformId) {
    form.value.platformId = null;
    wasPreSelected.value = false;
  } else {
    form.value.platformId = platformId;
  }
};

// Masquer la liste déroulante
const hidePlatformDropdown = () => {
  setTimeout(() => {
    showPlatformDropdown.value = false;
  }, 150);
};

// Pré-sélectionner quand les solutions sont chargées
watch(() => solutionStore.solutions.length, (newLength) => {
  if (newLength > 0 && !form.value.platformId) {
    preSelectPlatformFromUrl();
  }
});

// Récupérer les solutions au montage pour la sélection de plateforme
onMounted(async () => {
  await solutionStore.fetchSolutions(undefined, undefined, true);
  preSelectPlatformFromUrl();
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
      platformId: form.value.platformId,
    };
    await testimonyStore.submitTestimony(payload);

    // Reset du formulaire après succès
    form.value = {
      author: '',
      role: '',
      company: '',
      content: '',
      note: 0,
      avatar: '',
      platformId: null,
    };
    platformSearchQuery.value = '';
    wasPreSelected.value = false;
  } catch (error) {
  }
};

useHead({
  title: 'Donnez votre avis',
});
</script>
