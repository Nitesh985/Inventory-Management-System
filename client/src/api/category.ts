import axios from "axios";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/categories`,
  withCredentials: true,
});

export interface Category {
  _id: string;
  name: string;
}

async function getCategories() {
  const res = await api.get("/");
  console.log(res.data)
  return res.data;
}

export {
  getCategories,
};
