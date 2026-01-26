import 'dotenv/config';
import { connectToDB } from './db/index.ts';
import app from './app.ts';


connectToDB()
  .then(async()=>{
 

  })
  .then(async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`The app is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log('Connection to Mongodb failed ::', error);
  });
