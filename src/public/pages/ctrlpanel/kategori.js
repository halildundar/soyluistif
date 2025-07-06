import { StringToUrl } from "../../util/fncs.js";
import { IsSelectKategori } from "./urun.js";
export let kategoriler = [];
export let selectedKategori;
const makeTree = async () => {
  $(`.kategori-area`).html("");
  kategoriler = await GetAllKategoriler();
  kategoriler = kategoriler.map((item) => {
    if (!!item.parents) {
      item.parents = JSON.parse(item.parents);
    }
    return item;
  });
  for (let i = 0; i < kategoriler.length; i++) {
    const element = kategoriler[i];
    let strHtml = `<div style="padding-left:${
      !element.parents ? 10 : element.parents.length * 20
    }px;background-color:${
      !!selectedKategori && selectedKategori.id == element.id
        ? "rgba(0,0,0,0.2)"
        : ""
    };color:${
      !!selectedKategori && selectedKategori.id == element.id
        ? "white"
        : "black"
    }" class="kateg${
      element.id
    } katel px-2 py-1 hover:bg-black/10 cursor-pointer space-x-1 text-[0.8rem]">
                    <div class="inline-block tio text-[0.7rem]">star</div>
                    <div class="inline-block font-bold">${element.name}</div>
                </div>`;

    if (!element.parents) {
      $(`.kategori-area`).append(strHtml);
    } else if (element.parents.length > 0) {
      $(`.kateg${element.parents[element.parents.length - 1]}`).after(strHtml);
    }
    $(`.kateg${element.id}`).on("click", function () {
      $(".sel-area").css("display", "block");
      $("[name='kategori-edit']").val(element.name);
      selectedKategori = element;
      $.each($(`.katel`), function () {
        $(this).css({ backgroundColor: "transparent", color: "black" });
      });
      $(this).css({ backgroundColor: "rgba(0,0,0,0.3)", color: "white" });
      $(".eklelbl").html("Alt Kategori Ekle");
      IsSelectKategori(element,kategoriler);
    });
  }

  if (!kategoriler || kategoriler.length == 0) {
    $(`.kategori-area`).html(`
        <div class="py-5 font-bold text-gray-400 text-[1.4rem] text-center"> Yeni kateogri ekleyin</div>
        `);
  }
};
export const InitKategori = async () => {
  $(".btn-add-kategori").on("click", async function () {
    const val = $(`[name='kategori']`).val();
    if (!!val) {
      let newData = {
        name: val,
        url: `/kategori/${StringToUrl(val)}`,
        acik_kapali: 0,
      };
      if (!!selectedKategori) {
        if (!!selectedKategori.parents) {
          newData["parents"] = [
            ...selectedKategori.parents,
            selectedKategori.id,
          ];
        } else {
          newData["parents"] = [selectedKategori.id];
        }
        newData.parents = JSON.stringify(newData.parents);
      }
      await AddKategori(newData);
      $(`[name='kategori']`).val("");
      makeTree();
    }
  });
  $(".btn-temizle").on("click", function () {
    $(".sel-area").css("display", "none");
    $("[name='kategori-edit']").val("");
    selectedKategori = null;
    $.each($(`.katel`), function () {
      $(this).css({ backgroundColor: "transparent", color: "black" });
    });
    $(".eklelbl").html("Kategori Ekle");
    IsSelectKategori();
    $('.urun-yok').css('display','none')
  });
  $(".btn-guncelle").on("click", async () => {
    let sendendData = {
      ...selectedKategori,
      name: $("[name='kategori-edit']").val(),
      url: `/kategori/${StringToUrl($("[name='kategori-edit']").val())}`,
    };

    if (!sendendData.parents) {
      delete sendendData.parents;
    }
    const resp = await UpdateKategori(sendendData);
    makeTree();
  });
  $(".btn-sil").on("click", async function () {
    let newDeletedItems = kategoriler.filter((item) => {
      return !!item.parents
        ? item.parents.some((it) => it == selectedKategori.id)
        : false;
    });
    newDeletedItems.push(selectedKategori);
    newDeletedItems = newDeletedItems.map((item) => item.id);
    const resp = await DeleteKategori({ ids: newDeletedItems });
    let parnts = !!selectedKategori.parents ? [...selectedKategori.parents,selectedKategori.id] : [selectedKategori.id];
    DeleteUrunFromKategori(parnts);
    makeTree();
    $(".btn-temizle").trigger("click");
  });
  makeTree();
};
const GetAllKategoriler = async () => {
  return await $.ajax({
    type: "POST",
    url: "/ctrlpanel/kategori/get-all-items",
    data: {},
    dataType: "json",
  });
};
const AddKategori = async (data) => {
  return await $.ajax({
    type: "POST",
    url: "/ctrlpanel/kategori/add-item",
    data: { ...data },
    dataType: "json",
  });
};
const UpdateKategori = async (data) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/kategori/update-item",
    data: { ...data },
    dataType: "json",
  });
};
const DeleteKategori = async (data) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/kategori/delete-items",
    data: { ...data },
    dataType: "json",
  });
};

const DeleteUrunFromKategori = async(parents)=>{
  parents = JSON.stringify(parents);
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/urun/delete-urun-from-kategori",
    data: { ids:parents },
    dataType: "json",
  });
}
