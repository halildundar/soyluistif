import { compare } from "bcryptjs";
import { DB } from "../mysql.js";

export let handleLogin = async (email, passw) => {
  let user = await findUserByEmail(email);
  const isMatch = await compare(passw, user.sifre);
  if (isMatch) {
    return isMatch;
  }
  return `The password that you've entered is incorrect`;
};
export let findUserByEmail = async (email) => {
  try {
    const rows = await DB.Query(
      "SELECT * FROM `users` WHERE `email` = ? ",
      email
    );
    return rows[0];
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let findUserById = async (id) => {
  try {
    const rows = await DB.Query("SELECT * FROM `users` WHERE `id` = ? ", id);
    return rows[0];
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let findMusteriByEmail = async (email) => {
  try {
    const rows = await DB.Query(
      "SELECT * FROM `musteriler` WHERE `email` = ? ",
      email
    );
    return rows[0];
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let findMusteriById = async (id) => {
  try {
    const rows = await DB.Query(
      "SELECT * FROM `musteriler` WHERE `id` = ? ",
      id
    );
    return rows[0];
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let comparePassword = (passw, userObject) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const isMatch = await compare(passw, userObject.passw);
      let isMatch;
      if ("sifre" in userObject) {
        isMatch = passw === userObject.sifre;
      } else if ("passw" in userObject) {
        isMatch = passw === userObject.passw;
      }
      if (isMatch) {
        resolve(true);
      } else {
        resolve(`The password that you've entered is incorrect`);
      }
    } catch (e) {
      reject(e);
    }
  });
};

export let getpersonel = async () => {
  try {
    const rows = await DB.Query("SELECT * FROM `users`");
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let updateUser = async (id, queryData) => {
  try {
    const rows = await DB.Query("UPDATE `users` SET ? WHERE id = ?", [
      queryData,
      id,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let saveUser = async (queryData) => {
  try {
    const rows = await DB.Query("INSERT INTO `users` VALUES (0,?)", [
      queryData,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let deleteUser = async (id) => {
  try {
    const rows = await DB.Query("DELETE FROM `users` WHERE id = ?", [id]);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
};


export let getMusteriler = async () => {
  try {
    const rows = await DB.Query("SELECT * FROM `musteriler`");
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let updateMusteri = async (id, others) => {
  try {
    const rows = await DB.Query("UPDATE `musteriler` SET ? WHERE id = ?", [
      others,
      id,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let saveMusteri = async (data) => {
  try {
    const rows = await DB.Query("INSERT INTO `musteriler` SET ?", [data]);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export let deleteMusteri = async (id) => {
  try {
    const rows = await DB.Query("DELETE FROM `musteriler` WHERE id = ?", [id]);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
};
