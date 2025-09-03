import express from "express"
import dotenv from "dotenv"
import {db} from "./db.js"
import bodyParser from "body-parser";
dotenv.config();
const app = express()
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//importing person router files...
import {userRouter} from "./routes/userRouter.js"
import {candidateRouter} from "./routes/candidateRouter.js"

//Use the router
app.use("/user",userRouter);
app.use("/candidate",candidateRouter);

app.listen(PORT, () => {
  console.log(`Voting app listening on port ${PORT}`)
})
