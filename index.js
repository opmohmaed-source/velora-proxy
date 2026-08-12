const express = require("express");
const app = express();

app.use(express.json());

const FIREBASE_URL = "https://velora-32a75-default-rtdb.firebaseio.com";

// 1. مسار جلب إحصائيات التطبيق (يتم معالجته قبل مسار الـ Proxy)
app.get('/api/stats', async (req, res) => {
    try {
        const totalMembers = 150;  // إجمالي المسجلين
        const onlineMembers = 12;   // المتصلين حالياً

        res.json({
            success: true,
            total_members: totalMembers,
            online_members: onlineMembers
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 2. مسار الـ Proxy لمعالجة كافة الطلبات الموجهة لـ Firebase
app.use("*", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  const targetUrl = FIREBASE_URL + req.originalUrl;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "content-type": req.headers["content-type"] || "application/json",
        "host": "m.facebook.com",
      },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
