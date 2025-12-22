import axios from "axios";

const api = axios.create({
  baseURL: "/api/users",
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

export {
  registerUser,
};
