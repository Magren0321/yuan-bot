import { Essence } from '../db/schemas/essence'
import { GroupResponse } from '../types/responses'

export const rank = async (isMonth = false): Promise<string> => {
  let data: GroupResponse.EssenceDetail[] = []
  if (isMonth) {
    const time = Math.round(new Date().getTime() / 1000) - 2592000
    data = await Essence.find({ sender_time: { $gte: time } })
  } else {
    data = await Essence.find()
  }
  const rankMap = new Map<string, number>()
  for (const item of data) {
    if (rankMap.has(item.sender_nick)) {
      let value: number = rankMap.get(item.sender_nick)!
      rankMap.set(item.sender_nick, ++value)
    } else {
      rankMap.set(item.sender_nick, 1)
    }
  }

  const top = rankMap.size > 10 ? 10 : rankMap.size

  const arr = Array.from(rankMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map((item, index, arr) => {
      const ranking = `${renderRanking(index + 1)} ${item[0]} ：${item[1]}条`
      return ranking
    })

  if (isMonth) {
    arr.unshift('🌟糟粕排行榜(30天)🌟')
  } else {
    arr.unshift('🌟糟粕排行榜🌟')
  }
  return arr.join('\n')
}

const renderRanking = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return ` ${rank}.`
  }
}
