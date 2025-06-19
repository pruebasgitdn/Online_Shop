import { useEffect, useState } from "react";
import { ProductProps } from "../../type";
import ReactPaginate from "react-paginate";
import Container from "./Container";
import Product from "../pages/Product";
import Limiter from "./Limiter";
import Button from "./Button";
import { formatPrice } from "../lib";

// COMPONENTE Items
interface ItemsProps {
  currentItems?: ProductProps[];
  priceFilter: {
    min: number | null;
    max: number | null;
  };
  inputMin: string;
  inputMax: string;
  errorRange: string | null;
  filterType: string;
  setInputMin: (val: string) => void;
  setInputMax: (val: string) => void;
  setFilterType: (val: string) => void;
  handlePriceFilter: () => void;
  setPriceFilter: (val: { min: number | null; max: number | null }) => void;
}

const Items = ({
  currentItems,
  priceFilter,
  inputMin,
  inputMax,
  errorRange,
  filterType,
  setInputMin,
  setInputMax,
  setFilterType,
  handlePriceFilter,
  setPriceFilter,
}: ItemsProps) => {
  return (
    <>
      <div className="p-2 ">
        <div className=" p-2 lg:flex md:gap-2 md:items-center md:justify-center lg:justify-end ">
          <div
            className=" flex flex-col 
          justify-center items-center
          md:flex-row
          gap-2
          md:my-2
          lg:my-0
          
          "
          >
            <label className="block text-slate-700 text-xs">Filtrar por:</label>

            <div className="w-auto">
              <label className="block text-xs mb-1 text-gray-500">
                Precio mín :
                <span className="font-bold text-black">
                  {priceFilter.min !== null ? formatPrice(priceFilter.min) : ""}
                </span>
              </label>
              <input
                type="number"
                className="border px-2 py-1 rounded md:w-36 w-full"
                id="min"
                value={inputMin}
                onChange={(e) => setInputMin(e.target.value)}
              />
            </div>

            <div className="w-auto">
              <label className="block text-xs mb-1 text-gray-500">
                Precio máx :
                <span className="font-bold text-black">
                  {priceFilter.max !== null ? formatPrice(priceFilter.max) : ""}
                </span>
              </label>
              <input
                type="text"
                className="border px-2 py-1 rounded md:w-36 w-full"
                id="max"
                value={inputMax}
                onChange={(e) => setInputMax(e.target.value)}
              />
            </div>

            {errorRange && (
              <div className="block">
                <span className="text-xs text-red-600">{errorRange}</span>
              </div>
            )}

            <Button
              text={
                priceFilter.max !== null && priceFilter.min !== null
                  ? `Quitar filtro`
                  : `Aplicar filtro`
              }
              className="text-xs p-3 bg-cyan-900 text-white rounded-md hover:opacity-80 w-auto my-auto mt-5"
              onClick={() => {
                if (priceFilter.max !== null && priceFilter.min !== null) {
                  setPriceFilter({ max: null, min: null });
                } else {
                  handlePriceFilter();
                }
              }}
            />
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-center gap-2 md:items-center md:justify-center
          lg:mt-2
          lg:ml-8
          "
          >
            <label className="block text-xs text-slate-700">Ordenar por:</label>
            <select
              className="border px-2 py-1 rounded text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="none">Sin orden</option>
              <option value="priceAsc">Precio: Menor a mayor</option>
              <option value="priceDesc">Precio: Mayor a menor</option>
              <option value="ratingDesc">Popularidad</option>
            </select>
          </div>
        </div>
      </div>

      <Limiter className="my-2 w-full" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 my-5">
        {currentItems &&
          currentItems.map((item: ProductProps) => (
            <Product key={item._id} item={item} />
          ))}
      </div>
    </>
  );
};

// COMPONENTE PRINCIPAL
interface Props {
  allProducts: ProductProps[];
}

const PaginatedProducts = ({ allProducts }: Props) => {
  const [filterType, setFilterType] = useState<
    "priceAsc" | "priceDesc" | "ratingDesc" | "none" | string
  >("none");

  const [priceFilter, setPriceFilter] = useState<{
    min: number | null;
    max: number | null;
  }>({ max: null, min: null });

  const [errorRange, setErrorRange] = useState<string | null>(null);
  const [inputMin, setInputMin] = useState<string>("");
  const [inputMax, setInputMax] = useState<string>("");

  const handlePriceFilter = () => {
    const min = parseFloat(inputMin);
    const max = parseFloat(inputMax);

    if (isNaN(min) || isNaN(max)) {
      setErrorRange("Debes ingresar ambos precios (mínimo y máximo)");
      return;
    }

    if (min < 0 || max < 0) {
      setErrorRange("Los precios no pueden ser negativos");
      return;
    }

    if (max < min) {
      setErrorRange("El precio máximo no puede ser menor que el mínimo");
      return;
    }

    setErrorRange(null);
    setPriceFilter({ min, max });
  };

  useEffect(() => {
    setItemOffSet(0);
    setItemStart(1);
  }, [filterType, priceFilter]);

  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    switch (filterType) {
      case "priceAsc":
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "ratingDesc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    if (priceFilter.min !== null) {
      filtered = filtered.filter(
        (product) => product.discountedPrice >= priceFilter.min
      );
    }

    if (priceFilter.max !== null) {
      filtered = filtered.filter(
        (product) => product.discountedPrice <= priceFilter.max
      );
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const itemsPerPage = 8;
  const [itemOffSet, setItemOffSet] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const endOffset = itemOffSet + itemsPerPage;

  const currentItems = filteredProducts.slice(itemOffSet, endOffset);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageClick = (event: any) => {
    const newOffSet = (event.selected * itemsPerPage) % allProducts.length;
    const newStart = newOffSet + 1;
    setItemOffSet(newOffSet);
    setItemStart(newStart);
  };

  return (
    <Container className="py-0">
      <Items
        currentItems={currentItems}
        priceFilter={priceFilter}
        inputMin={inputMin}
        inputMax={inputMax}
        errorRange={errorRange}
        filterType={filterType}
        setInputMin={setInputMin}
        setInputMax={setInputMax}
        setFilterType={setFilterType}
        handlePriceFilter={handlePriceFilter}
        setPriceFilter={setPriceFilter}
      />

      <div className="flex flex-col md:flex-row justify-center items-center">
        <ReactPaginate
          nextLabel=""
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          previousLabel=""
          onPageChange={handlePageClick}
          pageCount={pageCount}
          containerClassName="flex justify-center items-center my-4"
          pageLinkClassName="bg-white text-stone-900 border border-gray-300 hover:bg-gray-300 hover:cursor-pointer rounded-md transition duration-300 w-10 h-10 flex items-center justify-center"
          pageClassName="mx-1"
          activeClassName="bg-black text-white"
        />
      </div>

      <p className="text-end">
        Producto {itemStart} hasta {Math.min(endOffset, allProducts?.length)}/
        {allProducts?.length}
      </p>
    </Container>
  );
};

export default PaginatedProducts;
