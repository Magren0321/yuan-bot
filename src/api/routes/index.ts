'use strict'
import { Router } from 'express-serve-static-core'
import getEssence from './getEssence'

export default (app: { use: (arg0: Router) => void }) => {
  app.use(getEssence)
}
