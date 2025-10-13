import { ref } from 'vue';

export const useStreamingMessage = () => {
  const streamingText = ref('');
  const isStreaming = ref(false);

  const startStreaming = (fullText: string, speed: number = 20) => {
    return new Promise<void>((resolve) => {
      streamingText.value = '';
      isStreaming.value = true;
      let index = 0;

      const interval = setInterval(() => {
        if (index < fullText.length) {
          streamingText.value += fullText[index];
          index++;
        } else {
          clearInterval(interval);
          isStreaming.value = false;
          resolve();
        }
      }, speed);
    });
  };

  const stopStreaming = () => {
    isStreaming.value = false;
  };

  return {
    streamingText,
    isStreaming,
    startStreaming,
    stopStreaming,
  };
};
