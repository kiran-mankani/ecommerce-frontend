import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULTS = {
  search: "",
  category: "",
  status: "",
  minPrice: "",
  maxPrice: "",
  sort: "-createdAt",
  page: 1,
};

const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => {
    const initial = { ...DEFAULTS };
    for (const key of Object.keys(DEFAULTS)) {
      const val = searchParams.get(key);
      if (val !== null) {
        initial[key] = key === "page" ? parseInt(val, 10) || 1 : val;
      }
    }
    return initial;
  });

  useEffect(() => {
    const next = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v !== DEFAULTS[k] && v !== "" && !(k === "page" && v === 1)) {
        next[k] = String(v);
      }
    }
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const update = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const clear = useCallback(() => {
    setFilters({ ...DEFAULTS });
  }, []);

  return { filters, update, clear };
};

export default useProductFilters;