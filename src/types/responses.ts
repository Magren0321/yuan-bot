export namespace GroupResponse {

  export interface MsgContent{
    msg_type: number,
    text?: string,
    image_url?: string,
    image_thumbnail_url?: string
  }

  export interface EssenceDetail{
    group_code: string,
    msg_seq: number,
    msg_random: number,
    sender_uin: string,
    sender_nick: string,
    sender_time: number,
    add_digest_uin: string,
    add_digest_nick: string,
    add_digest_time: number,
    msg_content: MsgContent[]
  }

  export interface EssenceResponse{
    retcode: number,
    retmsg: string,
    data:{
      msg_list: EssenceDetail[],
      is_end: boolean,
      show_tips: false,
      group_role: number,
    }
  }

}
