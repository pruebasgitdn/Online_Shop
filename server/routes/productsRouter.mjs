import express from "express";
// import { products } from "../constants/index_constants.mjs";
import { supabase } from "../supabaseClient.mjs";

const router = express.Router();

router.get("/all_products", async (req, res) => {
  try {
    const { data: products, error } = await supabase.from("products").select();

    if (error) {
      throw error;
      return;
    }
    return res.status(200).json({
      message: `Se encontrarron los productos`,
      data: products,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/product/:_id", async (req, res) => {
  const id = parseInt(req.params._id);

  // const product = products.filter((prod) => prod._id == id);
  const { data: product, error } = await supabase
    .from("products")
    .select()
    .eq("_id", id);

  if (error) {
    throw error;
    return;
  }

  if (!product || product == null || product.length == 0) {
    return res.status(404).json({
      message: `No hay productos por ese id: ${id}`,
      success: false,
    });
  }
  return res.status(200).json({
    message: `Se encontro el producto: ${id}`,
    data: product,
    success: true,
  });
});

router.get("/categories", async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("category");

    if (error) throw error;

    const setCategories = new Set(products.map((p) => p.category));
    const categories = Array.from(setCategories);

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        message: `No se encontraron las categorías`,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Se encontraron las categorías`,
      data: categories,
      success: true,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return res.status(500).json({
      message: "Error interno al obtener categorías",
      success: false,
    });
  }
});

router.get("/categories/:categorie", async (req, res) => {
  const categorie = req.params.categorie;

  try {
    const { data: fetchedCategorie, error } = await supabase
      .from("products")
      .select()
      .eq("category", categorie);

    if (error) throw error;

    if (!fetchedCategorie || fetchedCategorie.length === 0) {
      return res.status(404).json({
        message: `No se encontraron productos por la categoría: ${categorie}`,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Se encontraron los productos por categoría`,
      data: fetchedCategorie,
      success: true,
    });
  } catch (error) {
    console.error("Error al buscar productos por categoría:", error);
    return res.status(500).json({
      message: "Error interno al buscar productos por categoría",
      success: false,
    });
  }
});

//buscar por ids para el thunk del cart
router.post("/get_cart_products", async (req, res) => {
  try {
    const { product_id } = req.body;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("_id", product_id);

    if (error) {
      return res.status(400).json({
        message: `Error ${error}`,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Meloso`,
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
