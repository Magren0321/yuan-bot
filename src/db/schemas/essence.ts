import type { Document, Model } from 'mongoose'
import mongoose from 'mongoose'

export interface Essence extends Document {
  
}

export const EssenceSchema = new mongoose.Schema({
  
})

export const Essence: Model<Essence>
  = mongoose.models.Essence || mongoose.model<Essence>('Essence', EssenceSchema)
