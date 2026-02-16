import { useState, useEffect } from "react";
import { getThematicKeywords } from "../data/serviceThematicImages";
import { getRandomPexelsImage } from "../services/pexelsService";

const DIRECT_IMAGE_CATEGORIES = ["water_tanks", "turnkey_repair"];
const LOCAL_FALLBACK = [
  "/assets/products/img1.jpg",
  "/assets/products/img2.jpg",
  "/assets/products/img3.jpg",
  "/assets/products/img4.jpg",
  "/assets/products/img5.jpg",
  "/assets/products/img6.jpg",
];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Возвращает URL тематического фото для карточки услуги.
 * Для water_tanks и turnkey_repair — сразу service.image.
 * Для остальных: загружает напрямую из Pexels API (без Firebase Storage).
 */
export function useThematicImageUrl(categoryId, service) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!service) {
      setUrl("");
      setLoading(false);
      return;
    }

    // Для категорий с прямыми изображениями
    if (DIRECT_IMAGE_CATEGORIES.includes(categoryId)) {
      setUrl(service.image || "");
      setLoading(false);
      return;
    }

    const keywords = getThematicKeywords(categoryId, service.id);
    if (!keywords) {
      const i = hash(`${categoryId}-${service.id}`) % LOCAL_FALLBACK.length;
      setUrl(LOCAL_FALLBACK[i]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      // Получаем изображение напрямую из Pexels API
      const pexelsUrl = await getRandomPexelsImage(keywords);

      if (cancelled) return;

      if (pexelsUrl) {
        setUrl(pexelsUrl);
      } else {
        // Fallback на локальные изображения
        const i = hash(`${categoryId}-${service.id}`) % LOCAL_FALLBACK.length;
        setUrl(LOCAL_FALLBACK[i]);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId, service?.id]);

  return { url, loading };
}
