import { use, useEffect, useState } from "react";
import { PAGINATION_LIMIT } from "@/config/constants";

interface UseEntitySearchProps<
  T extends {
    search: string;
    page: number;
  }
> {
  params: T;
  setParams: (params: T) => void;
  debounceMS?: number;
}

export const useEntitySearch = <T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMS = 500,
}: UseEntitySearchProps<T>) => {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION_LIMIT.DEFAULT_PAGE,
      });
      return;
    }

    const handler = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION_LIMIT.DEFAULT_PAGE,
        });
      }
    }, debounceMS);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, params, setParams, debounceMS]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params, setLocalSearch]);

  return {
    searchValue: localSearch,
    setSearchValue: setLocalSearch,
  };
};
