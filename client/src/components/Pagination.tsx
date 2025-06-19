import { useEffect, useState } from "react";
import { config } from "../../config";
import { getData } from "../lib";
import { ProductProps } from "../../type";
import ReactPaginate from "react-paginate";
import Container from "./Container";
import Product from "../pages/Product";

const Pagination = () => {
  const [productsFetch, setProductsFetch] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `${config.baseUrl}/api/products/all_products`;

        const response = await getData(endpoint);
        if (response.status == 200) {
          console.log(response.data.data.slice(0, 20));
          setProductsFetch(response.data.data.slice(0, 20));
          console.log(response);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  interface ItemsProps {
    currentItems?: ProductProps[];
  }

  const Items = ({ currentItems }: ItemsProps) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 my-5">
        {currentItems &&
          currentItems?.map((item: ProductProps) => (
            <Product key={item._id} item={item} />
          ))}
      </div>
    );
  };

  const itemsPerPage = 12;
  const [itemOffSet, setItemOffSet] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const endOffset = itemOffSet + itemsPerPage;

  const currentItems = productsFetch.slice(itemOffSet, endOffset);
  const pageCount = Math.ceil(productsFetch.length / itemsPerPage);

  const handlePageClick = (event: any) => {
    const newOffSet = (event.selected * itemsPerPage) % productsFetch.length;

    const newStart = newOffSet + 1;
    console.log(`Loading items from ${itemOffSet} to ${endOffset}`);

    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffSet}`
    );

    setItemOffSet(newOffSet);
    setItemStart(newStart);
  };

  return (
    <Container className="py-0">
      <Items currentItems={currentItems}></Items>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <ReactPaginate
          nextLabel=""
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          previousLabel=""
          onPageChange={handlePageClick}
          pageCount={pageCount}
          containerClassName="flex justify-center items-center my-4"
          pageLinkClassName="bg-white text-stone-900 border border-gray-300 hover:bg-gray-200 rounded-md transition duration-300 w-10 h-10 flex items-center justify-center"
          pageClassName="mx-1"
          activeClassName="bg-black text-white"
        />
      </div>
      <p className="text-end">
        Producto {itemStart} hasta {Math.min(endOffset, productsFetch?.length)}/
        {productsFetch?.length}
      </p>
    </Container>
  );
};

export default Pagination;
