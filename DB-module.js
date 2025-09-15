// DB-module.js
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config();
  } catch (_) {}
}

const uri = process.env.MONGODB_URI || process.env.DB; // acepta ambos nombres
if (!uri) {
  console.error("❌ No se encontró MONGODB_URI (o DB) en variables de entorno");
  process.exit(1);
}

mongoose.Promise = global.Promise;

// Para Mongoose 5.13 estos flags todavía aplican.
// Si subieras a Mongoose 6+, se pueden omitir.
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error("❌ MongoDB error:", err));
db.once("open", () => console.log("✅ Conectado a MongoDB"));

process.on("SIGINT", () => {
  db.close(() => {
    console.log("🔌 Cerrando conexión MongoDB");
    process.exit(0);
  });
});

module.exports = db;
