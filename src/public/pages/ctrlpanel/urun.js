import {
  StringToUrl,
  GetTemp,
  Upload,
  GetFileExt,
  OptimizePhoto,
} from "../../util/fncs.js";
let urunler;
let selectedUrun;
let selectedKategori;
let parents;
let kategoriler;

const makeBreadCrump = (classname) => {
  let newItems = kategoriler.filter((item) => {
    return !selectedKategori.parents
      ? false
      : selectedKategori.parents.some((it) => it == item.id);
  });
  newItems.push(selectedKategori);
  $(classname).html("");
  let strHtml = "";
  for (let i = 0; i < newItems.length; i++) {
    const newItem = newItems[i];
    if (i === newItems.length - 1) {
      strHtml =
        strHtml + `<div class="text-black font-bold">${newItem.name}</div>`;
    } else {
      strHtml =
        strHtml +
        `<div class="text-gray-600">${newItem.name}</div> <div class="tio text-[1.2rem] text-gray-600">chevron_right</div>`;
    }
  }
  $(classname).append(strHtml);
};
const makeUrunArea = async (parents) => {
  selectedUrun = null;
  //Popup Ürün ekle
  urunler = await GetUrunler(JSON.stringify(parents));
  urunler = urunler.sort((a, b) => (a.kayit_tarih < b.kayit_tarih ? -1 : 1));
  if (!!urunler && urunler.length == 0) {
    $(".urun-yok").css("display", "block");
    $(".urun-area table").css("display", "none");
  } else if (!!urunler && urunler.length > 0) {
    $(".urun-yok").css("display", "none");
    $(".urun-area table").css("display", "table");
    $(".urun-area table tbody").html("");
    for (let i = 0; i < urunler.length; i++) {
      const urun = urunler[i];
      let resimler = JSON.parse(urun.resimler);
      // <td class="p-1 border-l border-t border-gray-300">${
      //             urun.url
      //           }</td>
      const str = `<tr class="urun${
        urun.id
      } cursor-pointer hover:bg-black/5 text-[0.8rem]">
                  <td class="p-1 border-l border-t border-gray-300">${
                    urun.kod
                  }</td>
                  <td class="p-1 border-l border-t border-gray-300">
                      <button class="btnresim${
                        urun.id
                      } hover:underline text-blue-500">${
        !!resimler && resimler.length > 0
          ? resimler.length + " resim"
          : "0 Resim"
      }</button>
                  </td>
                  <td class="p-1 border-l border-t border-gray-300">${
                    urun.name
                  }</td>
                  <td class="p-1 border-l border-t border-gray-300">${
                    urun.currency
                  }</td>
                  <td class="p-1 border-l border-t border-gray-300">${urun.fiyat.toFixed(
                    2
                  )}</td>
                    
                  <td class="p-1 border-l border-t border-gray-300">${
                    urun.indirim
                  }</td>
                  <td class="p-1 border-l border-t border-gray-300">${urun.indirimli_fiyat.toFixed(
                    2
                  )}</td>
                    <td class="p-1 border-l border-t border-gray-300">${
                      urun.stok
                    }</td>
                     <td class="p-1 border-l border-t border-gray-300">${
                       urun.stok - urun.alinan
                     }</td>
                      <td class="p-1 border-l border-t border-gray-300">${
                        urun.kdv
                      }</td>
              </tr>`;
      $(".urun-area table tbody").append(str);
      $(`.urun-area table tbody .btnresim${urun.id}`).off("click");
      $(`.urun-area table tbody .btnresim${urun.id}`).on("click", (e) => {
        e.stopPropagation();
        PopResim1(urun, resimler);
      });
      $(`.urun-area table tbody .urun${urun.id}`).on("click", function () {
        $.each($(`.urun-area table tbody tr`), function () {
          $(`.urun-area table tbody tr`).css("background-color", "transparent");
        });
        $(`.urun-area table tbody .urun${urun.id}`).css(
          "background-color",
          "rgba(0,0,0,0.1)"
        );
        $(".btn-urun-ekle").css("display", "none");
        $(".btn-urun-duzenle").css("display", "inline-block");
        $(".btn-urun-resim").css("display", "inline-block");
        $(".btn-urun-sil").css("display", "inline-block");
        $(".btn-urun-temizle").css("display", "inline-block");
        selectedUrun = urun;
      });
    }
  }
};
export const IsSelectKategori = async (kategori, kate) => {
  selectedKategori = kategori;
  kategoriler = kate;
  $(`.btn-urun-temizle`).trigger("click");
  if (!selectedKategori) {
    $(".urun-area .kat-sec").css("display", "block");
    $(".urun-area table").css("display", "none");
    $(".bread-area").html("");
    $(".btn-area-urun").css("display", "none");
  } else {
    $(".urun-area .kat-sec").css("display", "none");
    $(".btn-area-urun").css("display", "block");
    if (!!selectedKategori.parents) {
      parents = [...selectedKategori.parents, selectedKategori.id];
    } else {
      parents = [selectedKategori.id];
    }
    await makeUrunArea(parents);
    makeBreadCrump(".bread-area");
  }
};
const makeEventForImgDelete = () => {
  let list = [];
  $.each($(".imges img"), function (index) {
    let link = $(this).attr("src").replace("/uploads", "");
    $(`.imges i[data-it='${index}']`).off();
    $(`.imges i[data-it='${index}']`).on("click", async () => {
      list = list.filter((item) => item != link);
      await updateUrun({ resimler: JSON.stringify(list) });
      selectedUrun = await GetUrun(selectedUrun.id);
      $(this).parent().remove();
      await DeleteFile($(this).attr("src"));
    });
    list.push(link);
  });
};

