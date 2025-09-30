// Schema untuk validasi input
const createProductSchema = {
  body: {
    type: "object",
    required: ["name", "price", "stock"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      price: {
        type: "number",
        minimum: 0,
      },
      stock: {
        type: "integer",
        minimum: 0,
      },
    },
  },
};

const updateProductSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", minimum: 1 },
    },
  },
  body: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      price: {
        type: "number",
        minimum: 0,
      },
      stock: {
        type: "integer",
        minimum: 0,
      },
    },
    minProperties: 1, // Minimal satu property harus ada
  },
};

const getProductSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", minimum: 1 },
    },
  },
};

export { createProductSchema, updateProductSchema, getProductSchema };
