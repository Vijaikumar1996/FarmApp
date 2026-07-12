import { useQuery } from "@tanstack/react-query";

import { getProductCategories } from "../services/productCategoryService";

const QUERY_KEY = "product-categories";

export function useProductCategories() {
  return useQuery({
    queryKey: [QUERY_KEY],

    queryFn: getProductCategories,
  });
}
