import { myloc } from "../main.js";
import { GetCurrncySym, SepetStatus } from "./util/main.js";
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
  let currSymb = "₺";
  for (let i = 0; i < urunler.length; i++) {
    if (i == 0) {
      currSymb = GetCurrncySym(urunler[i]);
    }
    const urun = urunler[i];
    if (urun.currency == urunler[0].currency) {
      toplamTutar += urun.adet * urun.fiyat;
      inidirimTutar += urun.adet * urun.indirimli_fiyat;
      kdvToplam +=
        urun.adet *
        urun.fiyat *
        (!urun.kdv || urun.kdv == 0 ? 0 : urun.kdv / 100);
    } else {
      $(".btn-sepet-ony").removeClass(
        "bg-blue-500 hover:bg-blue-700 active:bg-blue-400"
      );
      $(".btn-sepet-ony").addClass(
        "bg-red-500 hover:bg-red-700 active:bg-red-400  pointer-events-none select-none"
      );
      $(".btn-sepet-ony").html("Sepette aynı para birimi ürün olmalı");
    }
  }
  indirim = toplamTutar - inidirimTutar;

  let total = inidirimTutar + kdvToplam;
  $(".toplam_tutar").html("+" + toplamTutar.toFixed(2) + currSymb);
  $(".total_kdv").html("+" + kdvToplam.toFixed(2) + currSymb);
  $(".total_indirim").html("-" + indirim.toFixed(2) + currSymb);

  let Strhand =
    Handlebars.compile(`<div class="text-[0.8rem] lg:text-[1.4rem] font-semibold text-center"> <span
                        class="text-orange-600">{{total_limit}} {{birim}}</span> <span class="text-gray-600">VE ÜZERİ ALIŞVERİŞLERİNİZDE
                        KARGO ÜCRETSİZ</span></div>
                        {{#ifCond kalan_ucret '>=' 0}}
                <div class="text-gray-600 italic text-center text-[0.7rem] lg:text-[1rem]">Sepetinize {{kalan_ucretStr}} {{birim}} 'lik daha
                    ürün ekleyin kargo ücreti ödemeyin</div>{{/ifCond}}`);

  $(".tkle").removeClass("hidden");
  let kalan_ucret = 25;
  if (currSymb === "$") {
    kalan_ucret = 25 - total;
    if (kalan_ucret > 0) {
      $(".kargo_ucret").html("25.00$");
      total += 25;
    } else {
      $(".kargo_ucret").html("0.00$");
    }
    Strhand({
      total_limit: parseInt("25").toFixed(2),
      birim: currSymb,
      kalan_ucret: kalan_ucret,
      kalan_ucretStr: kalan_ucret.toFixed(2),
    });
  } else if (currSymb === "€") {
    kalan_ucret = 20 - total;
    if (kalan_ucret > 0) {
      $(".kargo_ucret").html("20.00€");
      total += 20;
    } else {
      $(".kargo_ucret").html("0.00€");
    }
    Strhand({
      total_limit: parseInt("20").toFixed(2),
      birim: currSymb,
      kalan_ucret: kalan_ucret,
      kalan_ucretStr: kalan_ucret.toFixed(2),
    });
  } else {
    kalan_ucret = 1000 - total;
    if (kalan_ucret > 0) {
      $(".kargo_ucret").html("1000.00₺");
      total += 1000;
    } else {
      $(".kargo_ucret").html("0.00₺");
    }
    $(".fkargo_area").html(
      Strhand({
        total_limit: parseInt("1000").toFixed(2),
        birim: currSymb,
        kalan_ucret: kalan_ucret,
        kalan_ucretStr: kalan_ucret.toFixed(2),
      })
    );
  }

  $(".toplam").html(total.toFixed(2) + currSymb);
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
            ? resimler[0]
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
        location.href = location.href;
      });
    }
  } else {
    $(".spetbfyLeft").html(rendred({ urunler: [] }));
    $(".leftarea").css("width", "100%");
    $(".rightarea").css("display", "none");
  }

  $(".btn-sepet-ony").on("click", function () {
    window.location.href = "/siparis-bilgi";
  });
};
