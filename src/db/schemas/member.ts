import mongoose from 'mongoose'
import { MemberResponse } from '../../types/responses'

export const MemberSchema = new mongoose.Schema({
  group_id: Number,
  user_id: Number,
  nickname: String,
  card: String,
  sex: String,
  age: Number,
  join_time: Number,
  last_sent_time: Number,
  level: Number,
  role: String,
  title: String,
  title_expire_time: Number,
  shutup_time: Number,
  update_time: Number,
  avatar: String
})

export const Member = mongoose.model<MemberResponse.MemberDetail>('Member', MemberSchema)
