import { createClient } from "oicq";
import api from './request/api'
import { GroupResponse } from "./types/responses";
import { startDB } from './db'
import { Essence } from './db/schemas/essence'

startDB()

const account = 0;
const password = "";
const qNumber = 0;
let timeStamp = 0;

const client = createClient(account)

const login = async (password: string) =>{
  client.on("system.login.slider", function (e) {
    console.log("输入ticket：")
    process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
  })
  client.login(password)
}

//获取所有的精华消息
const getAllEssence = async () =>{
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

//获取新的精华
const getNewEssence = async () =>{
  const newData:GroupResponse.EssenceDetail[] = [];
  let pageNum = 0;
  let res = await api.getEssence(qNumber,pageNum);

  if(res.data.msg_list){
    let data = res.data.msg_list.filter((item: GroupResponse.EssenceDetail)=>{
      return item.sender_time > timeStamp
    })
    newData.push(...data);
    // 过滤后依然是50条，有精华消息不止50条的可能
    while(!res.data.is_end && data.length === 50){
      res = await api.getEssence(qNumber,++pageNum);
      data = res.data.msg_list.filter((item: GroupResponse.EssenceDetail)=>{
        return item.sender_time > timeStamp
      })
      newData.push(...data);
    }
  }
  //更新时间戳
  timeStamp = newData[0].sender_time;
  //存入数据库
  Essence.create(newData);
}

login(password)
//登录成功
client.on("system.online", async function () {
  const domain = "qun.qq.com";
  const cookie = client.cookies[domain];
  const bkn = client.bkn;
  api.setApiConfig(cookie,bkn);

  const essenceData = await getAllEssence();
  Essence.create(essenceData);
  timeStamp = essenceData[0].sender_time;

})



