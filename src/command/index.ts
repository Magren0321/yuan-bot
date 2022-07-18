import { rank } from './rank'

interface ICommand {
  [key: string]: Function
}

const command: ICommand = {
  '!rank-month': function (): Promise<string> {
    return rank(true)
  },
  '!rank': function (): Promise<string> {
    return rank()
  }
}

export default command
