export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 注入阿里云 API Key
  const apiKey = process.env.ALIYUN_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: '服务端未配置 ALIYUN_API_KEY 环境变量，请在 Vercel 控制台设置。' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 从前端请求中解析 multipart/form-data，提取音频文件和模型参数
    const formData = await req.formData();
    const audioFile = formData.get('file');
    const model = formData.get('model') || 'sensevoice-v1';

    if (!audioFile) {
      return new Response(JSON.stringify({ error: '请求中缺少音频文件 (file 字段)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 重新构造一个干净的 FormData 发给阿里云
    // 不手动设置 Content-Type，让 fetch 自动生成正确的 boundary
    const outFormData = new FormData();
    outFormData.append('file', audioFile);
    outFormData.append('model', model);

    // Vercel 部署在美国，必须使用阿里云的国际节点
    // 国内节点 dashscope.aliyuncs.com 无法从 Vercel 访问
    const targetUrl = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/audio/transcriptions';

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // 不设置 Content-Type，让 fetch 自动处理
      },
      body: outFormData,
    });

    const resHeaders = new Headers();
    resHeaders.set('Content-Type', 'application/json');
    resHeaders.set('Access-Control-Allow-Origin', '*');

    // 将阿里云返回的结果透传给前端
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: resHeaders,
    });

  } catch (err) {
    console.error('ASR proxy error:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
