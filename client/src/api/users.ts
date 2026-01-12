import axios from "axios";

const api = axios.create({
  baseURL: "/api/users",
  withCredentials: true,
});


export interface RegisterUserDTO {
  fullName: string;
  email: string;
  password: string;
}


export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface UserProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: string;
  };
  activeShop: {
    phone: string;
    shopName: string;
    shopEmail: string;
  } | null;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

async function sendVerificationCode (){
  try{
    const res = await api.get("/send-verification-code")
    return res.data
  } catch(error) {
    console.error(error)
    throw error
  }
}

async function verifyOtpCode({inputCode}:{inputCode:string}){
  try{
    const res = await api.get("/verify-code", {inputCode})
    return res.data
  } catch(error) {
    console.error(error)
    throw error
  }
}

async function registerUser(
  data: RegisterUserDTO
): Promise<User> {
  try{
    const res = await api.post<User>("/register", data);
    return res.data;

  } catch(error){
    console.log(error)
    throw error;
  }
}


async function getUserProfile(): Promise<ApiResponse<UserProfileResponse>> {
  const res = await api.get<ApiResponse<UserProfileResponse>>("/profile");
  return res.data;
}


async function updateUserProfile(data: { contactNo?: string }): Promise<ApiResponse<any>> {
  const res = await api.patch<ApiResponse<any>>("/profile", data);
  return res.data;
}


export {
  registerUser,
  getUserProfile,
  updateUserProfile,
  sendVerificationCode,
  verifyOtpCode
};
