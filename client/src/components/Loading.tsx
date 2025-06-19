import React from "react";
import { BounceLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-full h-full bg-black/80 absolute top-0 left-0 flex flex-col gap-8 items-center justify-center">
      <BounceLoader
        color="white"
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />

      <p className="text-white text-center text-2xl font-semibold">
        Cargando...
      </p>
    </div>
  );
};

export default Loading;
