/**
 * Cloud Functions для автоматической загрузки тематических изображений
 * Использует Pexels API для поиска и Firebase Storage для хранения
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

const PEXELS_API = "https://api.pexels.com/v1/search";

// Маппинг категорий и ключевых слов для поиска
const CATEGORY_KEYWORDS = {
  furniture: "furniture assembly",
  handyman: "home repair handyman",
  plumbing: "plumbing bathroom",
  electrical: "electrical wiring",
  windows: "window repair",
  minor_repair: "home renovation",
};

// Специфичные ключевые слова для услуг
const SERVICE_KEYWORDS = {
  // furniture
  "furniture.wardrobe-assembly": "wardrobe cabinet",
  "furniture.kitchen-assembly": "kitchen cabinets",
  "furniture.bed-assembly": "bed bedroom",

  // plumbing
  "plumbing.sink-installation": "sink bathroom",
  "plumbing.toilet-installation": "toilet bathroom",
  "plumbing.shower-cabin-installation": "shower cabin",

  // electrical
  "electrical.outlet-installation": "electrical outlet",
  "electrical.light-fixture-installation": "ceiling light",

  // windows
  "windows.window-adjustment": "window frame",

  // handyman
  "handyman.wallpaper-installation": "wallpaper wall",
  "handyman.tile-laying": "tile bathroom",
};

/**
 * Поиск изображений через Pexels API
 */
async function searchPexelsImages(query, apiKey, count = 5) {
  try {
    const params = new URLSearchParams({
      query,
      per_page: count,
      orientation: "landscape",
    });

    const response = await fetch(`${PEXELS_API}?${params}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      console.error("Pexels API error:", response.status);
      return [];
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error("Ошибка поиска в Pexels:", error);
    return [];
  }
}

/**
 * Скачать и загрузить изображение в Storage
 */
async function uploadImageToStorage(imageUrl, categoryId, serviceId) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = await response.buffer();
    const timestamp = Date.now();
    const fileName = `${serviceId}-${timestamp}.jpg`;
    const storagePath = `images/${categoryId}/${fileName}`;

    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);

    await file.save(buffer, {
      metadata: {
        contentType: "image/jpeg",
        cacheControl: "public, max-age=31536000",
      },
    });

    await file.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
  } catch (error) {
    console.error("Ошибка загрузки в Storage:", error);
    return null;
  }
}

/**
 * HTTP функция для загрузки изображений для всех услуг
 * Вызов: POST /loadServiceImages
 * Body: { "pexelsApiKey": "your-key", "categoryId": "plumbing" (опционально) }
 */
exports.loadServiceImages = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { pexelsApiKey, categoryId } = req.body;

  if (!pexelsApiKey) {
    res.status(400).json({ error: "pexelsApiKey обязателен" });
    return;
  }

  try {
    const db = admin.firestore();
    const results = [];

    // Получаем категории из Firestore или используем переданную
    let categories = [];
    if (categoryId) {
      categories = [categoryId];
    } else {
      categories = Object.keys(CATEGORY_KEYWORDS);
    }

    for (const catId of categories) {
      const categoryKeywords = CATEGORY_KEYWORDS[catId] || catId;

      // Получаем услуги категории из Firestore
      const servicesSnapshot = await db
        .collection("services")
        .where("categoryId", "==", catId)
        .get();

      if (servicesSnapshot.empty) {
        console.log(`Нет услуг для категории ${catId}`);
        continue;
      }

      for (const doc of servicesSnapshot.docs) {
        const service = doc.data();
        const serviceId = doc.id;

        // Проверяем, есть ли уже imageUrl
        if (service.imageUrl) {
          console.log(`У ${serviceId} уже есть изображение`);
          continue;
        }

        // Определяем ключевые слова для поиска
        const searchKey = `${catId}.${serviceId}`;
        const keywords = SERVICE_KEYWORDS[searchKey] || categoryKeywords;

        // Ищем изображения
        const photos = await searchPexelsImages(keywords, pexelsApiKey, 5);
        if (photos.length === 0) {
          console.log(`Не найдено изображений для ${serviceId}`);
          continue;
        }

        // Берем первое фото
        const photo = photos[0];
        const imageUrl = photo.src.large;

        // Загружаем в Storage
        const storageUrl = await uploadImageToStorage(
          imageUrl,
          catId,
          serviceId,
        );

        if (storageUrl) {
          // Обновляем документ в Firestore
          await doc.ref.update({
            imageUrl: storageUrl,
            imageSource: "pexels",
            imagePhotographer: photo.photographer,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          results.push({
            categoryId: catId,
            serviceId,
            imageUrl: storageUrl,
            status: "success",
          });
        } else {
          results.push({
            categoryId: catId,
            serviceId,
            status: "failed",
          });
        }

        // Задержка между запросами (Pexels rate limit)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    res.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Scheduled функция для автоматического обновления изображений
 * Запускается раз в неделю
 */
exports.scheduledImageUpdate = functions.pubsub
  .schedule("0 0 * * 0") // Каждое воскресенье в полночь
  .timeZone("Europe/Moscow")
  .onRun(async (context) => {
    const pexelsApiKey = functions.config().pexels?.apikey;

    if (!pexelsApiKey) {
      console.error("Pexels API key не настроен");
      return null;
    }

    // Логика аналогична loadServiceImages
    console.log("Запуск автоматического обновления изображений");
    return null;
  });
