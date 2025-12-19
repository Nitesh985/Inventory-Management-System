import { asyncHandler } from "../utils/asyncHandler.ts"

const mockupData = (req, res, next)=>{
  req.body = {
    ...req.body,
    shopId:"6944bc853f9babde121576fd",
    clientId:'client1234'
  }

  next()
}

export { mockupData }