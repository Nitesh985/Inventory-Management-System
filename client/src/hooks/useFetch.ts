import { useEffect, useState } from "react";

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    fetcher()
      .then((res) => {
        console.log(res.data)
        if (isMounted) setData(res.data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error };
}
