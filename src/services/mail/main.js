import express from "express";
let router = express.Router({ mergeParams: true });
import { createTransport } from "nodemailer";
import { HOST_NAME } from "../main.js";
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
    const { subject, text, html, toEmail } = data;
    const result = await noReplyMail.sendMail({
      to: !!toEmail ? toEmail : "halildundar.eee@gmail.com",
      subject: subject,
      text: text,
      html: html,
    });
    return res.json(result);
  });
  return app.use("/", router);
};
export const SendActivationMail = async (cdn,urn,toEmail) => {
  try {
    const noReplyMail = new Transport();
    const result = await noReplyMail.sendMail({
      to: toEmail,
      subject: "Aktivasyon işlemi | Soyluistif Makinaları",
      text: "",
      html: `<div style="padding:40px 10px;text-align:center;">
    <div><strong>Aktivasyon işlemi için lütfen alttaki linke gidiniz</strong></div>
     <div style="text-align:center;font-size:16px;">
        <a href="${HOST_NAME}/cust/activation?urn=${urn}&cdn=${cdn}" target="_blank"
            style="text-decoration:underline;color:blue">Aktivasyon yap</a>
    </div>
    <div style="padding:5px 10px; background-color:rgba(0,0,0,0.2); font-weight:700;font-size:24px;">${cdn}</div>
    <div>Lütfen yukarıdaki linkten aktivasyon yapabilirsiniz</div>
</div>`,
    });
    return "Sended";
  } catch (error) {
    console.log(error);
  }
};
export const SendSifreDegistirmeMail = async (cdn,urn,toEmail) => {
  try {
    const noReplyMail = new Transport();
    const result = await noReplyMail.sendMail({
      to: toEmail,
      subject: "Aktivasyon işlemi | Soyluistif Makinaları",
      text: "",
      html: `<div style="padding:40px 10px;text-align:center;">
    <div><strong style="font-size:18px">Şifre değişiklik işlemi için lütfen alttaki linke gidiniz</strong></div>
     <div style="text-align:center;font-size:16px;">
        <a href="${HOST_NAME}/cust/chngepassw?urn=${urn}&cdn=${cdn}" target="_blank"
            style="text-decoration:underline;color:blue">Şifre Değişikliğe Git</a>
    </div>
    <div style="text-align:center">
        <div style="padding:10px;border-radius:5px; background-color:rgba(0,0,0,0.2); font-weight:700; font-size:24px;">${cdn}</div>
    </div>
   
    <div>Lütfen yukarıdaki linkten şifre değiştirebilirsiniz ulaşabilirsiniz!</div>
</div>`,
    });
    return "Sended";
  } catch (error) {
    console.log(error);
  }
};
