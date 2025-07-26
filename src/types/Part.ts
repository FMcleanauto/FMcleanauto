export interface Part {
  ref: string;
  fr: string;
  en: string;
  image?: string;
  category?: string;
  price?: string;
}

export interface PartWithSelection extends Part {
  selected: boolean;
}

export interface SearchFilters {
  keyword: string;
  category: string;
}

export interface ExportOptions {
  includeImages: boolean;
  format: 'selected' | 'all';
}