import { pad } from "../../util/fncs.js";
export const InitSiparis = async () => {
  let selectedSiparis;
  let iadeEdilen = [];
  let siparisler = await $.ajax({
    type: "POST",
    url: "/ctrlpanel/siparisler/get-all",
    data: {},
  });
  if (!!siparisler && siparisler.length > 1) {
    siparisler = siparisler.sort((a, b) =>
      parseFloat(a.systemTime) < parseFloat(b.systemTime) ? 1 : -1
    );
  }
  let newDatas = siparisler.map((item) => {
    const time = new Date(Number(item.systemTime));
    return {
      ...item,
      basketItems: JSON.parse(item.basketItems),
      iadeItems: !!item.iadeItems ? JSON.parse(item.iadeItems) : [],
      billingAddress: JSON.parse(item.billingAddress),
      paymentCard: JSON.parse(item.paymentCard),
      shippingAddress: JSON.parse(item.shippingAddress),
      buyer: JSON.parse(item.buyer),
      systemTime:
        pad(time.getDate(), 2) +
        "." +
        pad(time.getMonth() - 1, 2) +
        "." +
        time.getFullYear() +
        " " +
        pad(time.getHours(), 2) +
        ":" +
        pad(time.getMinutes(), 2),
    };
  });
  if (newDatas.length > 0) {
    $(".siparis-yok").css("display", "none");
    $(".siparis-area").css("display", "block");

    $(".siparis-area tbody").html("");
    for (let i = 0; i < newDatas.length; i++) {
      const siparis = newDatas[i];
      let urunlerStr = "";
      for (let j = 0; j < siparis.basketItems.length; j++) {
        const urun = siparis.basketItems[j];
        urunlerStr += `<li>
            <span>   ${urun.adet} x <strong>${urun.name}</strong></span>
            <span> - </span>
            <span>${urun.indirimli_fiyat.toFixed(2)}$</span>
        </li>`;
      }
      let iadelerStr = "";
      let iadelerTop = 0;
      for (let j = 0; j < siparis.iadeItems.length; j++) {
        const urun = siparis.iadeItems[j];
        iadelerStr += `<li>
            <span>   ${urun.adet} x <strong>${urun.name}</strong></span>
            <span> - </span>
            <span>${urun.indirimli_fiyat.toFixed(2)}$</span>
        </li>`;
        iadelerTop += parseFloat(urun.price);
      }
      let txtStatusColor =
        siparis.status === "Sipariş İptal Edildi"
          ? "text-red-500"
          : siparis.status.includes("Sipariş İade")
          ? "text-blue-500"
          : "text-green-500";
      $(".siparis-area tbody").append(`
          <tr class="text-[0.8rem] tr${
            siparis.paymentId
          } hover:bg-black/5 cursor-pointer">
            <td class="p-1 border-l border-t border-gray-200 px-2">${
              siparis.paymentId
            }</td>
              <td class="p-1 border-l border-t border-gray-200  px-2">${
                siparis.systemTime
              }</td>
            <td class="p-1 border-l border-t border-gray-200 ">
              <div class="${txtStatusColor} font-bold  px-2">${
        siparis.status
      }</div>
            </td>
             <td class="p-1 border-l border-t border-gray-200 min-w-[300px]  px-2">
                <div>${siparis.buyer.name} ${siparis.buyer.surname}</div> 
                <div class="text-[0.8rem]"><strong>Email: </strong>${
                  siparis.buyer.email
                }</div>
                <div class="text-[0.8rem]"> <strong>TC: </strong>${
                  siparis.buyer.identityNumber
                } <strong>Tel: </strong>${siparis.buyer.gsmNumber}</div>
             </td>
            <td class="p-1 border-l border-t border-gray-200  min-w-[300px] px-2">
                    <div>
                      <ul class='text-[0.8rem]'>${urunlerStr}</ul>
                    </div>
                    <div class="">
                      <ul class='text-[0.8rem] text-red-500'>${iadelerStr}</ul>
                    </div>
            </td>
             <td class="p-1 border-l border-t border-gray-200  px-2">
                <div>${siparis.price - iadelerTop}.00$</div>
             </td>
                <td class="p-1 border-l border-t border-gray-200 text-[0.7rem]  px-2">
              <strong>Kargo Adres:</strong> ${
                siparis.shippingAddress.address
              } <br>
              <strong>Fatura Adres:</strong> ${siparis.billingAddress.address}
            </td>
          
        </tr>`);
      $(`.tr${siparis.paymentId}`).on("click", function () {
        $(".urnpop").css("display", "flex");
        selectedSiparis = newDatas.find(
          (item) => item.paymentId == siparis.paymentId
        );
        $(".name").html(
          selectedSiparis.buyer.name + " " + selectedSiparis.buyer.surname
        );
        $(".tc").html(selectedSiparis.buyer.identityNumber);
        $(".email").html(selectedSiparis.buyer.email);
        $(".tel").html(selectedSiparis.buyer.gsmNumber);
        $(".adres").html(selectedSiparis.buyer.registrationAddress);

        $(".fatContactName").html(selectedSiparis.billingAddress.contactName);
        $(".fatAdres").html(selectedSiparis.billingAddress.address);

        $(".karContactName").html(selectedSiparis.shippingAddress.contactName);
        $(".karAdres").html(selectedSiparis.shippingAddress.address);
        $("[name='durum']").val(selectedSiparis.status);
        $(".byrarea tbody").html("");
        for (let i = 0; i < selectedSiparis.basketItems.length; i++) {
          const item = selectedSiparis.basketItems[i];
          $(".byrarea tbody").append(`
            <tr class="border-y border-gray-200">
                                    <td class="py-1 flex items-center" ><input type="checkbox"  data-ur="${item.id}" class="w-[1.2rem] h-[1.2rem]"></td>
                                    <td class="py-1">${item.adet} x ${item.name}</td>
                                    <td class="py-1">${item.indirim}%</td>
                                    <td class="py-1">${item.fiyat}$</td>
                                    <td class="py-1">${item.indirimli_fiyat}$</td>
                                        <td class="text-end font-bold py-1">${item.price}$</td>
                                </tr>
            `);
        }
        if (!!selectedSiparis.iadeItems) {
          let iadeItems = selectedSiparis.iadeItems;
          $(".byrareaiade tbody").html("");
          for (let i = 0; i < iadeItems.length; i++) {
            const item = iadeItems[i];
            $(".byrareaiade tbody").append(`
            <tr class="border-y border-gray-200">
                                    <td class="py-1">${item.adet} x ${item.name}</td>
                                    <td class="py-1">${item.indirim}%</td>
                                    <td class="py-1">${item.fiyat}$</td>
                                    <td class="py-1">${item.indirimli_fiyat}$</td>
                                        <td class="text-end font-bold py-1">${item.price}$</td>
                                </tr>
            `);
          }
          if (iadeItems.length == 0) {
            $(".byrareaiade tbody").append(`
                 <tr class="border-y border-gray-200">
                                    <td colSpan="5" class="py-1 text-center"><div class="py-3">İade Yok</div></td>
                                    </tr>
              `);
          }
        } else {
          $(".byrareaiade tbody").append(`
                 <tr class="border-y border-gray-200">
                                     <td colSpan="5" class="py-1 text-center"><div class="py-3">İade Yok</div></td>
                                    </tr>
              `);
        }

        $(".byrarea tbody [type='checkbox']").on("change", function () {
          iadeEdilen = [];
          $.each($(".byrarea tbody [type='checkbox']"), function () {
            let basketUrunler = selectedSiparis.basketItems;
            const isChecked = $(this).prop("checked");
            const urunid = $(this).attr("data-ur");
            if (isChecked) {
              const finded = basketUrunler.find((it) => it.id == urunid);
              iadeEdilen.push(finded);
            } else {
              iadeEdilen = iadeEdilen.filter((it) => it.id != urunid);
            }
          });
          if (iadeEdilen.length > 0) {
            $(".btn-drmkydt").css({ display: "none" });
            $(".btn-iade-et").css({ display: "inline-block" });
          } else {
            $(".btn-drmkydt").css({ display: "inline-block" });
            $(".btn-iade-et").css({ display: "none" });
          }
        });

        if (!!selectedSiparis.basketItems.length == 0) {
          $(".btn-iptal-et").css("display", "none");
        }
        if (!selectedSiparis.status == "Sipariş İptal Edildi") {
          $(".btn-iptal-et").css("display", "none");
          $(".btn-iade-et").css("display", "none");
        }
        // $(`.byrarea tbody [data-ur='13']`).trigger("click");
      });
    }
  } else {
    $(".siparis-yok").css("display", "block");
  }
  $(".spinn1").css("display", "none");

  $(".btn-clse").on("click", () => {
    $(".urnpop").css("display", "none");
    $(".errare").html("");
    $(".btn-iade-et").css("display", "none");
    $(".btn-iade-et").css("display", "none");
    $(".btn-drmkydt").css("display", "inline-block");
  });

  $(".btn-drmkydt").on("click", async function () {
    const data = {
      siparis_id: selectedSiparis.id,
      status: $("[name='durum']").val(),
    };
    if ($("[name='durum']").val() == "Kargoya Verildi") {
      let promises = [];
      for (let i = 0; i < selectedSiparis.basketItems.length; i++) {
        const item = selectedSiparis.basketItems[i];
        promises.push(
          $.ajax({
            type: "POST",
            url: "/urun/update-stok",
            data: { id: item.id, alinan: item.adet },
            dataType: "json",
          })
        );
      }
      await Promise.all(promises);
    }

    const resup = await $.ajax({
      type: "POST",
      url: "/ctrlpanel/siparisler/update",
      data: { ...data },
      dataType: "json",
    });
    window.location = "/ctrlpanel/siparisler";
  });

  $(".btn-iade-et").on("click", async function () {
    let basketUrunler = selectedSiparis.basketItems;
    if (iadeEdilen.length > 0) {
      for (let i = 0; i < iadeEdilen.length; i++) {
        const item = iadeEdilen[i];
        basketUrunler = basketUrunler.filter((a) => a.id != item.id);
      }
    }
    let status = "Sipariş İadesi Yapıldı ve Düzenlendi";
    if (iadeEdilen.length > 0 && basketUrunler.length == 0) {
      status = "Sipariş İadesi Yapıldı";
    }
    let data = {
      siparis_id: selectedSiparis.id,
      status: status,
      basketItems: JSON.stringify(basketUrunler),
      iadeItems: JSON.stringify(iadeEdilen),
    };
    let promises = [];
    for (let i = 0; i < iadeEdilen.length; i++) {
      const iade = iadeEdilen[i];
      let itemTransactions = JSON.parse(selectedSiparis.itemTransactions);
      let itemTrans = itemTransactions.find((a) => a.itemId == iade.id);
      promises.push(
        $.ajax({
          type: "POST",
          url: "/iyz/iade",
          data: {
            paymentId: selectedSiparis.paymentId,
            paymentTransactionId: itemTrans.paymentTransactionId,
            price: itemTrans.price,
          },
          dataType: "json",
        })
      );
    }
    const ressq = await Promise.all(promises);
    let failuremsgs = [];
    for (let i = 0; i < ressq.length; i++) {
      const { result } = ressq[i];
      if (result.status == "failure") {
        failuremsgs.push(result);
      }
    }

    if (failuremsgs.length == 0) {
      const resup = await $.ajax({
        type: "POST",
        url: "/ctrlpanel/siparisler/update",
        data: { ...data },
        dataType: "json",
      });
      window.location = "/ctrlpanel/siparisler";
    } else {
      let strErro = "";
      for (let i = 0; i < failuremsgs.length; i++) {
        const msg = failuremsgs[i];
        strErro += msg.errorMessage;
      }
      $(".errare").html(strErro);
    }
  });

  $(".btn-iptal-et").on("click", async function () {
    let data = {
      siparis_id: selectedSiparis.id,
      status: "Sipariş İptal Edildi",
    };

    const res = await $.ajax({
      type: "POST",
      url: "/iyz/iptal",
      data: {
        paymentId: selectedSiparis.paymentId,
      },
      dataType: "json",
    });
    if (!!res.result) {
      if (res.result.status == "failure") {
        $(".errare").html(res.result.errorMessage);
      } else {
        const resup = await $.ajax({
          type: "POST",
          url: "/ctrlpanel/siparisler/update",
          data: { ...data },
          dataType: "json",
        });
        window.location = "/ctrlpanel/siparisler";
      }
    }
  });
};
