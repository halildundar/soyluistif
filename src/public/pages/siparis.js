import { myloc } from "../main.js";
import { pad } from "../util/fncs.js";
import { SiparisStatus } from "./util/main.js";
const makeRows = async () => {
  siparisIds = siparisIds.map((item) => item.id);
  const siparisler = await $.ajax({
    type: "POST",
    url: "/siparis/getbysipid",
    data: { ids: siparisIds },
    dataType: "json",
  });
  let newSiparisler = siparisler.map((item) => {
    return {
      ...item,
      basketItems: JSON.parse(item.basketItems),
      billingAddress: JSON.parse(item.billingAddress),
      shippingAddress: JSON.parse(item.shippingAddress),
      buyer: JSON.parse(item.buyer),
      paymentCard: JSON.parse(item.paymentCard),
    };
  });
  if (newSiparisler.length > 0) {
    $(".siparis-yok").css("display", "none");
    $(".siparis-area").css("display", "block");
    for (let i = 0; i < newSiparisler.length; i++) {
      const siparis = newSiparisler[i];
      const systemDate = new Date(Number(siparis.systemTime));
      const tarih = `${pad(systemDate.getDate(), 2)}.${pad(
        systemDate.getMonth() - 1,
        2
      )}.${systemDate.getFullYear()} ${pad(systemDate.getHours(), 2)}:${pad(
        systemDate.getMinutes(),
        2
      )}`;
      let urunlerStr = "";
      for (let j = 0; j < siparis.basketItems.length; j++) {
        const urun = siparis.basketItems[j];
        urunlerStr += `<li>
            <span><strong>${urun.name}</strong></span>
            <span> - </span>
            <span>${urun.price}₺</span>
        </li>`;
      }
      $("tbody").append(`
        <tr class="border border-gray-300 ">
          <td class="py-4">${siparis.paymentId}</td>
            <td>${tarih}</td>
               <td class="text-green-600 font-bold">${siparis.status}</td>
            <td>
                <ul class=''>${urunlerStr}</ul>
            </td>
                  <td>${siparis.price}₺</td>
            <td>
                <ul class=' text-[0.7rem]'>
                        <li><strong>Kargo Adres: </strong> ${siparis.billingAddress.address}</li>
                            <li><strong>Fatura Adres: </strong> ${siparis.shippingAddress.address}</li>
                </ul>
            </td>
         
      
        </tr>`);
    }
  }
};
export const SiparisInit = async () => {
  let siparisIds = myloc.getItem("siparis");
  if (siparisIds.length > 0) {
    siparisIds = siparisIds.map((item) => item.id);
    const siparisler = await $.ajax({
      type: "POST",
      url: "/siparis/getbysipid",
      data: { ids: siparisIds },
      dataType: "json",
    });
    let newSiparisler = siparisler.map((item) => {
      return {
        ...item,
        basketItems: JSON.parse(item.basketItems),
        billingAddress: JSON.parse(item.billingAddress),
        shippingAddress: JSON.parse(item.shippingAddress),
        buyer: JSON.parse(item.buyer),
        paymentCard: JSON.parse(item.paymentCard),
      };
    });
    if (newSiparisler.length > 0) {
      $(".siparis-yok").css("display", "none");
      $(".siparis-area").css("display", "block");
      for (let i = 0; i < newSiparisler.length; i++) {
        const siparis = newSiparisler[i];
        const systemDate = new Date(Number(siparis.systemTime));
        const tarih = `${pad(systemDate.getDate(), 2)}.${pad(
          systemDate.getMonth() - 1,
          2
        )}.${systemDate.getFullYear()} ${pad(systemDate.getHours(), 2)}:${pad(
          systemDate.getMinutes(),
          2
        )}`;
        let urunlerStr = "";
        for (let j = 0; j < siparis.basketItems.length; j++) {
          const urun = siparis.basketItems[j];
          urunlerStr += `<li>
            <span>   ${urun.adet} x <strong>${urun.name}</strong></span>
            <span> - </span>
            <span>${urun.indirimli_fiyat}₺</span>
        </li>`;
        }
        $("tbody").append(`
           <tr class="tr${siparis.paymentId} border border-gray-300 table-row md:hidden"> 
              <td colSpan=5>
                <div class="flex items-center w-full">
                    <div class="py-4 flex-1">${siparis.paymentId}</div>
                    <div class="flex-1 leading-none">${tarih}</div>
                    <div class="text-green-600 font-bold flex-1">${siparis.status}</div>
                    <div class="flex-1">${siparis.price}₺</div>
                    <div class="pr-2">
                        <button title="Çıkar" class="btnrmove${siparis.paymentId} tio rounded-full hover:bg-red-700 bg-red-500 active:bg-red-400 text-white p-1 text-[0.9rem] md:text-[1.2rem]">clear</button>
                    </div>
                </div>
                <div>
                  <div>
                         <ul class=''>${urunlerStr}</ul>
                  </div>
                  <div class="px-5">
                      <ul class=' text-[0.7rem]'>
                        <li><strong>Kargo Adres: </strong></li>
                        <li> ${siparis.billingAddress.address}</li>
                        <li><strong>Fatura Adres: </strong></li>
                            <li> ${siparis.shippingAddress.address}</li>
                      </ul>
                  </div>
                </div>
              </td>
           </tr>
        <tr class="tr${siparis.paymentId} border border-gray-300 hidden md:table-row">
          <td class=" py-4">${siparis.paymentId}</td>
            <td>${tarih}</td>
               <td class="text-green-600 font-bold">${siparis.status}</td>
            <td class="hidden md:block">
                <ul class=''>${urunlerStr}</ul>
            </td>
                  <td>${siparis.price}₺</td>
            <td class="hidden md:block">
                <ul class=' text-[0.7rem]'>
                        <li><strong>Kargo Adres: </strong> ${siparis.billingAddress.address}</li>
                            <li><strong>Fatura Adres: </strong> ${siparis.shippingAddress.address}</li>
                </ul>
            </td>
            <td>
                <button title="Çıkar" class="btnrmove${siparis.paymentId} tio rounded-full hover:bg-red-700 bg-red-500 active:bg-red-400 text-white p-1 text-[0.9rem] md:text-[1.2rem]">clear</button>
              </td>

        </tr>`);
        $(`.btnrmove${siparis.paymentId}`).on("click", function () {
          myloc.deleteItem("siparis", { id: siparis.paymentId });
          $(`.tr${siparis.paymentId}`).remove();
          SiparisStatus();
        });
      }
    }
  }

  $(".btn-siparis-getir").on("click", async function () {
    const siparisId = $("[name='siparis-search']").val();
    if (!!siparisId) {
      $(".all-spinn").css("display", "block");
      $("body").css("overflow", "hidden");
      const siparisler = await $.ajax({
        type: "POST",
        url: "/siparis/getbysipid",
        data: { ids: [siparisId] },
        dataType: "json",
      });
      if (siparisler.length > 0) {
        let newSiparisler = siparisler.map((item) => {
          myloc.setItem("siparis", { id: item.paymentId });
          return {
            ...item,
            basketItems: JSON.parse(item.basketItems),
            billingAddress: JSON.parse(item.billingAddress),
            shippingAddress: JSON.parse(item.shippingAddress),
            buyer: JSON.parse(item.buyer),
            paymentCard: JSON.parse(item.paymentCard),
          };
        });
        if (newSiparisler.length > 0) {
          $(".siparis-yok").css("display", "none");
          $(".siparis-area").css("display", "block");
          for (let i = 0; i < newSiparisler.length; i++) {
            const siparis = newSiparisler[i];
            const systemDate = new Date(Number(siparis.systemTime));
            const tarih = `${pad(systemDate.getDate(), 2)}.${pad(
              systemDate.getMonth() - 1,
              2
            )}.${systemDate.getFullYear()} ${pad(
              systemDate.getHours(),
              2
            )}:${pad(systemDate.getMinutes(), 2)}`;
            let urunlerStr = "";
            for (let j = 0; j < siparis.basketItems.length; j++) {
              const urun = siparis.basketItems[j];
              urunlerStr += `<li>
              <span><strong>${urun.name}</strong></span>
              <span> - </span>
              <span>${urun.price}₺</span>
          </li>`;
            }
            $("tbody").append(`
          <tr class="tr${siparis.paymentId} border border-gray-300 ">
            <td class="py-4">${siparis.paymentId}</td>
              <td>${tarih}</td>
                 <td class="text-green-600 font-bold">${siparis.status}</td>
              <td>
                  <ul class=''>${urunlerStr}</ul>
              </td>
                    <td>${siparis.price}₺</td>
              <td>
                  <ul class=' text-[0.7rem]'>
                          <li><strong>Kargo Adres: </strong> ${siparis.billingAddress.address}</li>
                              <li><strong>Fatura Adres: </strong> ${siparis.shippingAddress.address}</li>
                  </ul>
              </td>
              <td>
                <button title="Çıkar" class="btnrmove${siparis.paymentId} tio rounded-full hover:bg-red-700 bg-red-500 active:bg-red-400 text-white p-1 text-[1.4rem]">clear</button>
              </td>

          </tr>`);
            $(`.btnrmove${siparis.paymentId}`).on("click", function () {
              myloc.deleteItem("siparis", { id: siparis.paymentId });
              $(`.tr${siparis.paymentId}`).remove();
              SiparisStatus();
            });
          }
          SiparisStatus();
        }
      }
      $(".all-spinn").css("display", "none");
      $("body").css("overflow", "auto");
    } else {
      $(".err1-txt").css("display", "block");
    }
  });
  $("body").css("overflow", "auto");
  $(".all-spinn").css("display", "none");
};
