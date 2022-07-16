import mongoose from 'mongoose'
import { GroupResponse } from '../../types/responses'

export const EssenceSchema = new mongoose.Schema({
  group_code: String,
  msg_seq: Number,
  msg_random: Number,
  sender_uin: String,
  sender_nick: String,
  sender_time: Number,
  add_digest_uin: String,
  add_digest_nick: String,
  add_digest_time: Number,
  msg_content: [
    {
      msg_type: Number,
      text: String,
      image_url: String,
      image_thumbnail_url: String
    }
  ]
})

export const Essence = mongoose.model<GroupResponse.EssenceDetail>('Essence', EssenceSchema)
