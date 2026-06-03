const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const authRoutes = require("./routes/auth.routes" );
const articleRoutes = require("./routes/article.routes");
const communityRoutes = require("./routes/community.routes");
const commentRoutes = require("./routes/comment.routes");
const eventRoutes = require("./routes/event.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const searchRoutes = require("./routes/search.routes");
const uploadRoutes = require("./routes/upload.routes");
const mentalRoutes = require("./routes/mental.routes");
const skinRoutes = require("./routes/skin.routes");
const chatbotRoutes = require("./routes/chatbot.routes");

const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Dermind API Running",
  });
});
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dermind API",
      version: "1.0.0",
      description: "Dermind Backend API Documentation",
    },
    servers: [
      {
        url: "http://localhost:5002/api",
      },
    ],
  },
  apis: [
    "./src/routes/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(
  swaggerOptions
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use("/api/auth",authRoutes);
app.use("/api/articles",articleRoutes);
app.use("/api/community",communityRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/search",searchRoutes);
app.use("/api/mental",mentalRoutes);
app.use("/api/skin",skinRoutes);
app.use("/api/chatbot",chatbotRoutes);

app.get("/test-swagger", (req, res) => {
  res.send("Swagger route works");
});
app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

app.use(
  "/api/upload",
  uploadRoutes
);
module.exports = app;