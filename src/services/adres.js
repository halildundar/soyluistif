import express from "express";
import { DB } from "./mysql.js";
let router = express.Router({ mergeParams: true });
// import { DB } from "./mysql.js";
export const AdresApi = (app) => {
  router.post("/get-il", GetIl);
  router.post("/get-iller", GetIller);
  router.post("/get-ilce", GetIlce);
  router.post("/get-ilceler", GetIlceler);
  router.post("/get-mahalle", GetMahalle);
  router.post("/get-mahalleler", GetMahalleler);
  return app.use("/", router);
};
const GetMahalleler = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.json({ msg: "Data not found" });
  }
  const { il_id,ilce_id } = data;
  const rows = await DB.Query("SELECT * FROM `mahalleler` where il_id = ? AND ilce_id = ?",[il_id,ilce_id]);
  return res.json({
    ...rows
  });
};
const GetIlceler = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.json({ msg: "Data not found" });
  }
  const { il_id } = data;
  const rows = await DB.Query("SELECT * FROM `ilceler` where il_id = ?",[il_id]);
  return res.json({
    ...rows
  });
};
const GetIller = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.json({ msg: "Data not found" });
  }
  const rows = await DB.Query("SELECT * FROM `iller`");
  return res.json({
    ...rows
  });
};
const GetIl = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.json({ msg: "Data not found" });
  }
  const {il_id} = data;
  const rows = await DB.Query("SELECT * FROM `iller` WHERE id = ?",[il_id]);
  return res.json({
    ...rows
  });
};
const GetIlce = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.json({ msg: "Data not found" });
  }
  const {ilce_id} = data;
  const rows = await DB.Query("SELECT * FROM `ilceler` WHERE id = ?",[ilce_id]);
  return res.json({
    ...rows
  });
};
const GetMahalle = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.json({ msg: "Data not found" });
  }
  const {mahalle_id} = data;
  const rows = await DB.Query("SELECT * FROM `mahalleler` WHERE id = ?",[mahalle_id]);
  return res.json({
    ...rows
  });
};