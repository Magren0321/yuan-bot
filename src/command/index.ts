import { rank } from './rank'

const command = {
  '!rank-month': function (): Promise<string> {
    return rank(true)
  },
  '!rank': function (): Promise<string> {
    return rank()
  }
}

export default command
