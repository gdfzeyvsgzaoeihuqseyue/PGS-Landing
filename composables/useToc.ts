import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { slugify } from '~/utils/legalFn';

export function useToc(contentId: string) {
  const tableOfContents = ref<{ id: string; text: string }[]>([]);
  const activeSectionId = ref('');
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const sections = tableOfContents.value.map(item => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];

    let currentActiveId = '';
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.offsetTop <= scrollY + 100) {
        currentActiveId = section.id;
        break;
      }
    }
    activeSectionId.value = currentActiveId;
  };

  onMounted(() => {
    nextTick(() => {
      const contentContainer = document.getElementById(contentId);
      if (contentContainer) {
        const headings = contentContainer.querySelectorAll('h2, h3');
        headings.forEach((heading) => {
          const text = heading.textContent || '';
          const id = slugify(text);
          heading.id = id;
          tableOfContents.value.push({ id, text });
        });
      }
      handleScroll();
      window.addEventListener('scroll', handleScroll);
    });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    tableOfContents,
    activeSectionId,
    handleScroll,
  };
}
