import api from "./axiosApi";

export interface Category {
  _id: string;
  name: string;
}

async function getCategories() {
  const res = await api.get("/categories");
  console.log(res.data)
  return res.data;
}

export {
  getCategories,
};
