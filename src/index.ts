import { createClient } from 'oicq'
import api from './request/api'
import { GroupResponse } from './types/responses'
import { startDB } from './db'
import { Essence } from './db/schemas/essence'

startDB()

const account = 0 // Q号
const password = '' // 密码
const qNumber = 0 // 群号
let timeStamp = 0 // 最新更新的时间戳
let essenceData:GroupResponse.EssenceDetail[] = [] // 所有精华数据

const client = createClient(account)

const login = async (password: string) => {
  client.on('system.login.slider', function (e) {
    console.log('输入ticket：')
    process.stdin.once('data', ticket => this.submitSlider(String(ticket).trim()))
  })
  client.login(password)
}

// 获取所有的精华消息
const getAllEssence = async (): Promise<GroupResponse.EssenceDetail[]> => {
  const essenceData:GroupResponse.EssenceDetail[] = []
  let pageNum = 0
  let res = await api.getEssence(qNumber, pageNum)
  if (res.data.msg_list) {
    essenceData.push(...res.data.msg_list)
  }
  while (!res.data.is_end) {
    res = await api.getEssence(qNumber, ++pageNum)
    if (res.data.msg_list) {
      essenceData.push(...res.data.msg_list)
    }
  }
  return essenceData
}

// 获取新的精华
const getNewEssence = async () => {
  const newData:GroupResponse.EssenceDetail[] = []
  let pageNum = 0
  let res = await api.getEssence(qNumber, pageNum)

  if (res.data.msg_list) {
    let data = res.data.msg_list.filter((item: GroupResponse.EssenceDetail) => {
      return item.add_digest_time > timeStamp
    })
    newData.unshift(...data)
    // 过滤后依然是50条，有精华消息不止50条的可能
    while (!res.data.is_end && data.length === 50) {
      res = await api.getEssence(qNumber, ++pageNum)
      data = res.data.msg_list.filter((item: GroupResponse.EssenceDetail) => {
        return item.add_digest_time > timeStamp
      })
      newData.unshift(...data)
    }
  }

  if (newData.length !== 0) {
    // 更新时间戳
    timeStamp = newData[0].add_digest_time
    // 存入数据库
    Essence.create(newData)
    // 存入本地数组
    essenceData = [...newData, ...essenceData]
    console.log(`有${newData.length}条新的精华消息！`)
  }
}

login(password)
// 登录成功
client.on('system.online', async function () {
  const domain = 'qun.qq.com'
  const cookie = client.cookies[domain]
  const bkn = client.bkn
  api.setApiConfig(cookie, bkn)

  essenceData = await Essence.find()

  if (essenceData.length === 0) {
    console.log('数据库无数据，进行请求')
    essenceData = await getAllEssence()
    Essence.create(essenceData)
  }

  timeStamp = essenceData[0].add_digest_time

  console.log(`一共有${essenceData.length}条精华消息！`)
  setInterval(getNewEssence, 10000)
})

// 监听信息
client.on('message', async e => {
  console.log(e)
  // e.reply('test', true)
})
