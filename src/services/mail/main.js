import express from "express";
let router = express.Router({ mergeParams: true });
import { createTransport } from "nodemailer";
export class Transport {
  trans;
  constructor() {
    this.trans = createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "soyluistif@gmail.com",
        pass: "xlyr fbro duba byen",
      },
    });
  }
  async sendMail({ to, subject, text, html }) {
    let icerik = {
      from: '"Soyluistif Makinaları" <soyluistif@gmail.com>',
      to: to, //"bar@example.com, baz@example.com",
      subject: subject, //"Hello ✔",
      html: html,
      text: text,
    };
    const info = await this.trans.sendMail(icerik);
    // console.log("Message sent:", info.messageId);
    return info;
  }
}
export let Mailer = async (app) => {
  //   const trans = Transport("noreply@artidoksancert.com", "kQ206?r3o");
  const noReplyMail = new Transport();
  router.post("/send-mail", async (req, res) => {
    const data = req.body;
    if (!data) {
      return res.json({ msg: "Hata!" });
    }
    const { subject, text, html } = data;
    const result = await noReplyMail.sendMail({
      to: "halildundar.eee@gmail.com",
      subject: subject,
      text: text,
      html: html,
    });
    return res.json(result);
  });
  return app.use("/", router);
};
