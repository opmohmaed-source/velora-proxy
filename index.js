const express = require("express");
const app = express();

app.use(express.json());

const FIREBASE_URL = "https://velora-32a75-default-rtdb.firebaseio.com";

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
      
