interface Configuration {
  baseUrl: string;
}

type ServerType = "local" | "production";

const checkConfiguration = (server: ServerType): Configuration => {
  switch (server) {
    case "production":
      return {
        baseUrl: "",
      };

    case "local":
      return {
        baseUrl: "http://localhost:3000",
      };

    default:
      throw Error("Tipo de servidor invalido.");
  }
};

const selectServer = "local";

// export const config = {
//   baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
// };
export const config = checkConfiguration(selectServer);
