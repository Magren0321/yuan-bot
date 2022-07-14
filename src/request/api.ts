import axios from './index'

let cookie = ''
let bkn = 0

const api  = {

  setApiConfig: function(apiCookie: string,apiBkn: number){
    cookie = apiCookie;
    bkn = apiBkn;
  },

  getEssence: async function(qNumber: number,startPage: number){
    const url = `https://qun.qq.com/cgi-bin/group_digest/digest_list?bkn=${bkn}&group_code=${qNumber}&page_start=${startPage}&page_limit=50`
    const response = axios({
      url: url,
      headers:{
        cookie:cookie,
      },
      method:'GET'
    })
    return response
  }
  
}

export default api;