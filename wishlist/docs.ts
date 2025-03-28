const swaggerAutogen = require("swagger-autogen")();

let docs = {
  info: {
    title: "Wishlist API",
    description: "API documentation for the Wishlist service",
  },
  tags: [
    {
      name: "Wishlist",
      description: "Endpoints for user Wishlist and authorization",
    },
  ],
};

const outputFile = "./api.docs.json";
const endpointsFiles = ["./src/server.ts"];

swaggerAutogen(outputFile, endpointsFiles, docs);
