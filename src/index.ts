import { createClient } from "oicq";
import api from './request/api'
import {GroupResponse} from "./types/responses";


const account = 0;
const password = "";

const client = createClient(account)

const login = async (password: string) =>{
  client.on("system.login.slider", function (e) {
    console.log("输入ticket：")
    process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
  })
  client.login(password)
}

const getAllEssence = async (qNumber: number) =>{
  const essenceData:GroupResponse.EssenceDetail[] = [];
  let pageNum = 0;
  let res = await api.getEssence(qNumber,pageNum);
  if(res.data.msg_list){
    essenceData.push(...res.data.msg_list)
  }
  while(!res.data.is_end){
    res = await api.getEssence(qNumber,++pageNum);
    if(res.data.msg_list){
      essenceData.push(...res.data.msg_list)
    }
  }
  return essenceData
}

login(password)

client.on("system.online", async function () {
  const domain = "qun.qq.com";
  const cookie = client.cookies[domain];
  const bkn = client.bkn;
  api.setApiConfig(cookie,bkn);

})



