import { rank } from './rank'
import { bot } from './bot'
import { matching } from './matching'
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
  },
  '!matching': function (e: PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent, essenceData:GroupResponse.EssenceDetail[]):Promise<string> {
    return matching(e)
  }
}

export default command
