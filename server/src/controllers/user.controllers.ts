import type { Request, Response } from 'express'
import User from '../models/user.models.ts'

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, fullName, contactNo } = req.body;

    const user = await User.create({
      email,
      fullName,
      contactNo
    });
    
    res.status(201).json({ user});
  } catch (error) {
    res.status(400).json({ error });
  }
};


export {
  registerUser,
}