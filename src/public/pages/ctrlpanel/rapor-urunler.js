import { GetTemp, SpinnerPop } from "../util/main.js";

let allUrunler;
let filteredUrunler;
let rendTempTable;
export const InitRaporUrunler = async () => {
  console.log("urunler init");
  // await SpinnerPop('open');
  await getUrunler();

  $(".spinrea").css("display", "none");
  searchArea();
  popCSV();
};
const popCSV = () => {
  let csvUrl = "";
  $(".btn-xprtcsv").on("click", function () {
    $(".spnurunadet").html(filteredUrunler.length);
    $(".csvpopurunler").css("display", "flex");
  });
  $(".csvpopurunler .btn-close").on("click", async function () {
    $(".csvpopurunler").css("display", "none");
    $(".indrlink").css("display", "none");
    $(".indrlink a").attr("href", "").attr("download", "");
    if (!!csvUrl) {
      await $.ajax({
        type: "POST",
        url: "/ctrlpanel/rapor-deletecsv",
        data: { url: csvUrl },
        dataType: "json",
      });
    }
    csvUrl = "";
  });

  $(".btn-print-run").on("click", async function () {
    $(".spinreacsv").css("display", "flex");
    const data = await $.ajax({
      type: "POST",
      url: "/ctrlpanel/rapor-exportcsv",
      data: { urunler: filteredUrunler },
      dataType: "json",
    });
    $(".spinreacsv").css("display", "none");
    $(".indrlink").css("display", "block");
    csvUrl = data.url;
    $(".indrlink a").attr("href", data.url).attr("download", data.filename);
  });
};
const searchArea = () => {
  let time;
  $("#search").on("keyup", function () {
    clearTimeout(time);
    let rendData;
    time = setTimeout(() => {
      if ($(this).val().length > 3) {
        filteredUrunler = allUrunler.filter((item) => {
          let lowerCaseItems = JSON.stringify(item).toLocaleLowerCase();
          let searchlower = $(this).val().toLocaleLowerCase();
          return lowerCaseItems.includes(searchlower);
        });
        rendData = {
          urunler: filteredUrunler,
        };
      } else {
        filteredUrunler = allUrunler;
        rendData = {
          urunler: filteredUrunler,
        };
      }
      $(".inittble").html(rendTempTable(rendData));
    }, 500);
  });
};
const getUrunler = async () => {
  let items = await $.ajax({
    type: "POST",
    url: "/ctrlpanel/rapor-urunler",
    data: {},
    dataType: "json",
  });
  if (!!items && items.length >= 0) {
    filteredUrunler = [...allUrunler];
    rendTempTable = await GetTemp("raporuruntable.hbs");
    $(".inittble").html(
      rendTempTable({
        urunler: allUrunler,
      })
    );
  }
};
const SeeIamges = () => {
  $(".seeImgs").remove();

  const strImgs = ``;
};
