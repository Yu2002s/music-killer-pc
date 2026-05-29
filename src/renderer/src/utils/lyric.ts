// Using Node.js Buffer for encoding, or you can use TextEncoder for browser
const KEY: Uint8Array = new TextEncoder().encode('yeelion')
const KEY_LEN: number = KEY.length

/**
 * 构建请求参数（XOR加密 + Base64编码）
 * @param musicId 音乐ID
 * @param isGetLyricx 是否获取lrcx格式
 * @return 加密后的Base64参数
 */
export function buildParams(musicId: number, isGetLyricx: boolean): string {
  let params: string = `user=12345,web,web,web&requester=localhost&req=1&rid=MUSIC_${musicId}`
  if (isGetLyricx) {
    params += '&lrcx=1'
  }

  // Convert string to bytes (UTF-8)
  const bufStr: Uint8Array = new TextEncoder().encode(params)
  const bufStrLen: number = bufStr.length
  const output: Uint8Array = new Uint8Array(bufStrLen)

  // XOR加密
  for (let i = 0; i < bufStrLen; i++) {
    output[i] = bufStr[i] ^ KEY[i % KEY_LEN]
  }

  // Base64编码
  // 使用浏览器环境的btoa，但需要注意btoa不支持Unicode字符
  // 更好的方式是使用Base64编码Uint8Array
  return btoa(String.fromCharCode(...output))
}

// 如果需要支持Node.js环境，可以使用Buffer
export function buildParamsNode(musicId: number, isGetLyricx: boolean): string {
  let params: string = `user=12345,web,web,web&requester=localhost&req=1&rid=MUSIC_${musicId}`
  if (isGetLyricx) {
    params += '&lrcx=1'
  }

  const bufStr: Buffer = Buffer.from(params, 'utf-8')
  const bufStrLen: number = bufStr.length
  const output: Buffer = Buffer.alloc(bufStrLen)

  for (let i = 0; i < bufStrLen; i++) {
    output[i] = bufStr[i] ^ KEY[i % KEY_LEN]
  }

  return output.toString('base64')
}

// 通用的Base64编码Uint8Array函数（跨平台）
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ''
  const len = bytes.length
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// 更好的实现：直接在buildParams中使用
export function buildParamsUniversal(musicId: number, isGetLyricx: boolean): string {
  let params: string = `user=12345,web,web,web&requester=localhost&req=1&rid=MUSIC_${musicId}`
  if (isGetLyricx) {
    params += '&lrcx=1'
  }

  const bufStr: Uint8Array = new TextEncoder().encode(params)
  const bufStrLen: number = bufStr.length
  const output: Uint8Array = new Uint8Array(bufStrLen)

  for (let i = 0; i < bufStrLen; i++) {
    output[i] = bufStr[i] ^ KEY[i % KEY_LEN]
  }

  // 将Uint8Array转换为Base64
  let binary = ''
  for (let i = 0; i < output.length; i++) {
    binary += String.fromCharCode(output[i])
  }
  return btoa(binary)
}
