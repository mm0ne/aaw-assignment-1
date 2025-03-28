const swaggerAutogen = require("swagger-autogen")();

let docs = {
  info: {
    title: "Orders and Cart API",
    description: "API documentation for the order and cart service",
  },
  tags: [
    {
      name: "Order and Cart",
      description: "Endpoints for order and cart",
    },
  ],
};

const outputFile = "./api.docs.json";
const endpointsFiles = ["./src/server.ts"];

swaggerAutogen(outputFile, endpointsFiles, docs);
