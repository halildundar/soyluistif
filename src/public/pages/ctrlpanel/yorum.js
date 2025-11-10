import { pad } from "../util/main.js";
const getYorumlar = async () => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/yorumlar",
    data: {},
    dataType: "json",
  });
};
export const YorumInit = async () => {
  let urunler = await getYorumlar();
  console.log(urunler);
  urunler = urunler.map((item) => {
    let yorumlar = JSON.parse(item.yorumlar);
    let oran = Math.floor(
      yorumlar.reduce((acc, curr) => acc + parseInt(curr.oran), 0) /
        yorumlar.length
    );
    let yorum_adet = yorumlar.length;
    return {
      ...item,
      oran: oran,
      yorum_adet: yorum_adet,
      yorumlar: yorumlar,
    };
  });

  $(".urun-area tbody").html("");
  if (!!urunler && urunler.length > 0) {
    $(".kat-sec").hide();
    $(".urun-area table").show();
    let strRand = Handlebars.compile(`
              <tr data-ur="{{id}}" class="hover:bg-black/10 cursor-pointer">
                                <td class="p-1 border-l border-t border-gray-200">{{kod}}</td>
                                <td class="p-1 border-l border-t border-gray-200">{{name}}</td>
                                <td class="p-1 border-l border-t border-gray-200">
                                    {{#stars oran}}{{/stars}}
                                </td>
                                <td class="p-1 border-l border-t border-gray-200">{{yorum_adet}}</td>
                            </tr>
            `);
    urunler = urunler.sort((a, b) => (a.oran - b.oran ? 1 : -1));
    for (let i = 0; i < urunler.length; i++) {
      const item = urunler[i];
      $(".urun-area tbody").append(strRand({ ...item }));
      console.log(item);
    }
  }
  let strYorumRand = Handlebars.compile(`
      <div class="bg-white px-2 py-1">
                    <div class="">
                        <div class="font-semibold text-[1.2rem]">{{urunname}}</div>
                        <div>
                            {{urunkod}}
                        </div>
                    </div>

                    {{#each yorumlar}}
                    <div class="flex flex-col">
                        <div>
                            <div class="flex item-center justify-between text-[0.8rem]">
                                <div class="font-semibold">{{ad_soyad}}</div>
                                <div class="italic text-gray-400">{{tarihStr}}</div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between" >
                            <div>
                            {{#stars oran}}{{/stars}}
                            </div>
                            <button data-id="{{../id}}" data-ur="{{tarih}}" class="btn-deletyrm bg-red-500 hover:bg-red-700 text-white rounded active:bg-red-400 w-[75px] py-0.5">Sil</button>

                        </div>
                        <div class="text-[0.8rem] italic text-gray-600 ">
                          <img src="{{first_resim}}" class="float-left w-[75px] h-[75px] object-contain" alt="">
                            <p class="pt-2">
                              {{msg_area}}
                            </p>
                        </div>

                    </div>
                    <hr class="pt-2">
                    {{/each}}
                    
                </div>
    `);
  $("body").on("click", function () {
    $(".txtarea").show();
    $(".yrm-area").html("");
    $(".urun-area tbody tr").removeClass("bg-black/10");
  });
  $(".yrm-area").on("click", function (e) {
    e.stopPropagation();
  });
  $(".urun-area tbody tr").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const ur = $(this).attr("data-ur");
    $(".txtarea").hide();
    $(".yrm-area").html("");
    $(".urun-area tbody tr").removeClass("bg-black/10");
    const selectedUrun = urunler.find((a) => a.id === parseInt(ur));
    let yorumlar = selectedUrun.yorumlar;
    yorumlar = yorumlar.map((a) => {
      let date = new Date(a.tarih);
      return {
        ...a,
        tarihStr:
          pad(date.getDate(), 2) +
          "." +
          pad(date.getMonth() - 1, 2) +
          "." +
          date.getFullYear(),
      };
    });
    let yorum_adet = yorumlar.length;
    let oran = Math.floor(
      yorumlar.reduce((acc, curr) => acc + parseInt(curr.oran), 0) /
        yorumlar.length
    );
    let data = {
      ...selectedUrun,
      oran: oran,
      yorum_adet: yorum_adet,
      yorumlar: yorumlar.map((a) => {
        let first_resim = a.resimler.length > 0 ? a.resimler[0] : "/assets/thumbnail.png"
        return {
          ...a,
          first_resim:first_resim,
          oran: parseInt(a.oran),
        };
      }),
    };
    $(".yrm-area").append(strYorumRand({ ...data }));
    $(".yrm-area button").on("click", async function () {
      let id = $(this).attr("data-id");
      let tarih = $(this).attr("data-ur");
      let selecturun = urunler.find((a) => a.id === parseInt(id));
      let newYorumlar = selecturun.yorumlar.filter(
        (a) => a.tarih !== parseInt(tarih)
      );
      // let selectedYorum = selectedUrun.yorumlar;
      if (newYorumlar.length == 0) {
        newYorumlar = "";
      } else {
        newYorumlar = JSON.stringify(newYorumlar);
      }
      await $.ajax({
        type: "POST",
        url: "/ctrlpanel/yorumlar/update",
        data: { id: id,yorumlar:newYorumlar },
        dataType: "json",
      });
      location.href = location.href;
    });
    $(this).addClass("bg-black/10");
  });
};
