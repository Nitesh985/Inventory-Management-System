import { useState } from "react";

// T-> response type
// B-> body/payload type
export function useMutation<T, B = any>(
  mutationFn: (body: B) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (body: B) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(body);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, mutate };
}
