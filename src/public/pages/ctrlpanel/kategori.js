import { StringToUrl } from "../../util/fncs.js";
import { IsSelectKategori } from "./urun.js";
export let kategoriler = [];
export let selectedKategori;

const GetKategoriler = async () => {
  kategoriler = await GetAllKategoriler();
  kategoriler = kategoriler.map((item) => {
    if (!!item.parents) {
      item.parents = JSON.parse(item.parents);
    } else {
      item.parents = [];
    }
    return item;
  });
};
function getSubKateg(parentid, length) {
  const filteredItem =
    parentid == 0
      ? (item) => item.parents.length == length
      : (item) =>
          item.parents.length == length && item.parents[length - 1] == parentid;
  return kategoriler.filter(filteredItem);
}
function getMakeSubKat(kateg, id) {
  let subkateg = getSubKateg(kateg.id, kateg.parents.length);
  if (id != 0) {
    subkateg = getSubKateg(kateg.id, kateg.parents.length + 1);
  }

  for (let j = 0; j < subkateg.length; j++) {
    const sub = subkateg[j];
    let subsubkateg = getSubKateg(sub.id, sub.parents.length + 1);
    $(`.sublink[data-pur='${id}']`).append(`<div class="link"  data-ur="${
      sub.id
    }">
             <div class=" flex items-start space-x-1 pb-2">
               <span class="select-none tio border border-gray-400 cursor-default">add</span>
                <a class="kateglin cursor-pointer select-none  leading-none block flex-1 py-0.5 px-1 hover:text-red-600">${
                  sub.name
                } <i class="font-semibold text-red-600 !text-[0.7rem]">${
      subsubkateg.length == 0 ?  '': `( ${subsubkateg.length} )`
    }</i></a>
             
             </div>
              <div class="sublink" data-pur="${sub.id}" style="padding-left:${
      8 * (kateg.parents.length + 1)
    }px"></div>
            </div>
            `);
    $(`.link[data-ur='${sub.id}'] span`).on("click", function () {
      const txtStr = $(this).html();
      if (txtStr == "add") {
        getMakeSubKat(sub, sub.id);
        $(this).html("remove");
      } else {
        $(this).html("add");
        $(`.sublink[data-pur='${sub.id}']`).html("");
      }
    });
    $(`.link[data-ur='${sub.id}'] a`).on("click", function () {
      $(".kateglin").css("color", "black");
      $(this).css("color", "red");
      $(".sel-area").css("display", "block");
      $("[name='kategori-edit']").val(sub.name);
      $(".eklelbl").html("Alt Kategori Ekle");
      IsSelectKategori(sub, kategoriler);
      selectedKategori = sub;
    });
  }
}

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
      if (!!selectedKategori) {
        await GetKategoriler();
        const subLength = getSubKateg(
          selectedKategori.id,
          selectedKategori.parents.length + 1
        ).length;
        $(`.link[data-ur='${selectedKategori.id}'] i`).html(`(${subLength})`);
        const textData = $(
          `.link[data-ur='${selectedKategori.id}'] span`
        ).html();
        $(`.link[data-ur='${selectedKategori.id}'] span`).trigger("click");
        if (textData == "remove") {
          setTimeout(() => {
            $(`.link[data-ur='${selectedKategori.id}'] span`).trigger("click");
          }, 50);
        }
      } else {
        initTree();
      }
    }
  });
  $(".btn-temizle").on("click", function () {
    $(".sel-area").css("display", "none");
    $("[name='kategori-edit']").val("");
    selectedKategori = null;
    $(".kateglin").css("color", "black");
    $(".eklelbl").html("Kategori Ekle");
    IsSelectKategori();
    $(".urun-yok").css("display", "none");
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

    if (sendendData.parents.length == 0) {
      initTree();
    } else {
      await GetKategoriler();
      let parentid = sendendData.parents[sendendData.parents.length - 1];
      const textData = $(`.link[data-ur='${parentid}'] span`).html();
      $(`.link[data-ur='${parentid}'] span`).trigger("click");
      if (textData == "remove") {
        setTimeout(() => {
          $(`.link[data-ur='${parentid}'] span`).trigger("click");
        }, 50);
      }
    }
  });
  $(".btn-sil").on("click", async function () {
    let newDeletedItems = [
      ...kategoriler.filter((item) => {
        return !!item.parents
          ? item.parents.some((it) => it == selectedKategori.id)
          : false;
      }),
    ];
    newDeletedItems.push(selectedKategori);
    newDeletedItems = newDeletedItems.map((item) => item.id);
    await DeleteKategori({ ids: newDeletedItems });
    let parnts = !!selectedKategori.parents
      ? [...selectedKategori.parents, selectedKategori.id]
      : [selectedKategori.id];
    await DeleteUrunFromKategori(parnts);
    if (selectedKategori.parents.length == 0) {
      initTree();
    } else {
      await GetKategoriler();
      
      let parentid = selectedKategori.parents[selectedKategori.parents.length - 1];
       const subLength = getSubKateg(
          parentid,
          selectedKategori.parents.length 
        ).length;
      const textData = $(`.link[data-ur='${parentid}'] span`).html();
      $(`.link[data-ur='${parentid}'] i`).html(`(${subLength})`);
      $(`.link[data-ur='${parentid}'] span`).trigger("click");
      if (textData == "remove") {
        setTimeout(() => {
          $(`.link[data-ur='${parentid}'] span`).trigger("click");
        }, 50);
      }
    }
    $(".btn-temizle").trigger("click");
  });
  initTree();
};

const initTree = async () => {
  await GetKategoriler();
  // let TopKateogirler = getSubKateg(0, kategoriler.length);
  $(".kategori1-area .sublink[data-pur='0']").html("");
  getMakeSubKat({ id: 0, parents: [] }, 0);
};

//***************** */
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

const DeleteUrunFromKategori = async (parents) => {
  parents = JSON.stringify(parents);
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/urun/delete-urun-from-kategori",
    data: { ids: parents },
    dataType: "json",
  });
};
