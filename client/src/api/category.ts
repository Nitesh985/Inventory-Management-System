import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface Category {
  _id: string;
  name: string;
}

async function getCategories() {
  const res = await api.get("/categories");
  return res.data;
}

export {
  getCategories,
};
