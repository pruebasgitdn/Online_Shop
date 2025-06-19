import React, { useEffect, useState } from "react";
import Container from "./Container";
import { getData } from "../lib";
import { config } from "../../config";
import { CategoryProps } from "../../type";
import Limiter from "./Limiter";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const TopCategories = () => {
  const [categoriesFetch, setCategoriesFetch] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `${config.baseUrl}/api/categories/all_categories`;

        const response = await getData(endpoint);
        if (response.status == 200) {
          setCategoriesFetch(response.data.data);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container
      className="
  w-full py-0 my-8"
    >
      <div className="flex justify-between items-center">
        <Title titulo="Categorias Populares" />
        <a href="#" className="font-light text-sm">
          Ver todas las categorias.
        </a>
      </div>
      <Limiter />
      <div
        className="grid grid-cols-2 md:grid-cols-3 
    lg:grid-cols-6"
      >
        {categoriesFetch.map((category: CategoryProps) => (
          <div
            key={category.id}
            className="flex-col flex hover:scale-110 transition-transform duration-150 my-2 hover:cursor-pointer"
            onClick={() => {
              navigate(`product?category=${category.name}`);
            }}
          >
            <img
              src={category.image}
              alt="img"
              className="rounded-xl object-contain w-full h-24 md:h-28"
            />
            <p className="text-sm text-center">{category.name}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TopCategories;
