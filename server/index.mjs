// MJS => (NUEVO) Exportacion de modulos y funciones obj,clases
//RUTAS
import productsRouter from "./routes/productsRouter.mjs";
import categoriesRouter from "./routes/categoriesRouter.mjs";
import blogRouter from "./routes/blogRouter.mjs";
import checkoutRouter from "./routes/checkoutRouter.mjs";

//MODULOS
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import { config } from "dotenv";

//VARIABLES DE ENTORNO
config({ path: "./.env" });

// INICIALIZAR APP Y PUERTO
const app = express();
const PORT = process.env.PORT || 4000;

// PATH BASE
const __filename = fileURLToPath(import.meta.url);
const __path = path.dirname(__filename);

// MIDDLEWARE

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || ["http://localhost:5173"],

    methods: ["PUT", "DELETE", "POST", "GET"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTAS
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/blog", blogRouter);
app.use("/api/checkout", checkoutRouter);

// INICAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto: ${PORT}`);
  console.log(__filename);
  console.log(__path);
  // console.log(configRoute?.baseUrl);
});

app.get("/", (req, res) => {
  //Enviar archivo de servidor index uniendo las rutas
  res.sendFile(path.join(__path, "public", "index.html"));
});
