<template>
  <div class="markdown-content prose prose-sm max-w-none">
    <div v-html="sanitizedHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';

interface Props {
  content: string;
}

const props = defineProps<Props>();

const configureMarked = () => {
  const renderer = new marked.Renderer();
  
  renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(text, { language: lang }).value;
        return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    const highlighted = hljs.highlightAuto(text).value;
    return `<pre><code class="hljs">${highlighted}</code></pre>`;
  };

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: renderer
  });
};

onMounted(() => {
  configureMarked();
});

// Convertir et nettoyer le HTML
const sanitizedHtml = computed(() => {
  try {
    const rawHtml = marked(props.content) as string;
    return DOMPurify.sanitize(rawHtml, {
      ADD_ATTR: ['target', 'rel', 'class'],
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 'del',
        'ul', 'ol', 'li',
        'a', 'code', 'pre',
        'blockquote',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span'
      ]
    });
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return `<p>${props.content}</p>`;
  }
});
</script>

<style scoped>
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  @apply font-bold mt-4 mb-2;
}

.markdown-content :deep(h1) {
  @apply text-xl;
}

.markdown-content :deep(h2) {
  @apply text-lg;
}

.markdown-content :deep(h3) {
  @apply text-base;
}

.markdown-content :deep(p) {
  @apply mb-3;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  @apply ml-4 mb-3;
}

.markdown-content :deep(ul) {
  @apply list-disc;
}

.markdown-content :deep(ol) {
  @apply list-decimal;
}

.markdown-content :deep(li) {
  @apply mb-1;
}

.markdown-content :deep(a) {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.markdown-content :deep(code) {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono;
}

.markdown-content :deep(pre) {
  @apply bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-3 relative;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0 text-sm;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic my-3;
}

.markdown-content :deep(table) {
  @apply w-full border-collapse mb-3;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  @apply border border-gray-300 px-3 py-2 text-left;
}

.markdown-content :deep(th) {
  @apply bg-gray-100 font-semibold;
}

.markdown-content :deep(strong) {
  @apply font-bold;
}

.markdown-content :deep(em) {
  @apply italic;
}
</style>
