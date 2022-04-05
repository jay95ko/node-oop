import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { test } from './test';
// const test = require('./test')

class App {
  public application : express.Application;
  constructor(){
    this.application = express();
  }
}
const app = new App().application;
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.get("/",(req : express.Request , res : express.Response) =>{
  res.send("start");
})
// test
app.listen(4000,()=>console.log("start"));