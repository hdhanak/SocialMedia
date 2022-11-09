import express from 'express'
import connects from './connection/db';
import router from "./router/routers";
const cors = require("cors");

const port = 8000 ||  process.env.PORT
const app = express()

app.use(express.json())
app.use(cors());

app.use('/',router)
connects()

app.listen(port,()=>{
    console.log(`port listining a ${port}`);
    
})

