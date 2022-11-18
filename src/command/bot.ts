import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq'

export const bot = async (e: PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent) => {
  if ((e as GroupMessageEvent).group.pickMember(e.sender.user_id).is_admin) {
    return '在的，我的管理🥰'
  } else {
    return '爪巴'
  }
}
