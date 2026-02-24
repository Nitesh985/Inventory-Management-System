import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface CreateReviewDTO {
  stars: number;
  content: string;
}

export interface Review {
  _id: string;
  shopId: string;
  userId: string;
  stars: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const createReview = async (data: CreateReviewDTO) => {
  const response = await api.post("/reviews", data, { withCredentials: true });
  return response.data;
};

export const getMyReview = async () => {
  const response = await api.get("/reviews/my-review", { withCredentials: true });
  return response.data;
};

export interface PublicReview {
  _id: string;
  stars: number;
  content: string;
  userName: string;
  userImage: string | null;
  shopName: string;
  businessType: string;
  createdAt: string;
}

export const getPublicReviews = async (limit: number = 6) => {
  const response = await api.get(`/reviews/public?limit=${limit}`);
  return response.data;
};
