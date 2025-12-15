import { asyncHandler } from "../utils/asyncHandler.ts"

const mockupData = (req, res, next)=>{
  req.body = {
    ...req.body,
    shopId:'69243c8f00b1f56bd2724e3a',
    clientId:'client1234'
  }

  next()
}

export { mockupData }