const apiCache: { [key: string]: { data: any; expiry: number } } = {};

export async function fetchFromTMDB(url: URL, cacheTime: number = 86400): Promise<any> {
  const cacheKey = url.toString();
  const currentTime = Date.now();

  if (apiCache[cacheKey] && apiCache[cacheKey].expiry > currentTime) {
    return apiCache[cacheKey].data;
  }

  try {
    url.searchParams.set('include_adult', 'false');
    url.searchParams.set('language', 'en');
    url.searchParams.set('sort_by', 'popularity.desc');
    url.searchParams.set('include_video', 'false');

    const options: RequestInit = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
      next: { revalidate: cacheTime },
    };

    const response = await fetch(url.toString(), options);
    if (!response.ok) throw new Error('Failed to fetch data from TMDB');
    const data = await response.json();
    apiCache[cacheKey] = { data, expiry: currentTime + cacheTime * 1000 };
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
