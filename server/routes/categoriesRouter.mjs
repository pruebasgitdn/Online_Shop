import express from "express";
import { categories, products } from "../constants/index_constants.mjs";
const router = express.Router();

router.get("/all_categories", (req, res) => {
  try {
    const categ = categories.map((cat) => cat);

    return res.status(200).json({
      message: `Se pudieron obtener las categorias`,
      success: true,
      data: categ,
    });
  } catch (error) {
    return res.status(404).json({
      message: `No se pudieron obtener las categorias`,
      success: false,
    });
  }
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.filter((cat) => cat.id == id);

  if (!category || category == null || category.length == 0) {
    return res.status(404).json({
      message: `No hay categorias por ese id: ${id}`,
      success: false,
    });
  }
  return res.status(200).json({
    message: `Se encontro la categoria: ${id}`,
    data: category,
    success: true,
  });
});

export default router;
