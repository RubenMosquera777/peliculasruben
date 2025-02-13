import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import peliculasRoutes from "./routes/peliculasRoutes.js";
import { llenarPeliculasDesdeMarvel } from "./controllers/peliculasController.js";
import Pelicula from "./models/Pelicula.js";

const MONGO_URI = "mongodb://localhost:27017/peliculasdb";
const PORT = 5000;

// Configurar __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Corregir la ruta de la carpeta `peliculas`
const publicPath = path.resolve(__dirname, "../");

// Crear la app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(publicPath));
app.use("/img", express.static(path.join(__dirname, "img"))); // Servir imágenes

// Rutas API
app.use("/api/peliculas", peliculasRoutes);

// Conectar a MongoDB y poblar si está vacío
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Conectado a MongoDB");

    const count = await Pelicula.countDocuments();
    if (count === 0) {
      console.log("Base de datos vacía. Llenando con datos de Marvel...");
      await llenarPeliculasDesdeMarvel();
    } else {
      console.log("La base de datos ya contiene datos.");
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("Error al conectar a MongoDB:", error));
