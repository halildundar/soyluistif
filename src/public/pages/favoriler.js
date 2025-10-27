import { myloc } from "../main.js";
import { FavStatus } from "./util/main.js";
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

export const FavorilerInit = async () => {
  let favoriler = myloc.getItem("favs");
  const strTemp = await getTemp("favorirows.html");
  const rendred = Handlebars.compile(strTemp);
  if (favoriler.length != 0) {
    let urunler = await getUrunler(favoriler);
    urunler = urunler.map((urun) => {
      let resimler = JSON.parse(urun.resimler);
      return {
        ...urun,
        fiyat: Number(urun.fiyat),
        resimler: resimler,
        adet: 1,
        resim:
          !!resimler && !!resimler[0]
            ? resimler[0]
            : "/assets/urun/resim_yok.webp",
      };
    });
    $(".siparis-area").html(rendred({ urunler: urunler }));

    for (let ic = 0; ic < urunler.length; ic++) {
      const urun = urunler[ic];
      $(`tr[data-ur=${urun.id}]`).on("click", function () {
        window.location = "/urun/" + urun.url;
      });
      $(`tr[data-ur=${urun.id}] .btn-remove-favs`).on("click", function (e) {
        e.stopPropagation();
        let favs = myloc.getItem("favs");
        favs = favs.filter((id) => id != urun.id);
        // urunler = urunler.map(item=>item.id != urun.id);
        myloc.setAllItem("favs", favs);
        FavorilerInit();
        FavStatus();
      });
    }
    if (urunler.length > 0) {
      $(".siparis-area").css("display", "block");
      $(".siparis-yok").css("display", "none");
      //   $(".siparis-area tbody").html("");
      //   for (let i = 0; i < urunler.length; i++) {
      //     const urun = urunler[i];
      //     $(".siparis-area tbody").append(`
      //             <tr>
      //                 <td> </td>
      //             </tr>
      //         `)
      //   }
    }
  } else {
      $(".siparis-area").css("display", "none");
      $(".siparis-yok").css("display", "block");
    }
};
