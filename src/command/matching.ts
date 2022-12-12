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
  const myMap = new Map()
  let len = num
  if (num % 2 !== 0) {
    len -= 1
  }
  const isSelect: number[] = []
  for (let i = 1; i <= len / 2; i++) {
    let val = Math.ceil(Math.random() * (len - len / 2) + len / 2)
    while (isSelect.indexOf(val) !== -1) {
      val = Math.ceil(Math.random() * (len - len / 2) + len / 2)
    }
    myMap.set(i, val)
    isSelect.push(val)
  }

  const arr = Array.from(myMap)
    .map((item, index, arr) => {
      const text = `🧑🏻‍🤝‍🧑🏻 ${item[0]}-${item[1]}`
      return text
    })

  arr.unshift('Matching~💕')
  if (len === num - 1) {
    arr.push(`有一个可怜的倒霉蛋：${num}`)
  }

  return arr.join('\n')
}
