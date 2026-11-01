import { useEffect, useState } from "react";
import { getAllProducts } from "../api";
import type { Product } from "../types";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string;
}
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res.products))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
