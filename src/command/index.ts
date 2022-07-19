import { rank } from './rank'
import { GroupResponse } from '../types/responses'

interface ICommand {
  [key: string]: Function
}

const command: ICommand = {
  '!rank-month': function (essenceData:GroupResponse.EssenceDetail[]): Promise<string> {
    return rank(true, essenceData)
  },
  '!rank': function (essenceData:GroupResponse.EssenceDetail[]): Promise<string> {
    return rank(false, essenceData)
  }
}

export default command
