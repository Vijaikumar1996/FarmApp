import { useState } from "react";

export default function useSearchFilters(defaultValues) {
  const [filters, setFilters] = useState(defaultValues);

  const search = (values) => {
    setFilters(values);
  };

  const reset = () => {
    setFilters(defaultValues);
  };

  return {
    filters,
    search,
    reset,
  };
}
