const swaggerAutogen = require("swagger-autogen")();

let docs = {
  info: {
    title: "Tenant API",
    description: "API documentation for the tenant service",
  },
  tags: [
    {
      name: "Tenant",
      description: "Endpoints for tenant",
    },
  ],
};

const outputFile = "./api.docs.json";
const endpointsFiles = ["./src/server.ts"];

swaggerAutogen(outputFile, endpointsFiles, docs);
