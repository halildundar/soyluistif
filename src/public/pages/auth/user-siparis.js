export const UserOrdersInit = () => {
  $(".shwchk").on("click", function () {
    const id = $(this).parent().attr("data-ur");
    if ($(this).prop("checked")) {
      $(`.ate${id} .adresar`).css("display", "grid");
    } else {
      $(`.ate${id} .adresar`).css("display", "none");
    }
  });
  $(".btn-yes-iptal").on("click", async function () {
    let siparisID = $(this).attr("data-ur");
    const ta = await $.ajax({
      type: "POST",
      url: "/ctrlpanel/siparisler/update-iade",
      data: { siparis_id: siparisID, status: "Sipariş İptal Edildi" },
      dataType: "json",
    });
    location.href = location.href;
  });
  $(".btn-no-iptal").on("click", function () {
    $(".iptlpop").hide();
    $(".btn-yes-iptal").attr("data-ur","");
  });
  $(".btn-iade").on("click", async function () {
    let siparisID = $(this).attr("data-ur");
    $(".iptlpop").show();
    $(".btn-yes-iptal").attr("data-ur",siparisID);
  });
};
