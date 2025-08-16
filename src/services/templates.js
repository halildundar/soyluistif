import express from "express";
let router = express.Router({ mergeParams: true });
import {readFileSync} from 'node:fs';
// import { ArtiDoksanCertDB } from "./mysql.js";
export const TemplateApi = (app) => {
    router.post("/template/get-txt", (req,res)=>{
        if(!req.body){
            return res.json({msg:'Error!'})
        }
        const {filepath} = req.body;
        res.setHeader('Content-Type','text/plain');
        const tempHtml = readFileSync(`${process.cwd()}/public/templates/${filepath}`,'utf-8');
        return res.send(tempHtml);
    });
  return app.use("/", router);
};
