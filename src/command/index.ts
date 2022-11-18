import { rank } from './rank'
import { bot } from './bot'
import { GroupResponse } from '../types/responses'
import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from 'oicq'

interface ICommand {
  [key: string]: Function
}

const command: ICommand = {
  '!rank-month': function (e:PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent, essenceData:GroupResponse.EssenceDetail[]): Promise<string> {
    return rank(true, essenceData)
  },
  '!rank': function (e:PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent, essenceData:GroupResponse.EssenceDetail[]): Promise<string> {
    return rank(false, essenceData)
  },
  '!bot': function (e: PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent, essenceData:GroupResponse.EssenceDetail[]):Promise<string> {
    return bot(e)
  }
}

export default command
