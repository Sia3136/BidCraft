import categoriesData from '../../shared/categories.json';

export type CategoryData = {
  name: string;
  subcategories: string[];
};

export const CATEGORIES: CategoryData[] = categoriesData.categories;
