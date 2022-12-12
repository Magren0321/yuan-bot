import { createClient } from 'oicq'
import { GroupResponse } from './types/responses'
import { startDB } from './db'
import { Essence } from './db/schemas/essence'
import { Member } from './db/schemas/member'
import api from './request/api'
import command from './command'
import config from '../config'
import startServer from './api'

startDB()
startServer()

const account = config.account // Q号
const password = config.password // 密码
const qNumber = config.qNumber // 群号

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
  try {
    const newData:GroupResponse.EssenceDetail[] = []
    let pageNum = 0
    let res = await api.getEssence(qNumber, pageNum)

    if (res.data.msg_list) {
      let data = res.data.msg_list.filter((item: GroupResponse.EssenceDetail) => {
        return item.add_digest_time > timeStamp
      })
      newData.push(...data)
      // 过滤后依然是50条，有精华消息不止50条的可能
      while (!res.data.is_end && data.length === 50) {
        res = await api.getEssence(qNumber, ++pageNum)
        data = res.data.msg_list.filter((item: GroupResponse.EssenceDetail) => {
          return item.add_digest_time > timeStamp
        })
        newData.push(...data)
      }
    }
    if (newData.length !== 0) {
      newData.reverse()
      // 更新时间戳
      timeStamp = newData[newData.length - 1].add_digest_time
      // 存入数据库
      Essence.insertMany(newData)
      // 存入本地数组
      essenceData = [...essenceData, ...newData]
      console.log(`有${newData.length}条新的精华消息！`)
    }
  } catch (e: any) {
    console.log(e.data.msg)
  }
}

// 获取群成员资料
const getMemberInfo = async () => {
  const group = client.pickGroup(qNumber)
  const groupMember = await group.getMemberMap()
  console.log('获取群成员~~~~~')

  Member.remove()

  groupMember.forEach((val, key) => {
    const avatar = client.pickUser(key).getAvatarUrl()
    Member.insertMany([{
      ...val,
      avatar
    }])
  })
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
    essenceData.reverse()
    Essence.insertMany(essenceData)
  }

  timeStamp = essenceData[essenceData.length - 1].add_digest_time

  console.log(`一共有${essenceData.length}条精华消息！`)

  getMemberInfo()

  setInterval(getMemberInfo, 86400000)
  setInterval(getNewEssence, 30000)
})

const commandList = ['!rank', '!rank-month', '!bot', '!matching']

// 监听信息
client.on('message', async e => {
  if (e.message_type === 'group' && e.group_id === qNumber) {
    const msg = e.raw_message.split(':')[0]
    if (commandList.indexOf(msg) !== -1) {
      if (command[msg]) {
        const text = await command[msg](e, essenceData)
        e.reply(text, true)
      }
    }
  }
})
