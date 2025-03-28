const swaggerAutogen = require("swagger-autogen")();

let docs = {
  info: {
    title: "Product API",
    description: "API documentation for the Product service",
  },
  tags: [
    {
      name: "Product",
      description: "Endpoints for Product",
    },
  ],
};

const outputFile = "./api.docs.json";
const endpointsFiles = ["./src/server.ts"];

swaggerAutogen(outputFile, endpointsFiles, docs);
