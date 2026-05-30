/**
 * 酷我歌词解密器 - JavaScript版本 (Node.js)
 */
import * as http from 'node:http'
import * as zlib from 'node:zlib'
import iconv from 'iconv-lite'

// 常量定义
const KEY = Buffer.from('yeelion', 'utf8')
const KEY_LEN = KEY.length

/**
 * 构建请求参数（XOR加密 + Base64编码）
 * @param {number} musicId 音乐ID
 * @param {boolean} isGetLyricx 是否获取lrcx格式
 * @returns {string} 加密后的Base64参数
 */
export function buildParams(musicId, isGetLyricx) {
  let params = `user=12345,web,web,web&requester=localhost&req=1&rid=MUSIC_${musicId}`
  if (isGetLyricx) {
    params += '&lrcx=1'
  }

  const bufStr = Buffer.from(params, 'utf8')
  const bufStrLen = bufStr.length
  const output = Buffer.alloc(bufStrLen)

  // XOR加密
  for (let i = 0; i < bufStrLen; i++) {
    output[i] = bufStr[i] ^ KEY[i % KEY_LEN]
  }

  // Base64编码
  return output.toString('base64')
}

/**
 * 解密歌词数据
 * @param {Buffer} buf 原始响应数据
 * @param {boolean} isGetLyricx 是否为lrcx格式
 * @returns {Promise<string>} 解密后的歌词文本
 */
export async function decodeLyrics(buf, isGetLyricx) {
  // 检查内容格式
  const header = buf.slice(0, Math.min(10, buf.length)).toString('utf8')
  console.log(header)
  if (!header.startsWith('tp=content')) {
    return ''
  }

  // 提取压缩数据（跳过 "\r\n\r\n" 之后的内容）
  const separator = Buffer.from('\r\n\r\n', 'utf8')
  const dataStart = buf.indexOf(separator) + separator.length
  const compressedData = buf.slice(dataStart)

  // zlib解压
  const lrcData = await inflate(compressedData)

  // 如果不是lrcx格式，直接用GB18030解码
  if (!isGetLyricx) {
    return decodeGB18030(lrcData)
  }

  // lrcx格式需要先Base64解码，再XOR解密
  const base64Str = lrcData.toString('utf8')
  const bufStr = Buffer.from(base64Str, 'base64')
  const bufStrLen = bufStr.length
  const output = Buffer.alloc(bufStrLen)

  // XOR解密
  for (let i = 0; i < bufStrLen; i++) {
    output[i] = bufStr[i] ^ KEY[i % KEY_LEN]
  }

  return decodeGB18030(output)
}

/**
 * 转换酷我歌词格式为标准LRC格式
 * @param {string} rawLrc 原始歌词
 * @returns {string} 转换后的LRC格式歌词
 */
