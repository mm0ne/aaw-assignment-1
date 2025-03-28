const swaggerAutogen = require("swagger-autogen")();

let docs = {
  info: {
    title: "Authentication API",
    description: "API documentation for the authentication service",
  },
  tags: [
    {
      name: "Authentication",
      description: "Endpoints for user authentication and authorization",
    },
  ],
};

const outputFile = "./api.docs.json";
const endpointsFiles = ["./src/server.ts"];

swaggerAutogen(outputFile, endpointsFiles, docs);
