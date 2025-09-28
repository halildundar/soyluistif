import { readFileSync, writeFileSync } from "node:fs";

const RandomId = (length) => {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export function EnvChangeInit() {
  let time = RandomId(6);
  let envFile = readFileSync(`./src/const.env`, { encoding: "utf-8" });
  process.env.WEBSCRIPTNAME = `main${time}`;
  process.env.CTRLPANELSCRIPTNAME = `ctrlpanel-main${time}`;
  envFile = envFile.replaceAll("{{WEBSCRIPTNAME}}", `main${time}`);
  envFile = envFile.replaceAll("{{CTRLPANELSCRIPTNAME}}", `ctrlpanel-main${time}`);
  writeFileSync("./dist/const.env", envFile, { encoding: "utf-8" });
}
