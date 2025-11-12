export function calc(value) {
  return value + 7;
}
export function list(value, name, options) {
  return (
    "<h3>" +
    options.fn({ test: value, test1: name, label: "custom Helper List" })
  );
}

export function DigitFract(value, fractDigit) {
  return value.toFixed(fractDigit);
}

export function IsEq(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}
export function BiggerThan(v1, options) {
  if (v1.length > 0) {
    return options.fn(this);
  }
  return options.inverse(this);
}
export function LessThan(v1, options) {
  if (v1.length <= 0) {
    return options.fn(this);
  }
  return options.inverse(this);
}
export function Inc(v1, options) {
  return parseInt(v1) + 1;
}
export function Json(v1, options) {
  return JSON.stringify(v1);
}

export function jsonld(context) {
  return JSON.stringify(context, null, 2);
}

export function isimstatus(context, isok) {
  function maskString(str) {
    if (str.length <= 2) return str; // 3 karakter veya daha azsa maskeye gerek yok
    const visible = str.slice(0, 2);
    const masked = "*".repeat(3);
    return visible + masked;
  }
  if (isok !== "on") {
    let isimArray = context.split(" ");
    for (let i = 0; i < isimArray.length; i++) {
      const isim = isimArray[i];
      isimArray[i] = maskString(isim);
    }
    return isimArray.join(" ");
  }
  return context;
}
export function KargoUrundurum(fiyat, birim) {
  if (birim === "$") {
    if (parseInt(fiyat) > 25) {
      return `<div class="pl-4 flex flex-col items-center px-5 py-1 text-white bg-blue-600  rounded">
                                <div class="">Kargo Ücretsiz</div>
                                <div class="text-[0.8rem]">25 $ üstü alışverişlerde kargo ücretsiz</div>
                            </div>`;
    }
  } else if (birim === "€") {
    if (parseInt(fiyat) > 20) {
       return `<div class="pl-4 flex flex-col items-center px-5 py-1 text-white bg-blue-600  rounded">
                                <div class="">Kargo Ücretsiz</div>
                                <div class="text-[0.8rem]">20 € üstü alışverişlerde kargo ücretsiz</div>
                            </div>`;
    }
  } else {
    if (parseInt(fiyat) > 1000) {
       return `<div class="pl-4 flex flex-col items-center px-5 py-1 text-white bg-blue-600  rounded">
                                <div class="">Kargo Ücretsiz</div>
                                <div class="text-[0.8rem]">1000 ₺ üstü alışverişlerde kargo ücretsiz</div>
                            </div>`;
    }
  }
  return "";
}
export function stars(oran) {
  if (oran === 5) {
    return `<button data-ur="1" class="tio text-orange-500">star</button>
    <button data-ur="2" class="tio text-orange-500">star</button>
    <button data-ur="3" class="tio text-orange-500">star</button>
    <button data-ur="4" class="tio text-orange-500">star</button>
    <button data-ur="5" class="tio text-orange-500">star</button>`;
  } else if (oran === 4) {
    return `<button data-ur="1" class="tio text-orange-500">star</button>
    <button data-ur="2" class="tio text-orange-500">star</button>
    <button data-ur="3" class="tio text-orange-500">star</button>
    <button data-ur="4" class="tio text-orange-500">star</button>
    <button data-ur="5" class="tio text-gray-500">star</button>`;
  } else if (oran === 3) {
    return `<button data-ur="1" class="tio text-orange-500">star</button>
    <button data-ur="2" class="tio text-orange-500">star</button>
    <button data-ur="3" class="tio text-orange-500">star</button>
    <button data-ur="4" class="tio text-gray-500">star</button>
    <button data-ur="5" class="tio text-gray-500">star</button>`;
  } else if (oran === 2) {
    return `<button data-ur="1" class="tio text-orange-500">star</button>
    <button data-ur="2" class="tio text-orange-500">star</button>
    <button data-ur="3" class="tio text-gray-500">star</button>
    <button data-ur="4" class="tio text-gray-500">star</button>
    <button data-ur="5" class="tio text-gray-500">star</button>`;
  } else if (oran === 1) {
    return `<button data-ur="1" class="tio text-orange-500">star</button>
    <button data-ur="2" class="tio text-gray-500">star</button>
    <button data-ur="3" class="tio text-gray-500">star</button>
    <button data-ur="4" class="tio text-gray-500">star</button>
    <button data-ur="5" class="tio text-gray-500">star</button>`;
  }
  return `<button data-ur="1" class="tio text-gray-500">star</button>
    <button data-ur="2" class="tio text-gray-500">star</button>
    <button data-ur="3" class="tio text-gray-500">star</button>
    <button data-ur="4" class="tio text-gray-500">star</button>
    <button data-ur="5" class="tio text-gray-500">star</button>`;
}
