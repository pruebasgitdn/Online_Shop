import React from "react";
import Container from "./Container";
import { Link } from "react-router-dom";
import Limiter from "./Limiter";
import Pagination from "./Pagination";
import Title from "./Title";

const ProductList = () => {
  return (
    <Container className="py-0 w-full my-8">
      <div className="justify-between flex items-center">
        <Title titulo="Productos más vendidos" />
        <Link to={"/product"} className="font-light text-sm">
          Ver todos los productos.
        </Link>
      </div>
      <Limiter />
      <Pagination />
    </Container>
  );
};

export default ProductList;
