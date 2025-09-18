import { getMainMenu, GetEticLogos, GetSettings } from "../dbdata.js";
import { DB } from "../../mysql.js";
import { hashPassword,RandomId } from "../../crypt.js";
import { SendActivationMail} from "../../mail/main.js";
export const UyeOlPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
     const sett = await GetSettings();
  res.render("pages/website/auth/uye-ol.hbs", {
    title: "Üye ol",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: [...mainMenus],
    wpno: sett.whatsappno,
  });
};

export const Uyeol = async(req,res)=>{
  if(!req.body){
    return res.json({status:false,msg:'Hata!'})
  }
  const data = req.body;
  let onay_kod = RandomId(6);
  let onayhsh = hashPassword(onay_kod);
  const {newpassw1,newpassw2,...others} = {id:0,...data,onay_kod:onay_kod};
  let isEmailRegistered = await DB.Query("SELECT id FROM `musteriler` WHERE email = ?",[others.email]);
  if(isEmailRegistered.length > 0){
      return res.json({status:false,msg:'Bu email adresi kayıtlıdır!'});
  }
  let dbdata = {id:0,passw:newpassw1,...others,role:'musteri'};
  const resa  = await DB.Query("INSERT INTO `musteriler` SET ?",[{...dbdata}]);
  await SendActivationMail(onay_kod,onayhsh,others.email);
  return res.json({status:true,msg:'OK!'});
}
