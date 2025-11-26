  import "dotenv/config";
  import app from "./app.ts";
  import { connectToDB } from "./db/index.ts";

  // Notes
  // 1. Add some more stuff for shop its reviews, keep the counter of shops joined, transactions with us the admin, 
  // 2. Migration options (import & export)
  // 3. Payment options (cancel anytime, 7-day free trial {money back stuff handling})
  // 4. Demo Video
  
  
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
