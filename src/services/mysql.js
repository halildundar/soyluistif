import mysql from "mysql";
import { config } from "dotenv";
config({ path: ["const.env"] });
let dbConfig = {
  connectionLimit: 5, // default 10
  host: process.env.MYSQL_DB_HOST,
  user:
    process.env.NODE_ENV == "development"
      ? process.env.MYSQL_DB_USERNAME
      : process.env.MYSQL_DB_USERNAME1,
  password:
    process.env.NODE_ENV == "development"
      ? process.env.MYSQL_DB_PASSWORD
      : process.env.MYSQL_DB_PASSWORD1,
  database: process.env.MYSQL_DB_NAME,
  connectionLimit: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const NewDB = function (database, user, password) {
  const dbConfigN = { ...dbConfig, database, user, password };
  const pool = mysql.createPool(dbConfigN);
  const Connection = () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) reject(err);
        const query = (sql, binding) => {
          return new Promise((resolve, reject) => {
            connection.query(sql, binding, (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          });
        };
        const release = () => {
          return new Promise((resolve, reject) => {
            if (err) reject(err);
            resolve(connection.release());
          });
        };
        resolve({ query, release });
      });
    });
  };
  const Query = (sql, binding) => {
    return new Promise((resolve, reject) => {
      pool.query(sql, binding, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  };
  return { Connection, Query };
};
export const DB = new NewDB(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password
);

// const runKAtegoriTirnakRemove = async () => {
//   let kategoriler = await DB.Query("SELECT * FROM `kategori`");
//   for (let i = 0; i < kategoriler.length; i++) {
//     let parents = kategoriler[i].parents;
//     if (!!parents && parents.includes(`"`)) {
//       parents = parents.replace(/"/g, "");
//       await DB.Query("UPDATE `kategori` SET parents = ? WHERE id = ?",[parents,kategoriler[i].id])
//     }
//   }
// };
// runKAtegoriTirnakRemove();
