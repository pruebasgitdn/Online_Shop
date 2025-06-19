import React, { useEffect, useState } from "react";
import Container from "./Container";
import { getData } from "../lib";
import { config } from "../../config";
import Title from "./Title";
import { BlogProps } from "../../type";

const BlogPost = () => {
  const [blogFetch, setBlogFetch] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `${config.baseUrl}/api/blog/posts`;
        const response = await getData(endpoint);
        if (response.status === 200) {
          setBlogFetch(response.data);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);
  return (
    <Container>
      <Title titulo="Nuestras Publicaciones" className="text-center" />

      <div className="flex flex-row gap-3">
        {blogFetch.map((blog: BlogProps) => (
          <div
            key={blog._id}
            className="border-[1px] border-gray-200 rounded-md 
        flex flex-col bg-gradient-to-t from-gray-300 to-slate-100  hover:bg-slate-700 duration-700 hover:scale-90 hover:cursor-pointer
        "
          >
            <div className="h-60 w-full p-0">
              <img
                src={blog?.image}
                alt="img"
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <h2 className="text-black font-semibold text-center">
              {blog?.title}
            </h2>
            <h4 className="text-gray-900 text-xs text-end uppercase">
              {blog?._base}
            </h4>
            <p className="text-gray-500 text-xs text-justify">
              {blog?.description}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default BlogPost;
