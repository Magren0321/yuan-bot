import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq'

export const matching = async (e: PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent) => {
  if ((e as GroupMessageEvent).group.pickMember(e.sender.user_id).is_admin) { // 判断是否管理
    const num = parseInt(e.raw_message.split(':')[1]) // 输入的数字
    if (!num) {
      return '这个指令不太对啊🙈'
    }
    const memberMap = await (e as GroupMessageEvent).group.getMemberMap() // 群里总人数
    if (num > 0) {
      if (num > memberMap.size) {
        return '我们群里没有这么多人吧🙈'
      }
      return startMatch(num)
    } else {
      return '好歹给个正数吧🙈'
    }
  } else {
    return '管理才可以玩这个，你给我爬🤬'
  }
}

const startMatch = (num: number): string => {
  const member = Array.from(new Array(num + 1).keys()).slice(1)
  let len = -1
  if (num % 2 !== 0) { // 随机挑一个倒霉蛋
    const idx = Math.floor(Math.random() * member.length)
    len = member[idx]
    member.splice(idx, 1)
  }
  // 数组乱序
  member.sort(() => { return Math.random() > 0.5 ? -1 : 1 })

  const arr: String[] = []
  // 进行匹配
  for (let i = 0; i <= member.length - 2; i += 2) {
    const text = `🧑🏻‍🤝‍🧑🏻 ${member[i]}-${member[i + 1]}`
    arr.push(text)
  }

  arr.unshift('Matching~💕')
  if (len !== -1) {
    arr.push(`有一个可怜的倒霉蛋：${len}`)
  }

  return arr.join('\n')
}
