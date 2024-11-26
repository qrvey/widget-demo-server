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
const CLIENT_ID = process.env.CLIENT_ID;
const DASHBOARD_ID = process.env.DASHBOARD_ID;
const SINGLE_PANEL_QRVEY_ID = process.env.SINGLE_PANEL_QRVEY_ID;
const SINGLE_PANEL_CHART_ID = process.env.SINGLE_PANEL_CHART_ID;
const WEBFORM_DESIGN_QRVEY_ID = process.env.WEBFORM_DESIGN_QRVEY_ID;
const WEBFORM_DESIGN_APP_TYPE = process.env.WEBFORM_DESIGN_APP_TYPE;
const ANALYTIC_SUITE_QRVEY_ID = process.env.ANALYTIC_SUITE_QRVEY_ID;
const AUTOMATION_WORKFLOW_ID = process.env.AUTOMATION_WORKFLOW_ID;

// Authentication Middleware
async function generateToken(body) {
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
  return response.data;
}

// Routes for each widget
app.get("/dashboard-view", async (req, res) => {
  try {
    const body = {
      appid: APP_ID,
      userid: USER_ID,
      clientid: CLIENT_ID,
      dashboardId: DASHBOARD_ID,
      expiresIn: "10m",
    };
    const token = await generateToken(body);
    console.log(token);
    res.send(token);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/dashboard-builder", async (req, res) => {
  try {
    const body = {
      appid: APP_ID,
      userid: USER_ID,
      clientid: CLIENT_ID,
      dashboardId: DASHBOARD_ID,
      expiresIn: "10m",
    };
    const token = await generateToken(body);
    console.log(token);
    res.send(token);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/download-manager", async (req, res) => {
  try {
    const body = {
      appid: APP_ID,
      userid: USER_ID,
      clientid: CLIENT_ID,
      expiresIn: "10m",
    };
    const token = await generateToken(body);
    console.log(token);
    res.send(token);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/webform-design", async (req, res) => {
  try {
    const body = {
      appid: APP_ID,
      userid: USER_ID,
      qrvey_id: WEBFORM_DESIGN_QRVEY_ID,
      expiresIn: "10m",
    };
    const token = await generateToken(body);
    console.log(token);
    res.send(token);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/analytic-suite", async (req, res) => {
  try {
    const body = {
      userid: USER_ID,
      qrveyid: ANALYTIC_SUITE_QRVEY_ID,
    };
    const token = await generateToken(body);
    console.log(token);
    res.send(token);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/pixel-perfect-report", async (req, res) => {
  try {
    const body = {
      appid: APP_ID,
      userid: USER_ID,
      clientid: CLIENT_ID,
    };
    const token = await generateToken(body);
    console.log(token);
    res.send(token);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/single-panel", async (req, res) => {
  try {
    const body = {
      appid: APP_ID,
      userid: USER_ID,
      qrveyId: SINGLE_PANEL_QRVEY_ID,
      chartId: SINGLE_PANEL_CHART_ID,
    };
    const token = await generateToken(body);
    console.log(token);
    res.send(token);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/automation", async (req, res) => {
  try {
    const body = {
      appid: APP_ID,
      userid: USER_ID,
      workflowId: AUTOMATION_WORKFLOW_ID,
    };
    const token = await generateToken(body);
    console.log(token);
    res.send(token);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error fetching data");
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
