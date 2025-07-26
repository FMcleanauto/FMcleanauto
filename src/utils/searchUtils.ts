import { Part } from '../types/Part';

export function searchParts(parts: Part[], keyword: string, category: string = ''): Part[] {
  if (!keyword && !category) return parts;
  
  return parts.filter(part => {
    const matchesKeyword = !keyword || 
      part.ref.toLowerCase().includes(keyword.toLowerCase()) ||
      part.fr.toLowerCase().includes(keyword.toLowerCase()) ||
      part.en.toLowerCase().includes(keyword.toLowerCase());
    
    const matchesCategory = !category || 
      part.category?.toLowerCase().includes(category.toLowerCase());
    
    return matchesKeyword && matchesCategory;
  });
}

export function getCategories(parts: Part[]): string[] {
  const categories = new Set<string>();
  parts.forEach(part => {
    if (part.category && part.category.trim()) {
      categories.add(part.category.trim());
    }
  });
  return Array.from(categories).sort();
}

export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}