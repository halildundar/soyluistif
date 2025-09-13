export const OnayKodInit = () => {
  console.log("Onay kod init");
  let urn = new URL(location.href).searchParams.get("urn");
  console.log(urn);
//   if (!urn) {
//   }
};
