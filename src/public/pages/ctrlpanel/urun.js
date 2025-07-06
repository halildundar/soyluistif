import { StringToUrl, GetTemp, Upload } from "../../util/fncs.js";
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
  if (!!urunler && urunler.length == 0) {
    $(".urun-yok").css("display", "block");
    $(".urun-area table").css("display", "none");
  } else if (!!urunler && urunler.length > 0) {
    $(".urun-yok").css("display", "none");
    $(".urun-area table").css("display", "table");
    $(".urun-area table tbody").html("");
    for (let i = 0; i < urunler.length; i++) {
      const urun = urunler[i];
      const str = `<tr class="urun${urun.id} cursor-pointer hover:bg-black/5">
                  <td class="p-1 border-l border-t border-gray-300">${urun.name}</td>
                  <td class="p-1 border-l border-t border-gray-300">${urun.url}</td>
                  <td class="p-1 border-l border-t border-gray-300">${urun.kod}-${urun.barkod}</td>
                  <td class="p-1 border-l border-t border-gray-300">${urun.fiyat}</td>
                  <td class="p-1 border-l border-t border-gray-300">${urun.indirim}</td>
                  <td class="p-1 border-l border-t border-gray-300">${urun.indirimli_fiyat}</td>
                    <td class="p-1 border-l border-t border-gray-300">${urun.stok}</td>
              </tr>`;
      $(".urun-area table tbody").append(str);
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
    console.log(parents);
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
  console.log(list);
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
      `<p>Ürün Adı : Hidrollik Tek Etkili El Pompası Vanası B Tipi</p><p>Not : Fiyat 1 Adet İçindir.</p><p>Lütfen Ürünün Görselini Dikkatlice İnceleyiniz Ürünün Sizin Numune İle Ölçülerinin Aynı Olduğundan Emin Olup O Şekilde Sipariş Veriniz.</p><strong>Halil Dündar</strong>`
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
      formData["url"] = StringToUrl(formData.name);
      formData["aciklama"] = JSON.stringify($(".aciklama .ql-editor").html());
      formData["garanti_aciklama"] = JSON.stringify(
        $(".garanti_aciklama .ql-editor").html()
      );
      formData["kod"] = "kod1";
      formData["barkod"] = "barkod1";
      formData["indirimli_fiyat"] = Math.ceil(
        formData.fiyat - (formData.indirim * formData.fiyat) / 100
      );
      console.log(formData);
      if (!selectedUrun) {
        await addUrun(formData);
      } else {
        await updateUrun(formData);
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
    $("[name='barkod']").val(selectedUrun.barkod);
    $("[name='fiyat']").val(selectedUrun.fiyat);
    $("[name='indirim']").val(selectedUrun.indirim);
    $("[name='indirimli_fiyat']").val(selectedUrun.indirimli_fiyat);
    $("[name='stok']").val(selectedUrun.stok);
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
      formData["url"] = StringToUrl(formData.name);
      formData["aciklama"] = JSON.stringify($(".aciklama .ql-editor").html());
      formData["garanti_aciklama"] = JSON.stringify(
        $(".garanti_aciklama .ql-editor").html()
      );
      formData["indirimli_fiyat"] = Math.ceil(
        formData.fiyat - (formData.indirim * formData.fiyat) / 100
      );
      console.log(formData);
      await updateUrun(formData);
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
  $(".btn-urun-resim").on("click", async function () {
    const resimHtml = await GetTemp("popurunresim.html");
    $(".urunresim-ekle-pop").remove();
    const renderUrunResim = Handlebars.compile(resimHtml);
    let resimler = [];
    if (!!selectedUrun.resimler) {
      resimler = JSON.parse(selectedUrun.resimler);
    }
    $(".urun-areaa").after(
      renderUrunResim({
        resimler: [...resimler],
      })
    );
    $(".btn-resim-sec").on("click", function () {
      $("input[type='file']").trigger("click");
    });

    $("input[type='file']").on("change", function () {
      $(".imgcont").html("");
      $.map($("input[type='file']").get(0).files, function (file, index) {
        const upld = new Upload(
          file,
          ".imgcont",
          index,
          `/urunler/${selectedUrun.name}/`,
          ""
        );
        upld.isValidSize(1, async (data) => {
          let resimler = await GetUrunResimler(selectedUrun.id);
          resimler = JSON.parse(resimler);
          resimler = !!resimler ? resimler : [];
          await updateUrun({
            resimler: JSON.stringify([
              ...resimler,
              `/urunler/${selectedUrun.name}/${file.name}`,
            ]),
          });
          selectedUrun = await GetUrun(selectedUrun.id);
          $("#sortable")
            .append(`<div class="imges h-[150px] w-full bg-pink-500 flex items-center justify-center hover:cursor-move relative" >
                        <img src="/uploads/urunler/${selectedUrun.name}/${file.name}" class="w-full h-full object-fill" alt="">
                        <i class="btn-sil-img${index} tio rounded-full text-[1.4rem] bg-red-700 text-white cursor-pointer absolute top-2 right-2 p-1" data-it="${index}">clear</i>
                    </div> `);
          makeEventForImgDelete();
        });
      });

      // $("#sortable").sortable({
      //   revert: true,
      //   update: function (e) {
      //     $.each($(".imges"), function () {
      //       console.log($(this).attr('src'));
      //       list.push($(this).attr('src'))
      //     });
      //   },
      // });
    });

    $("#sortable").sortable({
      revert: true,
      update: async (e) => {
        let list = [];
        $.each($(".imges img"), function () {
          let link = $(this).attr("src").replace("/uploads", "");
          list.push(link);
        });
        await updateUrun({ resimler: JSON.stringify(list) });
        selectedUrun = await GetUrun(selectedUrun.id);
        console.log(selectedUrun);
      },
    });
    makeEventForImgDelete();
    $(".pop-title-area").html(selectedUrun.name);
    $(".btn-close-urun-resim-edit").on("click", function () {
      $(".urunresim-ekle-pop").remove();
    });
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
