<template>
  <div 
    class="logo-loader-inline" 
    :class="[
      { 'fullscreen': fullscreen },
      `size-${size}`
    ]"
  >
    <div class="logo-wrapper">
      <svg 
        viewBox="0 0 1080 1080" 
        xmlns="http://www.w3.org/2000/svg"
        class="animated-logo"
      >
        <!-- Chevron gauche (noir) -->
        <path 
          class="chevron-black"
          d="M 400 200 L 650 200 L 500 450 L 650 700 L 400 700 L 200 450 Z"
          fill="#000000"
        />
        
        <!-- Chevron droit (bleu) -->
        <path 
          class="chevron-blue"
          d="M 570 380 L 820 380 L 880 800 L 630 800 L 570 550 L 750 550 L 750 750 L 630 750 Z"
          fill="#0066FF"
        />
      </svg>
      
      <div class="pulse-ring"></div>
    </div>
    
    <p v-if="showText" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  fullscreen: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: 'Chargement...'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

defineEmits(['loaded'])
</script>

<style scoped>
/* Version inline (par défaut) */
.logo-loader-inline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 200px;
}

/* Version fullscreen (optionnelle) */
.logo-loader-inline.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  z-index: 9999;
  padding: 0;
  min-height: 100vh;
}

.logo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.animated-logo {
  width: 80px;
  height: 80px;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));
}

/* Tailles personnalisables */
.logo-loader-inline.size-sm .animated-logo {
  width: 50px;
  height: 50px;
}

.logo-loader-inline.size-sm .pulse-ring {
  width: 50px;
  height: 50px;
}

.logo-loader-inline.size-md .animated-logo {
  width: 80px;
  height: 80px;
}

.logo-loader-inline.size-md .pulse-ring {
  width: 80px;
  height: 80px;
}

.logo-loader-inline.size-lg .animated-logo {
  width: 120px;
  height: 120px;
}

.logo-loader-inline.size-lg .pulse-ring {
  width: 120px;
  height: 120px;
}

.logo-loader-inline.fullscreen .animated-logo {
  width: 200px;
  height: 200px;
}

/* Animation du chevron noir */
.chevron-black {
  transform-origin: center;
  animation: 
    slideInRotateLeft 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
    floatLeft 2s ease-in-out 0.8s infinite;
}

/* Animation du chevron bleu */
.chevron-blue {
  transform-origin: center;
  animation: 
    slideInRotateRight 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.15s backwards,
    floatRight 2s ease-in-out 0.95s infinite;
}

/* Entrée avec rotation depuis la gauche */
@keyframes slideInRotateLeft {
  0% {
    transform: translateX(-50px) rotate(-90deg);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
}

/* Entrée avec rotation depuis la droite */
@keyframes slideInRotateRight {
  0% {
    transform: translateX(50px) rotate(90deg);
    opacity: 0;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
}

/* Flottement alterné gauche */
@keyframes floatLeft {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-4px) translateX(-2px);
  }
}

/* Flottement alterné droit */
@keyframes floatRight {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(4px) translateX(2px);
  }
}

/* Anneau de pulsation (plus discret) */
.pulse-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid #0066FF;
  border-radius: 50%;
  opacity: 0;
  animation: pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) 0.8s infinite;
}

.logo-loader-inline.fullscreen .pulse-ring {
  width: 200px;
  height: 200px;
  border-width: 3px;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* Texte de chargement */
.loading-text {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  animation: fadeInOut 1.5s ease-in-out infinite;
}

.logo-loader-inline.fullscreen .loading-text {
  font-size: 1.125rem;
  margin-top: 2rem;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

/* Animation de sortie */
.logo-loader-inline.fade-out {
  animation: fadeOut 0.4s ease-out forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>
