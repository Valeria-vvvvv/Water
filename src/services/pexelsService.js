/**
 * Сервис для работы с Pexels API
 * Поиск тематических фотографий без CORS проблем
 */

const PEXELS_API = "https://api.pexels.com/v1/search";
const cache = new Map();

/**
 * Поиск фотографий по ключевым словам через Pexels API
 * @param {string} query - поисковый запрос
 * @param {number} perPage - количество результатов (по умолчанию 5)
 * @returns {Promise<Array|null>} - массив URL фотографий или null
 */
export async function searchPexelsImages(query, perPage = 5) {
  if (!query) return null;

  const cacheKey = `${query}-${perPage}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
  if (!apiKey) {
    console.warn("VITE_PEXELS_API_KEY не установлен");
    return null;
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: perPage,
      orientation: "landscape",
    });

    const response = await fetch(`${PEXELS_API}?${params}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      console.error("Pexels API error:", response.status);
      return null;
    }

    const data = await response.json();
    const photos =
      data.photos?.map((photo) => ({
        url: photo.src.large,
        medium: photo.src.medium,
        small: photo.src.small,
        photographer: photo.photographer,
      })) || [];

    if (photos.length > 0) {
      cache.set(cacheKey, photos);
    }

    return photos;
  } catch (error) {
    console.error("Ошибка при запросе к Pexels:", error);
    return null;
  }
}

/**
 * Получить одно случайное фото по запросу
 * @param {string} query - поисковый запрос
 * @returns {Promise<string|null>} - URL фотографии или null
 */
export async function getRandomPexelsImage(query) {
  const photos = await searchPexelsImages(query, 10);
  if (!photos || photos.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * photos.length);
  return photos[randomIndex].url;
}
