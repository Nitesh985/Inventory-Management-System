import { asyncHandler } from "../utils/asyncHandler.ts"

const mockupData = (req, res, next)=>{
  req.body = {
    ...req.body,
    shopId:"6944d4a4b9dd57ae6c785597",
    clientId:'client1234'
  }

  next()
}

export { mockupData }