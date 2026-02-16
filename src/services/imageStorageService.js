/**
 * Сервис для работы с Firebase Storage
 * Загрузка и получение тематических изображений
 */

import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { searchPexelsImages } from "./pexelsService";

/**
 * Загрузить изображение из URL в Firebase Storage
 * @param {string} imageUrl - URL изображения
 * @param {string} categoryId - ID категории
 * @param {string} serviceId - ID услуги
 * @returns {Promise<string|null>} - публичный URL из Storage или null
 */
export async function uploadImageToStorage(imageUrl, categoryId, serviceId) {
  try {
    // Скачиваем изображение
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const blob = await response.blob();

    // Создаем уникальное имя файла
    const timestamp = Date.now();
    const fileName = `${serviceId}-${timestamp}.jpg`;
    const storagePath = `images/${categoryId}/${fileName}`;

    // Загружаем в Storage
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob, {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000", // кеш на год
    });

    // Получаем публичный URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Ошибка загрузки в Storage:", error);
    return null;
  }
}

/**
 * Получить или создать изображение для услуги
 * @param {string} categoryId - ID категории
 * @param {string} serviceId - ID услуги
 * @param {string} keywords - ключевые слова для поиска
 * @returns {Promise<string|null>} - URL изображения из Storage или null
 */
export async function getOrCreateServiceImage(categoryId, serviceId, keywords) {
  try {
    // Проверяем, есть ли уже изображение в Storage
    const existingUrl = await getExistingImage(categoryId, serviceId);
    if (existingUrl) return existingUrl;

    // Если нет - ищем в Pexels и загружаем
    const photos = await searchPexelsImages(keywords, 5);
    if (!photos || photos.length === 0) return null;

    // Берем первое фото
    const imageUrl = photos[0].url;

    // Загружаем в Storage
    const storageUrl = await uploadImageToStorage(
      imageUrl,
      categoryId,
      serviceId,
    );
    return storageUrl;
  } catch (error) {
    console.error("Ошибка получения изображения:", error);
    return null;
  }
}

/**
 * Проверить наличие изображения в Storage
 * @param {string} categoryId - ID категории
 * @param {string} serviceId - ID услуги
 * @returns {Promise<string|null>} - URL существующего изображения или null
 */
async function getExistingImage(categoryId, serviceId) {
  try {
    const folderRef = ref(storage, `images/${categoryId}`);
    const result = await listAll(folderRef);

    // Ищем файл, который начинается с serviceId
    const existingFile = result.items.find((item) =>
      item.name.startsWith(`${serviceId}-`),
    );

    if (existingFile) {
      return await getDownloadURL(existingFile);
    }

    return null;
  } catch (error) {
    // Папка может не существовать - это нормально
    return null;
  }
}

/**
 * Получить все изображения категории
 * @param {string} categoryId - ID категории
 * @returns {Promise<Array>} - массив объектов {serviceId, url}
 */
export async function getCategoryImages(categoryId) {
  try {
    const folderRef = ref(storage, `images/${categoryId}`);
    const result = await listAll(folderRef);

    const images = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        // Извлекаем serviceId из имени файла (формат: serviceId-timestamp.jpg)
        const serviceId = item.name.split("-")[0];
        return { serviceId, url };
      }),
    );

    return images;
  } catch (error) {
    console.error("Ошибка получения изображений категории:", error);
    return [];
  }
}
