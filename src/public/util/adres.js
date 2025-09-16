async function GetIller() {
  return await $.ajax({
    type: "POST",
    url: "/get-iller",
    dataType: "json",
  });
}
async function GetIlceler(il_id) {
  return await $.ajax({
    type: "POST",
    url: "/get-ilceler",
    data: { il_id },
    dataType: "json",
  });
}
async function GetMahalleler(il_id, ilce_id) {
  return await $.ajax({
    type: "POST",
    url: "/get-mahalleler",
    data: { il_id, ilce_id },
    dataType: "json",
  });
}
export async function GetIl(il_id) {
  return (
    await $.ajax({
      type: "POST",
      url: "/get-il",
      data: { il_id },
      dataType: "json",
    })
  )[0];
}
export async function GetIlce(ilce_id) {
  return (
    await $.ajax({
      type: "POST",
      url: "/get-ilce",
      data: { ilce_id },
      dataType: "json",
    })
  )[0];
}
export async function GetMahalle(mahalle_id) {
  return (
    await $.ajax({
      type: "POST",
      url: "/get-mahalle",
      data: { mahalle_id },
      dataType: "json",
    })
  )[0];
}
let iller, ilceler, mahalleler;
export async function AdresAlanInit(classname) {
  let selectorIl = !!classname
    ? `${classname} [name='il_id']`
    : "[name='il_id']";
  let selectorIlce = !!classname
    ? `${classname} [name='ilce_id']`
    : "[name='ilce_id']";
  let selectorMahalle = !!classname
    ? `${classname} [name='mahalle_id']`
    : "[name='mahalle_id']";
  iller = await GetIller();
  $.map(iller, function (item, key) {
    $(selectorIl).append(`<option value="${item.id}">${item.il_adi}</option>`);
  });
  ilceler = await GetIlceler(iller[0].id);
  $.map(ilceler, function (item, key) {
    $(selectorIlce).append(`<option value="${item.id}">${item.ilce_adi}</option>`);
  });
  mahalleler = await GetMahalleler(iller[0].id, ilceler[0].id);

  $.map(mahalleler, function (item, key) {
    if (item.il_id == 1 && item.ilce_id == 1 && item.id == 1) {
      $(`${classname} .pk`).html(item.posta_kodu);
    }
    $(selectorMahalle).append(
      `<option value="${item.id}">${item.mahalle_adi}</option>`
    );
  });
  $(selectorIl).on("change", async function () {
    ilceler = await GetIlceler($(selectorIl).val());
    $(selectorIlce).html("");
    $(selectorMahalle).html("");
    $.map(ilceler, function (item, key) {
      $(selectorIlce).append(
        `<option value="${item.id}">${item.ilce_adi}</option>`
      );
    });
    mahalleler = await GetMahalleler($(selectorIl).val(), ilceler[0].id);
    $.map(mahalleler, function (item, key) {
      $(selectorMahalle).append(
        `<option value="${item.id}">${item.mahalle_adi}</option>`
      );
    });

    $(selectorMahalle).trigger("change");
  });
  $(selectorIlce).on("change", async function () {
    mahalleler = await GetMahalleler(
      $(selectorIl).val(),
      $(selectorIlce).val()
    );
    $(selectorMahalle).html("");
    $.map(mahalleler, function (item, key) {
      $(selectorMahalle).append(
        `<option value="${item.id}">${item.mahalle_adi}</option>`
      );
    });
    $(selectorMahalle).trigger("change");
  });
  $(selectorMahalle).on("change", async function () {
    $.map(mahalleler, (item) => {
      if (
        item.il_id == $(selectorIl).val() &&
        item.ilce_id == $(selectorIlce).val() &&
        item.id == $(selectorMahalle).val()
      ) {
        $(`${classname} .pk`).html(item.posta_kodu);
      }
    });
  });
}
export const SetAdresData = (il_id, ilce_id, mahalle_id, classname) => {
  if (!classname) {
    $(`[name='il_id']`).val(il_id);
    $(`[name='il_id']`).trigger("change");
    setTimeout(() => {
      $(`[name='ilce_id']`).val(ilce_id);
      $(`[name='ilce_id']`).trigger("change");
      setTimeout(() => {
        $(`[name='mahalle_id']`).val(mahalle_id);
        $(`[name='mahalle_id']`).trigger("change");
      }, 300);
    }, 300);
  } else {
    $(`${classname} [name='il_id']`).val(il_id);
    $(`${classname} [name='il_id']`).trigger("change");
    setTimeout(() => {
      $(`${classname} [name='ilce_id']`).val(ilce_id);
      $(`${classname} [name='ilce_id']`).trigger("change");
      setTimeout(() => {
        $(`${classname} [name='mahalle_id']`).val(mahalle_id);
        $(`${classname} [name='mahalle_id']`).trigger("change");
      }, 300);
    }, 300);
  }
};
