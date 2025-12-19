import { asyncHandler } from "../utils/asyncHandler.ts"

const mockupData = (req, res, next)=>{
  req.body = {
    ...req.body,
    shopId:'693ffcd2c7c24d4f52587e42',
    clientId:'6942686616d7cfd0d2291b8a'
  }

  next()
}

export { mockupData }