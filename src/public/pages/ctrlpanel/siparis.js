import { pad } from "../../util/fncs.js";
export const InitSiparis = async () => {
  let selectedSiparis;
  const siparisler = await $.ajax({
    type: "POST",
    url: "/ctrlpanel/siparisler/get-all",
    data: {},
  });
  let newDatas = siparisler.map((item) => {
    const time = new Date(Number(item.systemTime));
    return {
      ...item,
      basketItems: JSON.parse(item.basketItems),
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
            <span>${urun.indirimli_fiyat}₺</span>
        </li>`;
      }
      $(".siparis-area tbody").append(`
          <tr class="text-[0.8rem] tr${siparis.paymentId} hover:bg-black/5 cursor-pointer">
            <td class="p-1 border-l border-t border-gray-200 px-2">${siparis.paymentId}</td>
              <td class="p-1 border-l border-t border-gray-200  px-2">${siparis.systemTime}</td>
            <td class="p-1 border-l border-t border-gray-200 ">
              <div class="text-green-500 font-bold  px-2">${siparis.status}</div>
            </td>
             <td class="p-1 border-l border-t border-gray-200 min-w-[300px]  px-2">
                <div>${siparis.buyer.name} ${siparis.buyer.surname}</div> 
                <div class="text-[0.8rem]"><strong>Email: </strong>${siparis.buyer.email}</div>
                <div class="text-[0.8rem]"> <strong>TC: </strong>${siparis.buyer.identityNumber} <strong>Tel: </strong>${siparis.buyer.gsmNumber}</div>
             </td>
            <td class="p-1 border-l border-t border-gray-200  min-w-[300px] px-2">
                    <ul class='text-[0.8rem]'>${urunlerStr}</ul>
            </td>
             <td class="p-1 border-l border-t border-gray-200  px-2">${siparis.price}.00₺</td>
                <td class="p-1 border-l border-t border-gray-200 text-[0.7rem]  px-2">
              <strong>Kargo Adres:</strong> ${siparis.shippingAddress.address} <br>
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
                                    <td class="py-1">${item.adet} x ${item.name}</td>
                                    <td class="py-1">${item.indirim}%</td>
                                    <td class="py-1">${item.fiyat}₺</td>
                                    <td class="py-1">${item.indirimli_fiyat}₺</td>
                                        <td class="text-end font-bold py-1">${item.price}₺</td>
                                </tr>
            `);
        }
      });
    }
  } else {
    $(".siparis-yok").css("display", "block");
  }
  $(".spinn1").css("display", "none");

  $(".btn-clse").on("click", () => {
    $(".urnpop").css("display", "none");
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
        promises.push($.ajax({
          type: "POST",
          url: "/urun/update-stok",
          data: { id: item.id, alinan: item.adet },
          dataType: "json",
        }));
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
};
