  import "dotenv/config";
  import app from "./app.ts";
  import { connectToDB } from "./db/index.ts";

  
  
  connectToDB()
    .then(async () => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`The app is listening on http://localhost:${port}`);
      });
      
    })
    .catch((error) => {
      console.log("Connection to Mongodb failed ::", error);
    });
  
  console.log("Hello");