export function convertKuwoLrc(rawLrc) {
  const lines = rawLrc.split(/\r\n|\r|\n/)
  let kuwoOffset = 1
  let kuwoOffset2 = 1

  // 解析kuwo标签
  const kuwoTagPattern = /\[kuwo:(\d+)\]/
  const kuwoTagMatch = kuwoTagPattern.exec(rawLrc)
  if (kuwoTagMatch) {
    let kuwoValue = parseInt(kuwoTagMatch[1], 8)
    kuwoOffset = Math.floor(kuwoValue / 10)
    kuwoOffset2 = kuwoValue % 10
    if (kuwoOffset === 0 || kuwoOffset2 === 0) {
      kuwoOffset = 1
      kuwoOffset2 = 1
    }
  }

  const lineTimePattern = /^\[(\d{2}:\d{2}\.\d{3})\](.*)$/
  const wordPattern = /<(-?\d+),(-?\d+)>([^<]*)/g
  const translationPattern = /[\u4e00-\u9fa5]/

  const processedLrc = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    const lineTimeMatch = lineTimePattern.exec(line)

    if (!lineTimeMatch) {
      processedLrc.push(line)
      continue
    }

    let content = lineTimeMatch[2]
    if (content.replace(/<0,0>/g, '').trim() === '') {
      continue
    }

    const lineTimeStr = lineTimeMatch[1]
    const timeParts = lineTimeStr.split(/[:.]+/)
    const lineStartTimeMs =
      parseInt(timeParts[0]) * 60000 + parseInt(timeParts[1]) * 1000 + parseInt(timeParts[2])

    const isTranslationLine = content.startsWith('<0,0>') && translationPattern.test(content)

    if (!isTranslationLine) {
      let newContent = ''
      const wordMatches = []
      let wordMatch

      // 重置正则表达式
      wordPattern.lastIndex = 0
      while ((wordMatch = wordPattern.exec(content)) !== null) {
        const offset = parseInt(wordMatch[1])
        const offset2 = parseInt(wordMatch[2])
        const text = wordMatch[3]

        wordMatches.push({ offset, offset2, text })

        const wordStartTimeMs = Math.abs(Math.floor((offset + offset2) / (kuwoOffset * 2)))
        const absoluteTimeMs = lineStartTimeMs + wordStartTimeMs

        if (newContent === '') {
          newContent = text
        } else {
          newContent += formatTime(absoluteTimeMs) + text
        }
      }

      // 计算结束时间
      let calculatedEndTimestamp = ''
      if (wordMatches.length > 0) {
        const lastMatch = wordMatches[wordMatches.length - 1]
        const offset = lastMatch.offset
        const offset2 = lastMatch.offset2
        const wordStartTimeMs = Math.abs(Math.floor((offset + offset2) / (kuwoOffset * 2)))
        const wordDurationMs = Math.abs(Math.floor((offset - offset2) / (kuwoOffset2 * 2)))
        const wordEndTimeMs = wordStartTimeMs + wordDurationMs
        const absoluteEndTimeMs = lineStartTimeMs + wordEndTimeMs
        calculatedEndTimestamp = formatTime(absoluteEndTimeMs)
      }

      // 检查是否有翻译行
      let translationText = ''
      let translationEndTimestamp = ''
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1]
        const nextLineTimeMatch = lineTimePattern.exec(nextLine)
        if (nextLineTimeMatch) {
          const nextContent = nextLineTimeMatch[2]
          if (nextContent.startsWith('<0,0>') && translationPattern.test(nextContent)) {
            translationText = nextContent.replace(/<0,0>/g, '').trim()

            // 寻找翻译行的结束时间
            for (let j = i + 2; j < lines.length; j++) {
              const futureLineMatch = lineTimePattern.exec(lines[j])
              if (futureLineMatch) {
                translationEndTimestamp = '[' + futureLineMatch[1] + ']'
                break
              }
            }
            if (translationEndTimestamp === '') {
              translationEndTimestamp = calculatedEndTimestamp
            }
            i++
          }
        }
      }

      processedLrc.push(`[${lineTimeStr}]${newContent}${calculatedEndTimestamp}`)
      if (translationText !== '') {
        processedLrc.push(`[${lineTimeStr}]${translationText}${translationEndTimestamp}`)
      }
    }
  }

  return processedLrc.join('\n')
}

/**
 * 格式化时间戳
 * @param {number} ms 毫秒数
 * @returns {string} 格式化的时间字符串 [mm:ss.SSS]
 */
function formatTime(ms) {
  if (ms < 0) ms = 0
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = ms % 1000
  return `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}]`
}

/**
 * zlib解压（Promise版本）
 * @param {Buffer} data 压缩的数据
 * @returns {Promise<Buffer>} 解压后的数据
 */
function inflate(data) {
  return new Promise((resolve, reject) => {
    zlib.inflate(data, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

/**
 * GB18030解码
 * @param {Buffer} data Buffer数据
 * @returns {string} 解码后的字符串
 */
function decodeGB18030(data) {
  // 使用 iconv-lite 库支持 GB18030
  try {
    return iconv.decode(data, 'gb18030')
  } catch (e) {
    // 如果没有 iconv-lite，降级到 utf8
    console.warn('iconv-lite not installed, falling back to utf8')
    return data.toString('utf8')
  }
}

/**
 * 发起HTTP请求获取歌词
 * @param {number} musicId 音乐ID
 * @param {boolean} isGetLyricx 是否获取lrcx格式
 * @returns {Promise<string>} 转换后的歌词
 */
export async function fetchAndConvertLyrics(musicId, isGetLyricx = false) {
  const params = buildParams(musicId, isGetLyricx)
  const url = `http://newlyric.kuwo.cn/newlyric.lrc?${params}`

  console.log(`请求URL: ${url}`)

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    }

    const req = http.request(options, async (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', async () => {
        try {
          const responseData = Buffer.concat(chunks)
          const rawLyric = await decodeLyrics(responseData, isGetLyricx)
          const convertedLyric = convertKuwoLrc(rawLyric)
          resolve(convertedLyric)
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

/**
 * 完整示例
 */
async function example() {
  try {
    const musicId = 514436619
    const isGetLyricx = false

    // 方式1：手动构建URL并处理
    const params = buildParams(musicId, isGetLyricx)
    const url = `http://newlyric.kuwo.cn/newlyric.lrc?${params}`
    console.log('请求URL:', url)

    // 方式2：使用内置的获取函数
    const lyrics = await fetchAndConvertLyrics(musicId, isGetLyricx)
    console.log('\n转换后的LRC歌词:\n', lyrics)

    return lyrics
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
