// Slugification pour générer des IDs uniques
export const slugify = (text: string): string => {
  const cleanedText = text.replace(/^\d+\.\s*/, '');
  return cleanedText
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Défilement vers une section
export const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Téléchargement d'un fichier PDF
export const downloadFile = async (url: string, fileName: string): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(a.href);
    a.remove();
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    alert('Impossible de télécharger le fichier. Veuillez réessayer plus tard.');
  }
};
