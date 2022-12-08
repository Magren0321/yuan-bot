import express from 'express'
import { Essence } from '../../db/schemas/essence'
import { Member } from '../../db/schemas/member'

const router = express.Router()

/**
 * 随机获取50条精华数据
 */
router.get('/getRandomEssence', async (req, res) => {
  const doc = await Essence.aggregate()
    .match({ msg_content: { $elemMatch: { msg_type: 1 } } }) // 只找文本
    .sample(50)
  for (const item of doc) {
    const member = await Member.findOne({ user_id: item.sender_uin })
    if (!member) {
      continue
    }
    item.avatar = member.avatar
  }
  doc.filter(i => {
    return i.avatar
  })
  res.json({
    code: 200,
    data: {
      essence: doc
    }
  })
})

/**
 * 精华消息排行榜
 */
router.get('/rank', async (req, res) => {
  const data = await Essence.find()
  const rankMap = new Map<string, {name: string, value:number, avatar:String}>()
  for (const item of data) {
    const member = await Member.findOne({ user_id: item.sender_uin })
    if (!member) {
      continue
    }
    if (rankMap.has(item.sender_uin)) {
      const value: {name: string, value:number} = rankMap.get(item.sender_uin)!
      rankMap.set(item.sender_uin, {
        name: item.sender_nick,
        value: ++value.value,
        avatar: member.avatar
      })
    } else {
      rankMap.set(item.sender_uin, {
        name: item.sender_nick,
        value: 1,
        avatar: member.avatar
      })
    }
  }
  res.json({
    code: 200,
    data: {
      rank: Array.from(rankMap).sort((a, b) => {
        return b[1].value - a[1].value
      })
    }
  })
})

export default router
