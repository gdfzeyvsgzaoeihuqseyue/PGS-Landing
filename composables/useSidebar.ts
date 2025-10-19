import { ref, computed, type Ref, type ComputedRef } from 'vue';

export interface SidebarFilter {
  search?: string;
  category?: string;
  sortOrder?: string;
  dateRange?: { start: string; end: string };
  [key: string]: any;
}

export interface SidebarStats {
  [key: string]: number | string;
}

export interface UseSidebarOptions<T> {
  initialFilters?: SidebarFilter;
  itemsPerPage?: number;
  filterFn?: (items: T[], filters: SidebarFilter) => T[];
  sortFn?: (items: T[], sortOrder: string) => T[];
  statsFn?: (items: T[]) => SidebarStats;
}

export interface UseSidebarReturn<T> {
  // Sidebar state
  showSidebar: Ref<boolean>;
  filters: Ref<SidebarFilter>;
  
  // Pagination
  currentPage: Ref<number>;
  itemsPerPage: Ref<number>;
  totalPages: ComputedRef<number>;
  visiblePages: ComputedRef<number[]>;
  
  // Filtered & paginated data
  filteredItems: ComputedRef<T[]>;
  paginatedItems: ComputedRef<T[]>;
  
  // Statistics
  stats: ComputedRef<SidebarStats>;
  
  // Methods
  resetFilters: () => void;
  toggleSidebar: (value?: boolean) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export function useSidebar<T>(
  items: Ref<T[]> | ComputedRef<T[]>,
  options: UseSidebarOptions<T> = {}
): UseSidebarReturn<T> {
  const {
    initialFilters = { search: '', category: '', sortOrder: 'default' },
    itemsPerPage: initialItemsPerPage = 9,
    filterFn,
    sortFn,
    statsFn
  } = options;

  // State
  const showSidebar = ref(false);
  const filters = ref<SidebarFilter>({ ...initialFilters });
  const currentPage = ref(1);
  const itemsPerPage = ref(initialItemsPerPage);

  // Filtered items
  const filteredItems = computed(() => {
    let results = [...items.value];

    // Apply custom filter function if provided
    if (filterFn) {
      results = filterFn(results, filters.value);
    } else {
      // Default filtering by search and category
      if (filters.value.search) {
        const query = filters.value.search.toLowerCase();
        results = results.filter((item: any) => {
          return Object.values(item).some(value => 
            String(value).toLowerCase().includes(query)
          );
        });
      }

      if (filters.value.category) {
        results = results.filter((item: any) => 
          item.category === filters.value.category
        );
      }
    }

    // Apply custom sort function if provided
    if (sortFn && filters.value.sortOrder) {
      results = sortFn(results, filters.value.sortOrder);
    } else if (filters.value.sortOrder && filters.value.sortOrder !== 'default') {
      // Default sorting by name
      results = [...results].sort((a: any, b: any) => {
        const nameA = a.name || a.title || '';
        const nameB = b.name || b.title || '';
        const compare = nameA.localeCompare(nameB);
        return filters.value.sortOrder === 'asc' ? compare : -compare;
      });
    }

    return results;
  });

  // Pagination
  const totalPages = computed(() => 
    Math.ceil(filteredItems.value.length / itemsPerPage.value)
  );

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredItems.value.slice(start, end);
  });

  const visiblePages = computed(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    const total = totalPages.value;
    const current = currentPage.value;

    let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
    let endPage = Math.min(total, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  });

  // Statistics
  const stats = computed(() => {
    if (statsFn) {
      return statsFn(items.value);
    }
    return {
      total: items.value.length,
      filtered: filteredItems.value.length
    };
  });

  // Methods
  const resetFilters = () => {
    filters.value = { ...initialFilters };
    currentPage.value = 1;
  };

  const toggleSidebar = (value?: boolean) => {
    showSidebar.value = value !== undefined ? value : !showSidebar.value;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  // Watch filters to reset page
  watch(() => filters.value, () => {
    currentPage.value = 1;
  }, { deep: true });

  return {
    showSidebar,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
    visiblePages,
    filteredItems,
    paginatedItems,
    stats,
    resetFilters,
    toggleSidebar,
    goToPage,
    nextPage,
    prevPage
  };
}
