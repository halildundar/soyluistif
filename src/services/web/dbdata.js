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
export const getMenus = async () => {
  const items = await DB.Query("SELECT * FROM `kategori`");
  return items;
};
export const getOneCikanlar = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY name ASC LIMIT 20"
  );
  return items;
};
export const getCokSatanlar = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY name ASC LIMIT 20"
  );
  return items;
};
export const getYeniler = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY name ASC LIMIT 20"
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
export const getUrunlerIncludeKategori = async (url) => {
  await DB.Query("START TRANSACTION");
  const resp1 = await DB.Query(
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
  const urunler = await DB.Query(
    "SELECT * FROM `urun` WHERE JSON_CONTAINS(parents,?,'$')",
    [id]
  );
  let isLength = allParents.length;
  let altKategoriler = await DB.Query(
    "SELECT * FROM `kategori` WHERE JSON_CONTAINS(JSON_EXTRACT(parents,'$[?]'),?,'$') AND JSON_LENGTH(parents, '$') = ?",
    [isLength - 1, id, isLength]
  );
  if (altKategoriler.length == 0) {
    altKategoriler = await DB.Query(
      "SELECT * FROM `kategori` WHERE JSON_CONTAINS(JSON_EXTRACT(parents,'$[?]'),?,'$') AND JSON_LENGTH(parents, '$') = ?",
      [isLength - 2, allParents[allParents.length - 2], isLength - 1]
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

export const getUrunByUrl = async (urunurl) => {
  const items = await DB.Query("SELECT * FROM `urun`  WHERE url = ?", [
    urunurl,
  ]);
  return items[0];
};
