import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bootstrap from "./app.js";

const app = express();

dotenv.config();
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    bootstrap(app);
  })
  .catch((err) => {
    console.error(`Source de l'erreur : ${err.message}`);
  });

// ORM
// ODM
