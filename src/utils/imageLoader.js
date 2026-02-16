/**
 * Утилита для массовой загрузки изображений
 * Можно вызвать из консоли браузера для загрузки всех изображений
 */

import { SERVICES_CATEGORIES } from "../data/servicesData";
import { getThematicKeywords } from "../data/serviceThematicImages";
import { getOrCreateServiceImage } from "../services/imageStorageService";

/**
 * Загрузить изображения для всех услуг категории
 * @param {string} categoryId - ID категории
 * @returns {Promise<Object>} - результаты загрузки
 */
export async function loadCategoryImages(categoryId) {
  const category = SERVICES_CATEGORIES[categoryId];
  if (!category) {
    throw new Error(`Категория ${categoryId} не найдена`);
  }

  const results = {
    success: [],
    failed: [],
    skipped: [],
  };

  console.log(`Загрузка изображений для категории: ${category.title}`);
  console.log(`Всего услуг: ${category.services.length}`);

  for (const service of category.services) {
    const keywords = getThematicKeywords(categoryId, service.id);

    if (!keywords) {
      console.log(`⏭️  Пропуск ${service.id} - нет ключевых слов`);
      results.skipped.push(service.id);
      continue;
    }

    try {
      console.log(`🔄 Загрузка ${service.id}...`);
      const imageUrl = await getOrCreateServiceImage(
        categoryId,
        service.id,
        keywords,
      );

      if (imageUrl) {
        console.log(`✅ ${service.id} - успешно`);
        results.success.push({ serviceId: service.id, imageUrl });
      } else {
        console.log(`❌ ${service.id} - не удалось загрузить`);
        results.failed.push(service.id);
      }

      // Задержка между запросами (чтобы не превысить лимиты API)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ ${service.id} - ошибка:`, error);
      results.failed.push(service.id);
    }
  }

  console.log("\n📊 Результаты:");
  console.log(`✅ Успешно: ${results.success.length}`);
  console.log(`❌ Ошибки: ${results.failed.length}`);
  console.log(`⏭️  Пропущено: ${results.skipped.length}`);

  return results;
}

/**
 * Загрузить изображения для всех категорий
 * @returns {Promise<Object>} - результаты загрузки по категориям
 */
export async function loadAllImages() {
  const allResults = {};
  const categories = Object.keys(SERVICES_CATEGORIES);

  console.log(
    `🚀 Начало загрузки изображений для ${categories.length} категорий`,
  );

  for (const categoryId of categories) {
    // Пропускаем категории с прямыми изображениями
    if (categoryId === "water_tanks" || categoryId === "turnkey_repair") {
      console.log(
        `⏭️  Пропуск ${categoryId} - используются прямые изображения`,
      );
      continue;
    }

    try {
      const results = await loadCategoryImages(categoryId);
      allResults[categoryId] = results;

      // Пауза между категориями
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Ошибка загрузки категории ${categoryId}:`, error);
      allResults[categoryId] = { error: error.message };
    }
  }

  console.log("\n🎉 Загрузка завершена!");
  return allResults;
}

/**
 * Проверить статус загрузки изображений
 * @returns {Promise<Object>} - статистика по категориям
 */
export async function checkImagesStatus() {
  const { getCategoryImages } = await import("../services/imageStorageService");
  const stats = {};

  for (const [categoryId, category] of Object.entries(SERVICES_CATEGORIES)) {
    const images = await getCategoryImages(categoryId);
    const totalServices = category.services.length;
    const loadedImages = images.length;

    stats[categoryId] = {
      title: category.title,
      total: totalServices,
      loaded: loadedImages,
      missing: totalServices - loadedImages,
      percentage: Math.round((loadedImages / totalServices) * 100),
    };
  }

  console.table(stats);
  return stats;
}

// Экспорт для использования в консоли браузера
if (typeof window !== "undefined") {
  window.imageLoader = {
    loadCategoryImages,
    loadAllImages,
    checkImagesStatus,
  };

  console.log("📸 Image Loader доступен через window.imageLoader");
  console.log("Примеры использования:");
  console.log("  window.imageLoader.checkImagesStatus() - проверить статус");
  console.log(
    "  window.imageLoader.loadCategoryImages('plumbing') - загрузить для категории",
  );
  console.log("  window.imageLoader.loadAllImages() - загрузить все");
}
