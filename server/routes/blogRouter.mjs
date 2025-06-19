import express from "express";
import { blogPosts } from "../constants/index_constants.mjs";

const router = express.Router();

router.get("/posts", (req, res) => {
  res.send(blogPosts);
});

router.get("/post/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const blog = blogPosts.filter((blg) => blg._id == id);

  if (!blog || blog == null || blog.length == 0) {
    return res.status(404).json({
      message: `No hay blogs por ese id: ${id}`,
      success: false,
    });
  }
  return res.status(200).json({
    message: `Se encontro el blog: ${id}`,
    data: blog,
    success: true,
  });
});

export default router;
