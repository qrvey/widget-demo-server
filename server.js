const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const ORG_ID = process.env.ORG_ID;
const DOMAIN = process.env.DOMAIN;
const APP_ID = process.env.APP_ID;
const USER_ID = process.env.USER_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const DASHBOARD_ID = process.env.DASHBOARD_ID;
const WEBFORM_DESIGN_QRVEY_ID = process.env.WEBFORM_DESIGN_QRVEY_ID;
const ANALYTIC_SUITE_QRVEY_ID = process.env.ANALYTIC_SUITE_QRVEY_ID;

// Allow specific origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Authentication Middleware
async function generateToken(body, baseUrl) {
  const response = await axios.post(
    baseUrl + "/devapi/v4/core/login/token",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    }
  );
  console.log("RESPONSE:", response);
  return response.data;
}


// Known widget names and their default configs
const defaultConfigs = {
  "dashboards": { 
    appid: APP_ID,
    userid: USER_ID,
    orgId: ORG_ID,
    clientid: CLIENT_ID,
    dashboardId: DASHBOARD_ID,
    expiresIn: "10m", 
  },
  "dashboard-view": {
    appid: APP_ID,
    userid: USER_ID,
    clientid: CLIENT_ID,
    dashboardId: DASHBOARD_ID,
    expiresIn: "10m"
  },
  "dashboard-builder": { 
    appid: APP_ID,
    userid: USER_ID,
    clientid: CLIENT_ID,
    dashboardId: DASHBOARD_ID,
    expiresIn: "10m", 
  },
  "download-manager": {       
    appid: APP_ID,
    userid: USER_ID,
    clientid: CLIENT_ID,
    expiresIn: "10m", 
  },
  "analytic-suite": { 
    userid: USER_ID,
    clientid: CLIENT_ID,
    qrveyid: ANALYTIC_SUITE_QRVEY_ID,
  },
  "pixel-perfect-report": {  
    appid: APP_ID,
    userid: USER_ID,
    clientid: CLIENT_ID, 
  },
  "single-panel": { 
    appid: APP_ID,
    userid: USER_ID, 
  },
  "automation": { 
    appid: APP_ID,
    userid: USER_ID,
    clientid: CLIENT_ID,
   }
};

// Dynamic POST route for widget tokens
app.post("/:widget", async (req, res, next) => {
  const { widget } = req.params;
  const { urlOverride, configOverride } = req.body;
  if (!defaultConfigs.hasOwnProperty(widget)) {
    return next();
  }
  
  try {
    const baseUrl = urlOverride? urlOverride: DOMAIN;
    const config = configOverride || defaultConfigs[widget];
    const token = await generateToken(config, baseUrl);
    console.log(`[${widget}] token:`, token);
    res.send(token);
  } catch (err) {
    console.error(`Error in widget route [${widget}]:`, err);
    res.status(500).send("Error generating token");
  }
});

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

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
