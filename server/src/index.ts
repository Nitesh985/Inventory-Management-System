import "dotenv/config.js";
import app from "./app.js";
import { connectToDB } from "./db/index.js";

// connectToDB()
//   .then(() => {
//     const port = process.env.PORT || 3000;
//     app.listen(port, () => {
//       console.log(`The app is listening on http://localhost:${port}`);
//     });
//   })
//   .catch((error) => {
//     console.log("Connection to Mongodb failed ::", error);
//   });

console.log("Hello")