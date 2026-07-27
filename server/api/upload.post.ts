import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nenhum arquivo enviado.'
      })
    }

    const file = formData.find(item => item.name === 'file' || item.name === 'image') || formData[0]
    
    if (!file || !file.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Arquivo inválido.'
      })
    }

    // Use Nuxt runtimeConfig for reliable env access (with fallback to process.env)
    const config = useRuntimeConfig()
    const endpoint = config.r2Endpoint || process.env.R2_ENDPOINT
    const accessKeyId = config.r2AccessKeyId || process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = config.r2SecretAccessKey || process.env.R2_SECRET_ACCESS_KEY
    const bucketName = config.r2BucketName || process.env.R2_BUCKET_NAME || 'unajoya'
    const publicBaseUrl = (config.r2PublicUrl || process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      console.error('R2 Config Missing:', { 
        hasEndpoint: !!endpoint, 
        hasAccessKey: !!accessKeyId, 
        hasSecret: !!secretAccessKey 
      })
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuração do Cloudflare R2 incompleta no servidor.'
      })
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })

    // Preserva a resolução máxima original e nome do arquivo
    const cleanFileName = (file.filename || 'upload')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()
    
    const uniqueKey = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanFileName}`
    const mimeType = file.type || 'image/jpeg'

    // Upload direto em resolução máxima para o Cloudflare R2
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      Body: file.data,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000'
    }))

    const publicUrl = `${publicBaseUrl}/${uniqueKey}`

    return {
      success: true,
      url: publicUrl,
      key: uniqueKey,
      filename: file.filename,
      size: file.data.length,
      contentType: mimeType
    }
  } catch (error: any) {
    console.error('R2 Upload Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao realizar upload para o Cloudflare R2.'
    })
  }
})
