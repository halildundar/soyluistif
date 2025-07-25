import { myloc } from "../main.js";
import { SepetStatus} from './util/main.js';
const getUrunler = (ids) => {
  return $.ajax({
    type: "POST",
    url: "/sepet/get-urunler",
    data: { ids: ids },
    dataType: "json",
  });
};
const getTemp = async (temname) => {
  const temp = await $.ajax({
    type: "POST",
    url: "/templates/get-temp",
    data: { folderpath: temname },
  });
  return temp;
};
const getSepet = () => {
  let sepet = myloc.getItem("sepet");
  return sepet.map((it) => {
    it.adet = Number(it.adet);
    return it;
  });
};
const makeTotal = (urunler) => {
  let toplamTutar = 0;
  let kdvToplam = 0;
  let inidirimTutar = 0;
  let indirim = 0;
  for (let i = 0; i < urunler.length; i++) {
    const urun = urunler[i];
    toplamTutar += urun.adet * urun.fiyat;
    inidirimTutar += urun.adet * urun.indirimli_fiyat;
    kdvToplam += urun.adet * urun.fiyat * 0.2;
  }
  indirim = toplamTutar - inidirimTutar;
  let total = inidirimTutar + kdvToplam;
  $(".toplam_tutar").html('+'+ toplamTutar + ".00₺");
  $(".total_kdv").html('+'+kdvToplam + ".00₺");
  $(".total_indirim").html('-'+ indirim + ".00₺");
  $(".toplam").html(total + ".00₺");
};
export const SepetInit = async () => {
  let sepet = getSepet();
  const ids = sepet.map((item) => item.id);
  const strTemp = await getTemp("sepeturunrow.html");
  const rendred = Handlebars.compile(strTemp);
  if (ids.length != 0) {
    let urunler = await getUrunler(ids);
    urunler = urunler.map((urun) => {
      const { adet } = sepet.find((it) => it.id == urun.id);
      let resimler = JSON.parse(urun.resimler);
      return {
        ...urun,
        fiyat: Number(urun.fiyat),
        resim:
          !!resimler && !!resimler[0]
            ? "/uploads" + resimler[0]
            : "/assets/urun/resim_yok.webp",
        adet: adet,
      };
    });
   makeTotal(urunler);
    $(".spetbfyLeft").html(rendred({ urunler: urunler }));
    for (let i = 0; i < urunler.length; i++) {
      let urun = urunler[i];
      $(`tr[data-ur='${urun.id}'] .btn-subsepet`).on("click", function () {
        urun.adet -= 1;
        if (urun.adet <= 0) {
          urun.adet = 1;
        }
        $(`tr[data-ur='${urun.id}'] .in-adetsepet`).val(urun.adet);
        let findedSepetUrun = sepet.find((it) => it.id == urun.id);
        findedSepetUrun.adet = urun.adet;
        myloc.setItem("sepet", findedSepetUrun);
        sepet = myloc.getItem("sepet");
           makeTotal(urunler);
      });
      $(`tr[data-ur='${urun.id}'] .btn-addsepet`).on("click", function () {
        urun.adet += 1;
        $(`tr[data-ur='${urun.id}'] .in-adetsepet`).val(urun.adet);
        sepet = sepet.map((it) => {
          if (it.id == urun.id) {
            it.adet = urun.adet;
          }
          return it;
        });
        $(`tr[data-ur='${urun.id}'] .in-adetsepet`).val(urun.adet);
        let findedSepetUrun = sepet.find((it) => it.id == urun.id);
        findedSepetUrun.adet = urun.adet;
        myloc.setItem("sepet", findedSepetUrun);
        sepet = myloc.getItem("sepet");
           makeTotal(urunler);
      });
      $(`tr[data-ur='${urun.id}'] .btn-remove-urun`).on("click", function () {
        sepet = sepet.filter((item) => item.id != urun.id);
        // urunler = urunler.map(item=>item.id != urun.id);
        myloc.setAllItem("sepet", sepet);
        SepetInit();
        SepetStatus();
      });
    }
     
  } else {
    $(".spetbfyLeft").html(rendred({ urunler: [] }));
    $(".leftarea").css("width", "100%");
    $(".rightarea").css("display", "none");
  }

  $(".btn-sepet-ony").on('click',function(){
    window.location.href = '/siparis-bilgi'
  })
};
