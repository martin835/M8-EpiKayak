import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

const server = express();
const port = process.env.port || 5001;

//passport.use("google", googleStrategy);

//***********************************Middlewares*******************************************************/

server.use(cors());
server.use(express.json());
//server.use(passport.initialize());

//***********************************Endpoints*********************************************************/

//***********************************Error handlers****************************************************/

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("👌 Connected to Mongo!");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`🚀 Server listening on port ${port}`);
  });
});
