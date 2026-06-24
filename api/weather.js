export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({
      message: '只允許 GET 請求',
    })
  }

  try {
    const apiKey = process.env.CWA_API_KEY

    if (!apiKey) {
      return response.status(500).json({
        message: '伺服器尚未設定氣象 API 授權碼',
      })
    }

    const url = new URL(
      'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001'
    )

    url.searchParams.set('Authorization', apiKey)

    const cwaResponse = await fetch(url)

    if (!cwaResponse.ok) {
      throw new Error(`氣象署 API 錯誤：${cwaResponse.status}`)
    }

    const data = await cwaResponse.json()

    response.setHeader(
      'Cache-Control',
      's-maxage=600, stale-while-revalidate=300'
    )

    return response.status(200).json(data)
  } catch (error) {
    console.error(error)

    return response.status(500).json({
      message: '無法取得天氣資料',
    })
  }
}