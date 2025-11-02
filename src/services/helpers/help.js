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
