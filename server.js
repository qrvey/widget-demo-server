const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
const APP_ID = process.env.APP_ID;
const USER_ID = process.env.USER_ID;
const DASHBOARD_ID = process.env.DASHBOARD_ID;

// Authentication Middleware
async function getToken() {
  const body = {
    appid: APP_ID,
    userid: USER_ID,
    clientId: "eron",
    expiresIn: "10m",
  };

  const response = await axios.post(
    DOMAIN + "/devapi/v4/core/login/token",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    }
  );
  console.log("RESPONSE:", response);
  return JSON.stringify(response.data);
}

// Routes for each widget
app.get("/dashboard-view", async (req, res) => {
  try {
    const data = await getToken();
    res.send(`This is the dashboard view! Data: ${data}`);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
  }
});

// app.get("/dashboard-builder", (req, res) => {
//   res.send("This is the dashboard builder!");
// });

// Error Handling
app.use((req, res) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
