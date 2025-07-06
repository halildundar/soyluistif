import express from "express";
import { DB } from "../mysql.js";
let router = express.Router({ mergeParams: true });
export const SlaytApi = (app) => {
  router.post("/ctrlpanel/slaytlar/add-item", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const items = await DB.Query("INSERT INTO `slayt` SET ?", [data]);
    return res.json({
      msg: "Ok!",
    });
  });
  router.post("/ctrlpanel/slaytlar/delete-item", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { id } = data;
    await DB.Query("DELETE FROM `slayt` WHERE id =" + id);
    return res.json({ msg: "OK!" });
  });
  router.post("/ctrlpanel/slaytlar/get-items", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { tur } = data;
    const items = await DB.Query(
      "SELECT * FROM `slayt` WHERE tur = ? ORDER BY sira ASC ",
      [tur]
    );
    return res.json(items);
  });
  router.post("/ctrlpanel/slaytlar/update-item", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { id, ...others } = data;
    await DB.Query("UPDATE `slayt` SET ?  WHERE id = " + id, [others]);
    return res.json({
      msg: "Ok!",
    });
  });
  return app.use("/", router);
};
