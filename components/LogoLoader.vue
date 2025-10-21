<template>
  <div class="logo-loader-container">
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
      <div class="pulse-ring pulse-ring-delay"></div>
    </div>
    
    <div class="loading-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['loaded'])
const isLoaded = ref(false)

let timeout

onMounted(() => {
  // Émettre l'événement après l'animation
  timeout = setTimeout(() => {
    isLoaded.value = true
    emit('loaded')
  }, 3500)
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.logo-loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  z-index: 9999;
}

.logo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.animated-logo {
  width: 280px;
  height: 280px;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15));
}

/* Animation du chevron noir */
.chevron-black {
  transform-origin: center;
  animation: 
    slideInRotateLeft 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
    floatLeft 3s ease-in-out 1s infinite;
}

/* Animation du chevron bleu */
.chevron-blue {
  transform-origin: center;
  animation: 
    slideInRotateRight 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s backwards,
    floatRight 3s ease-in-out 1.2s infinite;
}

/* Entrée avec rotation depuis la gauche */
@keyframes slideInRotateLeft {
  0% {
    transform: translateX(-200px) rotate(-180deg);
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
    transform: translateX(200px) rotate(180deg);
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
  25% {
    transform: translateY(-8px) translateX(-3px);
  }
  50% {
    transform: translateY(0) translateX(0);
  }
  75% {
    transform: translateY(8px) translateX(3px);
  }
}

/* Flottement alterné droit */
@keyframes floatRight {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(8px) translateX(3px);
  }
  50% {
    transform: translateY(0) translateX(0);
  }
  75% {
    transform: translateY(-8px) translateX(-3px);
  }
}

/* Anneaux de pulsation */
.pulse-ring {
  position: absolute;
  width: 280px;
  height: 280px;
  border: 3px solid #0066FF;
  border-radius: 50%;
  opacity: 0;
  animation: pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) 1s infinite;
}

.pulse-ring-delay {
  animation-delay: 2s;
  border-color: #000000;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* Points de chargement */
.loading-dots {
  display: flex;
  gap: 12px;
  margin-top: 50px;
}

.dot {
  width: 12px;
  height: 12px;
  background: #0066FF;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: #333;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8) translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2) translateY(-20px);
    opacity: 1;
  }
}

/* Animation de sortie */
.logo-loader-container.fade-out {
  animation: fadeOutScale 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}

@keyframes fadeOutScale {
  to {
    opacity: 0;
    transform: scale(0.9);
    pointer-events: none;
  }
}
</style>