export const InitUrun = async () => {
  IsSelectKategori();

  $(`.btn-urun-temizle`).on("click", function () {
    $(".btn-urun-ekle").css("display", "inline-block");
    $(".btn-urun-duzenle").css("display", "none");
    $(".btn-urun-sil").css("display", "none");
    $(".btn-urun-temizle").css("display", "none");
    $(".btn-urun-resim").css("display", "none");
    $.each($(".urun-area table tbody tr"), function () {
      $(this).css("background-color", "transparent");
    });
    selectedUrun = null;
  });
  $(".btn-urun-ekle").on("click", async function () {
    const temp = await GetTemp("popurunekle.html");
    $(".urun-ekle-pop").remove();
    $(".urun-areaa").after(temp);

    await makeUrunArea(parents);
    //Quil Editor
    const garantiaciklama_quil = new Quill(".garanti_aciklama", {
      theme: "snow",
    });
    const urun_aciklama_quil = new Quill(".aciklama", {
      theme: "snow",
    });
    $(".garanti_aciklama .ql-editor").html(
      `<p>Ürün Adı : Hidrollik Tek Etkili El Pompası Vanası B Tipi</p><p>Not : Fiyat 1 Adet İçindir.</p><p>Lütfen Ürünün Görselini Dikkatlice İnceleyiniz Ürünün Sizin Numune İle Ölçülerinin Aynı Olduğundan Emin Olup O Şekilde Sipariş Veriniz.`
    );
    $(".btn-close-urun-edit").on("click", function () {
      $(".urun-ekle-pop").remove();
    });
    $(".btn-iptal-urun").on("click", function () {
      $(".btn-close-urun-edit").trigger("click");
    });
    $(".btn-tamam-urun-ekle").on("click", async function () {
      let formData = $("form").serializeJSON();
      formData["parents"] = JSON.stringify([...parents]);
      formData["url"] = StringToUrl(formData.kod);
      formData["aciklama"] = JSON.stringify($(".aciklama .ql-editor").html());
      formData["garanti_aciklama"] = JSON.stringify(
        $(".garanti_aciklama .ql-editor").html()
      );
      formData["indirimli_fiyat"] =
        formData.fiyat - (formData.indirim * formData.fiyat) / 100.0;
      let urunname = formData.name;
      let kod = formData.kod;
      if (!selectedUrun) {
        await addUrun({
          ...formData,
          name: kod,
          kod: urunname,
          kayit_tarih: new Date().getTime(),
        });
      } else {
        await updateUrun({ ...formData, name: kod, kod: urunname });
        $(`.btn-urun-temizle`).trigger("click");
      }
      $(".btn-close-urun-edit").trigger("click");
      await makeUrunArea(parents);
    });
    makeBreadCrump(".pop-bread-area");
  });
  $(".btn-urun-duzenle").on("click", async function () {
    const temp = await GetTemp("popurunekle.html");
    $(".urun-ekle-pop").remove();
    $(".urun-areaa").after(temp);

    const garantiaciklama_quil = new Quill(".garanti_aciklama", {
      theme: "snow",
    });
    const urun_aciklama_quil = new Quill(".aciklama", {
      theme: "snow",
    });
    $("[name='name']").val(selectedUrun.name);
    $("[name='url']").val(selectedUrun.url);
    $("[name='kod']").val(selectedUrun.kod);
    $("[name='fiyat']").val(selectedUrun.fiyat);
    $("[name='indirim']").val(selectedUrun.indirim);
    $("[name='currency']").val(selectedUrun.currency);
    $("[name='indirimli_fiyat']").val(selectedUrun.indirimli_fiyat);
    $("[name='stok']").val(selectedUrun.stok);
    $("[name='kdv']").val(selectedUrun.kdv);
    $(".aciklama .ql-editor").html(JSON.parse(selectedUrun.aciklama));
    $(".garanti_aciklama .ql-editor").html(
      JSON.parse(selectedUrun.garanti_aciklama)
    );
    $(".btn-close-urun-edit").on("click", function () {
      $(".urun-ekle-pop").remove();
    });
    $(".btn-iptal-urun").on("click", function () {
      $(".btn-close-urun-edit").trigger("click");
    });

    $(".btn-tamam-urun-ekle").on("click", async function () {
      let formData = $("form").serializeJSON();
      formData["url"] = StringToUrl(formData.kod);
      formData["aciklama"] = JSON.stringify($(".aciklama .ql-editor").html());
      formData["garanti_aciklama"] = JSON.stringify(
        $(".garanti_aciklama .ql-editor").html()
      );
      formData["indirimli_fiyat"] =
        formData.fiyat - (formData.indirim * formData.fiyat) / 100;
      let urunname = formData.name;
      let kod = formData.kod;
      await updateUrun({ ...formData, name: kod, kod: urunname });
      $(`.btn-urun-temizle`).trigger("click");
      $(".btn-close-urun-edit").trigger("click");
      await makeUrunArea(parents);
    });
    // $(".btn-close-urun-edit").trigger("click");
    makeBreadCrump(".pop-bread-area");
  });
  $(".btn-urun-sil").on("click", async function () {
    await deleteUrun();
    $(`.btn-urun-temizle`).trigger("click");
    await makeUrunArea(parents);
  });
  // $(".btn-urun-resim").on("click", async function () {
  //   const resimHtml = await GetTemp("popurunresim.html");
  //   $(".urunresim-ekle-pop").remove();
  //   const renderUrunResim = Handlebars.compile(resimHtml);
  //   let resimler = [];
  //   if (!!selectedUrun.resimler) {
  //     resimler = JSON.parse(selectedUrun.resimler);
  //   }
  //   $(".urun-areaa").after(
  //     renderUrunResim({
  //       resimler: [...resimler],
  //     })
  //   );
  //   $(".btn-resim-sec").on("click", function () {
  //     $("input[type='file']").trigger("click");
  //   });

  //   $("input[type='file']").on("change", function () {
  //     $(".imgcont").html("");
  //     $.map($("input[type='file']").get(0).files, function (file, index) {
  //       const upld = new Upload(
  //         file,
  //         ".imgcont",
  //         index,
  //         `/urunler/${selectedUrun.name}/`,
  //         ""
  //       );
  //       upld.isValidSize(1, async (data) => {
  //         let resimler = await GetUrunResimler(selectedUrun.id);
  //         resimler = JSON.parse(resimler);
  //         resimler = !!resimler ? resimler : [];
  //         await updateUrun({
  //           resimler: JSON.stringify([
  //             ...resimler,
  //             `/urunler/${selectedUrun.name}/${file.name}`,
  //           ]),
  //         });
  //         selectedUrun = await GetUrun(selectedUrun.id);
  //         $("#sortable")
  //           .append(`<div class="imges h-[150px] w-full bg-pink-500 flex items-center justify-center hover:cursor-move relative" >
  //                       <img src="/uploads/urunler/${selectedUrun.name}/${file.name}" class="w-full h-full object-fill" alt="">
  //                       <i class="btn-sil-img${index} tio rounded-full text-[1.4rem] bg-red-700 text-white cursor-pointer absolute top-2 right-2 p-1" data-it="${index}">clear</i>
  //                   </div> `);
  //         makeEventForImgDelete();
  //       });
  //     });
  //   });

  //   $("#sortable").sortable({
  //     revert: true,
  //     update: async (e) => {
  //       let list = [];
  //       $.each($(".imges img"), function () {
  //         let link = $(this).attr("src").replace("/uploads", "");
  //         list.push(link);
  //       });
  //       await updateUrun({ resimler: JSON.stringify(list) });
  //       selectedUrun = await GetUrun(selectedUrun.id);
  //     },
  //   });
  //   makeEventForImgDelete();
  //   $(".pop-title-area").html(selectedUrun.name);
  //   $(".btn-close-urun-resim-edit").on("click", function () {
  //     $(".urunresim-ekle-pop").remove();
  //   });
  // });

  $(".btn-multi-ekle").on("click", async function () {
    const rand = await GetTemp("uruntoplu.hbs");
    $("body").append(rand());
    $(".toplusave .btn-close").on("click", function () {
      $(".toplusave").remove();
    });

    $(".btn-listcsv-sec").on("click", function () {
      $(".coklucsvlist").val("");
      $(".coklucsvlist").trigger("click");
    });
    function parseCsv(data) {
      const re = /(;|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^;\r\n]*))/gi;
      const result = [[]];
      let matches;
      while ((matches = re.exec(data))) {
        if (matches[1].length && matches[1] !== ";") result.push([]);
        result[result.length - 1].push(
          matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3]
        );
      }
      return result;
    }
    function arrayToObject(csvArray) {
      //Take the first line (headers) from the array and remove it from the array.
      const headers = csvArray.shift();

      // Iterate through the rows and reduce each column to an object
      // return csvArray.map((row) =>
      //   headers.reduce((acc, currentHeader, i) => ({
      //       ...acc,
      //       ...{ [currentHeader]: row[i] },
      //     }),{})
      // );
      let newArray = csvArray.map((row) =>
        headers.reduce((acc, currentHeader, i) => {
          let newHeader = "";
          let val = row[i];
          if (currentHeader == "KDV(%)") {
            newHeader = "kdv";
            val = parseInt(val);
          } else if (currentHeader == "Stok(adet)") {
            newHeader = "stok";
            val = parseInt(val);
          } else if (currentHeader == "Ürün Adı") {
            newHeader = "kod";
          } else if (currentHeader == "Ürün Fiyat") {
            newHeader = "fiyat";
            val = parseFloat(val);
          } else if (currentHeader == "Ürün Kodu") {
            newHeader = "name";
          } else if (currentHeader == "İndirim Oran(%)") {
            newHeader = "indirim";
            val = parseInt(val);
          } else if (currentHeader == "Birim") {
            newHeader = "currency";
          }
          return {
            ...acc,
            ...{ [newHeader]: val },
          };
        }, {})
      );
      return newArray.filter((it) => !!it.name);
    }
    $(".coklucsvlist").on("change", function () {
      $(".toplusave .spnte").css("display", "flex");
      const file = $(this)[0].files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvArray = parseCsv(e.target.result);
        const arrayOfObjects = arrayToObject(csvArray);
        let newArrayItems = [];
        for (let i = 0; i < arrayOfObjects.length; i++) {
          let atd = arrayOfObjects[i];
          let items = {
            ...atd,
            aciklama:
              JSON.stringify(`Ürün Adı : Hidrollik Tek Etkili El Pompası Vanası B Tipi
Not : Fiyat 1 Adet İçindir.
Lütfen Ürünün Görselini Dikkatlice İnceleyiniz Ürünün Sizin Numune İle Ölçülerinin Aynı Olduğundan Emin Olup O Şekilde Sipariş Veriniz.`),
            garanti_aciklama: JSON.stringify(`1-3 Gün İçinde Teslim Edilir`),
            fiyat: atd.fiyat,
            indirimli_fiyat: atd.fiyat - (atd.indirim * atd.fiyat) / 100.0,
            url: StringToUrl(atd.name),
            parents: JSON.stringify(parents),
          };
          newArrayItems.push(items);
        }
        if (newArrayItems.length > 0 && newArrayItems.length <= 100) {
          $(".errtxtcsv").html("");
          const re = await $.ajax({
            type: "POST",
            url: "/ctrlpanel/urun/insert-multiple-urun",
            data: { arrayData: newArrayItems },
            dataType: "json",
          });
          // console.log("re", re);
          if (re.status) {
            $(".btn-close-urun-edit").trigger("click");
            await makeUrunArea(parents);
            $(".toplusave .btn-close").trigger("click");
          }
        } else {
          $(".errtxtcsv").html("1'den fazla ve max.100 Ürün Ekleyin");
        }
        $(".toplusave .spnte").css("display", "none");
      };
      reader.readAsText(file);
    });
  });
};
const PopResim1 = async (urun, resimler) => {
  // resimler = !!resimler && resimler.length > 0 ? JSON.parse(resimler) : null;
  // console.log(resimler)
  const rendTemp = await GetTemp("pop-resimler.hbs");
  $("body").append(
    rendTemp({
      resimler: resimler,
    })
  );
  $(`.popasresimler .select-resim-frompc`).off("click");
  $(`.popasresimler .select-resim-frompc`).on("click", function () {
    $(".popasresimler [type='file']").val("");
    $(".popasresimler [type='file']").trigger("click");
  });
  $(".popasresimler [type='file']").on("change", async function () {
    let files = $(this).get(0).files;
    let fileurls = [];
    $(".popasresimler .spinner-ar").css("display", "flex");
    let optimezedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let urunnname = urun.name.replace("/", "");
      fileurls.push(`/uploads/urunler/${urunnname}/${file.name}`);
      let img = await OptimizePhoto(file, 500, 0.9);
      optimezedFiles.push(img);
    }
    let uploadedFilePromises = [];
    for (let i = 0; i < optimezedFiles.length; i++) {
      const file = optimezedFiles[i];
      let fileext = GetFileExt(file.name);
      let filepurename = file.name.replace(`.${fileext}`, "");
      const upld = new Upload(file);
      let urunnname = urun.name.replace("/", "");
      uploadedFilePromises.push(
        upld.doUpload(`/uploads/urunler/${urunnname}`, filepurename, (data) => {
          // console.log(data);
        })
      );
    }
    let initImages = [];
    $.each($(".popasresimler .res-wrpa img"), (ind, item) => {
      initImages.push($(item).attr("src"));
    });
    const reslUploads = await Promise.all(uploadedFilePromises);
    const isAlluploaded = reslUploads
      .map((item) => item.msg)
      .every((item) => item == "Ok!");
    if (isAlluploaded) {
      await $.ajax({
        type: "post",
        url: "/ctrlpanel/urun/update-urun",
        data: {
          id: urun.id,
          resimler: JSON.stringify([...initImages, ...fileurls]),
        },
        dataType: "json",
      });
      // resimler = JSON.stringify(fileurls);
      let newResimler = [...fileurls, ...initImages];
      $(".popasresimler .res-wrpa").html("");
      $(".popasresimler .res-wrpa").html(`
             <div class="grid grid-cols-4  gap-2 pt-5"></div>
            `);
      for (let i = 0; i < newResimler.length; i++) {
        const element = newResimler[i];
        $(".popasresimler .res-wrpa>div").append(`
          <div class="relative w-full h-[150px] border border-gray-200 rounded">
              <a href="${element}" target="_blank" class=" ">
                    <img src="${element}" class="w-full h-full object-contain">
                </a>
              <button data-ur="${element}" class="btnimgdlet absolute -top-[7px] -right-[7px] rounded-full w-[25px] h-[25px] z-10 flex items-center justify-center tio text-white bg-red-500 text-[1.2rem]">clear</button>

          </div>
              `);
      }
    }
    $(".popasresimler .spinner-ar").css("display", "none");
    $(".btnimgdlet").off("click");
    $(".btnimgdlet").on("click", async function () {
      let url = $(this).attr("data-ur");
      let initImages = [];
      $.each($(".popasresimler .res-wrpa img"), (ind, item) => {
        initImages.push($(item).attr("src"));
      });
      initImages = initImages.filter((a) => a != url);
      $(`.popasresimler .res-wrpa a[href='${url}']`).parent().remove();
      const result = await $.ajax({
        type: "POST",
        url: "/stat/filedelete",
        data: { filepath: `${url}` },
        dataType: "json",
      });
      await $.ajax({
        type: "post",
        url: "/ctrlpanel/urun/update-urun",
        data: {
          id: urun.id,
          resimler: JSON.stringify([...initImages]),
        },
        dataType: "json",
      });
    });
  });

  $(`.popasresimler .btn-close`).on("click", function () {
    $(`.popasresimler`).remove();
    $(`.link[data-ur='${selectedKategori.id}'] a`).trigger("click");
  });
  $("#sortable1").sortable({
    revert: false,
    update: async (e) => {
      let imgurls = [];
      $.each($(`#sortable1 a img`), (index, el) => {
        imgurls.push($(el).attr("src"));
      });
      await $.ajax({
        type: "post",
        url: "/ctrlpanel/urun/update-urun",
        data: { id: urun.id, resimler: JSON.stringify(imgurls) },
        dataType: "json",
      });
    },
  });

  $(".btnimgdlet").on("click", async function () {
    let url = $(this).attr("data-ur");
    let initImages = [];
    $.each($(".popasresimler .res-wrpa img"), (ind, item) => {
      initImages.push($(item).attr("src"));
    });
    initImages = initImages.filter((a) => a != url);
    $(`.popasresimler .res-wrpa a[href='${url}']`).parent().remove();
    const result = await $.ajax({
      type: "POST",
      url: "/stat/filedelete",
      data: { filepath: `${url}` },
      dataType: "json",
    });
    await $.ajax({
      type: "post",
      url: "/ctrlpanel/urun/update-urun",
      data: {
        id: urun.id,
        resimler: JSON.stringify([...initImages]),
      },
      dataType: "json",
    });
  });
};
const PopResimAllInit = async (urun, resimler) => {
  // resimler = !!resimler && resimler.length > 0 ? JSON.parse(resimler) : null;
  // console.log(resimler)
  const rendTemp = await GetTemp("pop-resimler.hbs");
  $("body").append(
    rendTemp({
      resimler: resimler,
    })
  );

  $(`.popasresimler .select-resim-frompc`).on("click", function () {
    $(".popasresimler [type='file']").val("");
    $(".popasresimler [type='file']").trigger("click");
  });
  $(".popasresimler [type='file']").on("change", async function () {
    let files = $(this).get(0).files;
    let fileurls = [];
    $(".popasresimler .spinner-ar").css("display", "flex");
    if (!!resimler && resimler.length > 0) {
      let urunnname = urun.name.replace("/", "");
      const result = await $.ajax({
        type: "POST",
        url: "/stat/folderdelete",
        data: { folderpath: `/uploads/urunler/${urunnname}` },
        dataType: "json",
      });
    }
    // let promiesesOptimize = [];
    let optimezedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let urunnname = urun.name.replace("/", "");
      fileurls.push(`/uploads/urunler/${urunnname}/${file.name}`);
      let img = await OptimizePhoto(file, 500, 0.9);
      optimezedFiles.push(img);
      // promiesesOptimize.push();
    }
    // const optimezedFiles = await Promise.all(promiesesOptimize);
    let uploadedFilePromises = [];
    for (let i = 0; i < optimezedFiles.length; i++) {
      const file = optimezedFiles[i];
      let fileext = GetFileExt(file.name);
      let filepurename = file.name.replace(`.${fileext}`, "");
      const upld = new Upload(file);
      let urunnname = urun.name.replace("/", "");
      uploadedFilePromises.push(
        upld.doUpload(`/uploads/urunler/${urunnname}`, filepurename, (data) => {
          // console.log(data);
        })
      );
    }
    const reslUploads = await Promise.all(uploadedFilePromises);
    const isAlluploaded = reslUploads
      .map((item) => item.msg)
      .every((item) => item == "Ok!");
    if (isAlluploaded) {
      await $.ajax({
        type: "post",
        url: "/ctrlpanel/urun/update-urun",
        data: { id: urun.id, resimler: JSON.stringify(fileurls) },
        dataType: "json",
      });
      resimler = JSON.stringify(fileurls);
      $(".popasresimler .res-wrpa").html(`
             <div class="grid grid-cols-4  gap-2"></div>
            `);
      for (let i = 0; i < fileurls.length; i++) {
        const element = fileurls[i];
        $(".popasresimler .res-wrpa div").append(`
              <a href="${element}" target="_blank" class="w-full h-[150px] border border-gray-200 rounded ">
                    <img src="${element}" class="w-full h-full object-contain">
                </a>
              `);
      }
    }
    $(".popasresimler .spinner-ar").css("display", "none");
  });

  $(`.popasresimler .btn-close`).on("click", function () {
    $(`.popasresimler`).remove();
    $(`.link[data-ur='${selectedKategori.id}'] a`).trigger("click");
  });
  $("#sortable1").sortable({
    revert: false,
    update: async (e) => {
      let imgurls = [];
      $.each($(`#sortable1 a img`), (index, el) => {
        imgurls.push($(el).attr("src"));
      });
      await $.ajax({
        type: "post",
        url: "/ctrlpanel/urun/update-urun",
        data: { id: urun.id, resimler: JSON.stringify(imgurls) },
        dataType: "json",
      });
    },
  });
};
const GetUrunler = async (kategori_ids) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/urun/get-urunler",
    data: { kategori_ids: kategori_ids },
    dataType: "json",
  });
};

const addUrun = async (data) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/urun/add-urun",
    data: { ...data },
    dataType: "json",
  });
};
const updateUrun = async (data) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/urun/update-urun",
    data: { id: selectedUrun.id, ...data },
    dataType: "json",
  });
};
const deleteUrun = async () => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/urun/delete-urun",
    data: { id: selectedUrun.id },
    dataType: "json",
  });
};
const GetUrunResimler = async (id) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/urun/get-urun-resimler",
    data: { id: id },
    dataType: "json",
  });
};
const GetUrun = async (id) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/urun/get-urun",
    data: { id: id },
    dataType: "json",
  });
};

const DeleteFile = async (filepath) => {
  return $.ajax({
    type: "POST",
    url: "/stat/filedelete",
    data: { filepath: filepath },
    dataType: "json",
  });
};
