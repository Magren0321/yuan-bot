import { GroupResponse } from '../types/responses'

export const rank = async (isMonth = false, essenceData:GroupResponse.EssenceDetail[]): Promise<string> => {
  let data: GroupResponse.EssenceDetail[] = []
  if (isMonth) {
    // 不以月为单位，以30天为单位，避免每月初数据较少情况
    const time = Math.round(new Date().getTime() / 1000) - 2592000
    data = essenceData.filter((item: GroupResponse.EssenceDetail) => {
      return item.add_digest_time > time
    })
  } else {
    data = essenceData
  }
  const rankMap = new Map<string, {name: string, value:number}>()
  for (const item of data) {
    if (rankMap.has(item.sender_uin)) {
      const value: {name: string, value:number} = rankMap.get(item.sender_uin)!
      rankMap.set(item.sender_uin, {
        name: item.sender_nick,
        value: ++value.value
      })
    } else {
      rankMap.set(item.sender_uin, {
        name: item.sender_nick,
        value: 1
      })
    }
  }

  const top = rankMap.size > 10 ? 10 : rankMap.size

  const arr = Array.from(rankMap)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, top)
    .map((item, index, arr) => {
      const ranking = `${renderRanking(index + 1)} ${item[1].name} ：${item[1].value}条`
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
