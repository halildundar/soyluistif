import { myloc } from "../main.js";
import { FavsBtn, FavStatus, SepetBtn, SepetStatus } from "./util/main.js";
let filters;
export const KategoriInit = () => {
  $(".urunler a").on("click", function () {
    location.href = $(this).attr("route");
  });
  $(".btn-fav").on("click", function (ev) {
    ev.stopPropagation();
    FavsBtn(this);
  });
  FavStatus();

  $(".btn-subsepet").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).attr("data-ur");
    let adetVal = $(`.in-adetsepet[data-ur='${id}']`).val();
    let res = Number(adetVal) - 1;
    if (res <= 0) {
      res = 1;
    }
    $(`.in-adetsepet[data-ur='${id}']`).val(res);
  });
  $(".btn-addsepet").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).attr("data-ur");
    let adetVal = $(`.in-adetsepet[data-ur='${id}']`).val();
    let res = Number(adetVal) + 1;
    $(`.in-adetsepet[data-ur='${id}']`).val(res);
  });
  $(".btn-sepete-ekle").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).attr("data-ur");
    let adetVal = Number($(`.in-adetsepet[data-ur='${id}']`).val());
    SepetBtn(this, adetVal);
  });
  SepetStatus();
  filterInit();
};

const filterInit = () => {
  const str = `
  {{#if isFiyat}}
  <div class="fiyatit inline-flex border text-[0.9rem] px-2 pr-1 py-1 border-gray-200 rounded items-center space-x-2">
                        <strong class="">Fiyat:</strong>
                        <span class="minfiyattxt">{{minfiyat}}₺</span>
                        <span>-</span>
                        <span class="maxfiyattxt">{{maxfiyat}}₺</span>
                        <i class="tio text-[1rem] rounded-full p-0.5 bg-gray-100 hover:bg-gray-300 cursor-pointer select-none">clear</i>
                    </div>
  {{/if}}
  {{#IsEq ucretsiz_kargo 1}}
                     <div class="ucretkrit inline-flex border text-[0.9rem] px-2 pr-1 py-1 border-gray-200 rounded items-center space-x-2">
                        <strong class="">Ücretsiz Kargo</strong>
                        <i class="tio text-[1rem] rounded-full p-0.5 bg-gray-100 hover:bg-gray-300 cursor-pointer select-none">clear</i>
                     </div>
{{/IsEq}}
    {{#IsEq stokta 1}}
                      <div class="stokatakrit inline-flex border text-[0.9rem] px-2 pr-1 py-1 border-gray-200 rounded items-center space-x-2">
                        <strong class="">Sadece Stoktakiler</strong>
                        <i class="tio text-[1rem] rounded-full p-0.5 bg-gray-100 hover:bg-gray-300 cursor-pointer select-none">clear</i>
                     </div>
        {{/IsEq}}
                     `;

  const rend = Handlebars.compile(str);
  filters = myloc.getItem("filters");
  console.log(filters);
  $("[name='minfiyat']").val(filters.minfiyat);
  $("[name='maxfiyat']").val(filters.maxfiyat);

  $(".fltr-area").html(
    rend({
      ...filters,
      isFiyat: !(filters.minfiyat == "" && filters.maxfiyat == ""),
    })
  );
  $("[name='minmax']").on("change", function () {
    if ($(this).val() == 500) {
      $("[name='minfiyat']").val(500);
      $("[name='maxfiyat']").val(1000);
    } else if ($(this).val() == 1500) {
      $("[name='minfiyat']").val(1500);
      $("[name='maxfiyat']").val(2000);
    } else if ($(this).val() == 2000) {
      $("[name='minfiyat']").val(2000);
      $("[name='maxfiyat']").val(2500);
    } else if ($(this).val() == 2500) {
      $("[name='minfiyat']").val(2500);
      $("[name='maxfiyat']").val(3000);
    } else if ($(this).val() == 3000) {
      $("[name='minfiyat']").val(3000);
      $("[name='maxfiyat']").val(3500);
    } else {
      $("[name='minfiyat']").val("");
      $("[name='maxfiyat']").val("");
    }
    filters = {
      ...filters,
      minfiyat: $("[name='minfiyat']").val(),
      maxfiyat: $("[name='maxfiyat']").val(),
    };
    myloc.setAllItem("filters", filters);
    filters = myloc.getItem("filters");
    $(".fltr-area").html(
      rend({
        ...filters,
        isFiyat: !(filters.minfiyat == "" && filters.maxfiyat == ""),
      })
    );
  });
  $("[name='minmax']")
    .filter(`[value='${filters.minfiyat}']`)
    .attr("checked", true);

  if (filters.ucretsiz_kargo == 1) {
    $("[name='ucretsiz_kargo']").prop("checked",true)
  } else {
    $("[name='ucretsiz_kargo']").prop("checked",false)
  }
  $("[name='ucretsiz_kargo']").on("change", function () {
    if ($(this).prop("checked")) {
      filters = { ...filters, ucretsiz_kargo: 1 };
    } else {
      filters = { ...filters, ucretsiz_kargo: 0 };
    }
    myloc.setAllItem("filters", filters);
    filters = myloc.getItem("filters");
    $(".fltr-area").html(
      rend({
        ...filters,
        isFiyat: !(filters.minfiyat == "" && filters.maxfiyat == ""),
      })
    );
  });


  if (filters.stokta == 1) {
    $("[name='stoktakiler']").prop("checked",true)
  } else {
    $("[name='stoktakiler']").prop("checked",false)
  }
  $("[name='stoktakiler']").on("change", function () {
    if ($(this).prop("checked")) {
      filters = { ...filters, stokta: 1 };
    } else {
      filters = { ...filters, stokta: 0 };
    }
    myloc.setAllItem("filters", filters);
    filters = myloc.getItem("filters");
    $(".fltr-area").html(
      rend({
        ...filters,
        isFiyat: !(filters.minfiyat == "" && filters.maxfiyat == ""),
      })
    );
  });
};
