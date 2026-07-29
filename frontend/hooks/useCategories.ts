import { useState, useEffect } from 'react';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then(data => {
        if (isMounted && data.categories) {
          setCategories(data.categories);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Failed to fetch categories:', err);
          setError(err.message);
          setIsLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, isLoading, error };
}
