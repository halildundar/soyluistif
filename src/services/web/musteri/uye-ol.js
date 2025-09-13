import { getMainMenu, GetEticLogos, GetSettings } from "../dbdata.js";
import { DB } from "../../mysql.js";
import { hashPassword,RandomId } from "../../crypt.js";
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
  console.log({id:0,...data,onay_kod:onay_kod});
  const {newpassw1,newpassw2,...others} = {id:0,...data,onay_kod:onay_kod}
  let dbdata = {id:0,passw:newpassw1,...others};
  //MAİL GÖNDER --> maildeki link >> http://localhost:3000/onay-kodu?urn=onayhsh
  const resa  = await DB.Query("INSERT INTO `musteriler` SET ?",[{...dbdata}]);
  return res.json({status:true,msg:'OK!'})
  // return res.json({...dbdata})
}
