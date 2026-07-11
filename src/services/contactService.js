// ==================== TELEGRAM ====================
const sendTelegramNotification = async (formData, isFallback = false) => {
  const webhookSecret = import.meta.env.VITE_WEBHOOK_SECRET;

  if (!webhookSecret) throw new Error("Webhook secret не настроен");

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-telegram`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": webhookSecret,
      },
      body: JSON.stringify({
        record: {
          ...formData,
          source: "waterdonetsk.ru",
          isFallback,
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText);
  }

  return true;
};