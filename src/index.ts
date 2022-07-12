import { createClient } from "oicq";

const account = 0;
const password = "";

const client = createClient(account)

const login = (password: string) =>{
  client.on("system.login.slider", function (e) {
    console.log("输入ticket：")
    process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
  }).login(password)
}

const getEssence = (qNumber: number) =>{
  let domain = "qun.qq.com";
  const cookie = client.cookies[domain];
  const bkn = client.bkn;
}

login(password);

