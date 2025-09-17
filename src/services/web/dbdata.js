import { DB } from "../mysql.js";
export const getBanners = async (tur) => {
  const items = await DB.Query(
    "SELECT * FROM `slayt` WHERE tur = ? ORDER BY sira ASC ",
    [tur]
  );
  return items;
};
export const getMainMenu = async () => {
  const items = await DB.Query(
    "SELECT * FROM `kategori` WHERE parents  IS NULL ORDER BY name ASC"
  );
  return items;
};
export const GetCurrncySym = (item)=>{
  return item.currency == "USD" ? "$" : item.currency == "EUR" ? "€" : "₺"
}
export const getMenus = async () => {
  const items = await DB.Query("SELECT * FROM `kategori`");
  return items;
};
export const getOneCikanlar = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY begenilme DESC LIMIT 20"
  );
  return items;
};
export const getCokSatanlar = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY `alinan` DESC LIMIT 20"
  );
  return items;
};
export const getYeniler = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY kayit_tarih DESC LIMIT 20"
  );
  return items;
};
export const getKategoriler = async () => {
  const items = await DB.Query(
    "SELECT * FROM `slayt` WHERE tur = ? ORDER BY sira ASC",
    [tur]
  );
  return items;
};
export const makeBredCrump = async (parentIds) => {
  const datas = await DB.Query(
    "SELECT name,url FROM `kategori` WHERE id IN ?",
    [[parentIds]]
  );
  return datas.map((item, index) => {
    let newItem = { ...item };
    if (index == datas.length - 1) {
      newItem["last"] = 1;
    } else {
      newItem["last"] = 0;
    }
    return newItem;
  });
};
export const getUrunlerIncludeKategori = async (url, query) => {
  await DB.Query("START TRANSACTION");
  let resp1 = await DB.Query(
    "SELECT id,parents FROM `kategori` WHERE url = ?",
    [url]
  );
  const { id, parents } = resp1[0];
  let allParents = [];
  if (!!parents) {
    allParents = [...JSON.parse(parents), id];
  } else {
    allParents = [id];
  }
  let urunler = [];
  let isLength;
  let altKategoriler;
  if (!url.includes("/all")) {
    if (!query) {
      urunler = await DB.Query(
        "SELECT * FROM `urun` WHERE JSON_CONTAINS(parents,?,'$')",
        [id]
      );
    } else {
      urunler = await DB.Query(
        "SELECT * FROM `urun` WHERE JSON_CONTAINS(parents,?,'$') AND  name LIKE '%" +
          query +
          "%' ",
        [id]
      );
    }
    isLength = allParents.length;
    altKategoriler = await DB.Query(
      "SELECT * FROM `kategori` WHERE JSON_CONTAINS(JSON_EXTRACT(parents,'$[?]'),?,'$') AND JSON_LENGTH(parents, '$') = ?",
      [isLength - 1, id, isLength]
    );
    if (altKategoriler.length == 0) {
      altKategoriler = await DB.Query(
        "SELECT * FROM `kategori` WHERE JSON_CONTAINS(JSON_EXTRACT(parents,'$[?]'),?,'$') AND JSON_LENGTH(parents, '$') = ?",
        [isLength - 2, allParents[allParents.length - 2], isLength - 1]
      );
    }
  } else {
    urunler = await DB.Query(
      "SELECT * FROM `urun` WHERE   name LIKE '%" + query + "%' "
    );
  }

  let breadcrumbs = await makeBredCrump(allParents);
  await DB.Query("COMMIT");
  return {
    urunler: urunler,
    altKategoriler: altKategoriler,
    breadcrumbs: breadcrumbs,
  };
};
export const getUrunlerIncludeKategori1 = async (query) => {
  let urunler;
  if (!!query) {
    urunler = await DB.Query(
      "SELECT * FROM `urun` WHERE  name LIKE '%" + query + "%'OR kod LIKE  '%" + query + "%'"
    );
  } else {
    urunler = await DB.Query("SELECT * FROM `urun`");
  }
  return {
    urunler: urunler,
    altKategoriler: [],
    breadcrumbs: [],
  };
};
export const getUrunByUrl = async (urunurl) => {
  const items = await DB.Query("SELECT * FROM `urun`  WHERE url = ?", [
    urunurl,
  ]);
  return items[0];
};
export const SiparisDelete = async (id) => {
  const result = await DB.Query("DELETE FROM `siparis` WHERE id = ?", [id]);
  return res.json({ msg: "OK!" });
};
export const SiparisAdd = async (data) => {
  let newData = {
    ...data,
    paymentCard: JSON.stringify(data.paymentCard),
    buyer: JSON.stringify(data.buyer),
    shippingAddress: JSON.stringify(data.shippingAddress),
    billingAddress: JSON.stringify(data.billingAddress),
    basketItems: JSON.stringify(data.basketItems),
  };
  const result = await DB.Query("INSERT INTO `siparis` SET ?", [newData]);
  return result;
};
export const SiparisUpdate = async (data) => {
  const { id, ...others } = data;
  const result = await DB.Query("UPDATE `siparis` SET ? WHERE id = " + id, [
    others,
  ]);
  return result;
};
export const SiparisGetBYID = async (ids) => {
  const result = await DB.Query("SELECT * FROM `siparis` WHERE id = ?", [
    [ids],
  ]);
  return result;
};
export const SiparisByiIyzIDGet = async (ids) => {
  const result = await DB.Query(
    "SELECT * FROM `siparis` WHERE paymentId IN ?",
    [[ids]]
  );
  return result;
};
export const GetEticLogos = async () => {
  let siteler = await await DB.Query("SELECT * FROM `eticsites`");
  if (!!siteler && siteler.length > 0) {
    return siteler.sort((a,b)=>a.sira < b.sira ? -1 : 1);
  }
  return [];
};
export const GetSettings = async ()=>{
  const rep = await DB.Query('SELECT * FROM `settings` WHERE id = 1');
  return rep[0];
}
