import { useState } from 'react';
import { encode } from '@msgpack/msgpack';

export default function useTTS() {
  const [isLoading, setIsLoading] = useState(false);

  const generate = async ({ cloneMode, referenceAudio, referenceText, referenceId, targetText, model, audioFormat, temperature, topP }) => {
    if (cloneMode === 'zero_shot' || cloneMode === 'my_voices') {
      if (!referenceAudio) throw new Error("请上传参考音频或从私人库选择一个音色");
      if (!referenceText.trim()) throw new Error("请输入参考音频中对应的文字内容");
    } else if (cloneMode === 'reference_id') {
      if (!referenceId.trim()) throw new Error("请选择或输入已训练模型的 Reference ID");
    }

    if (!targetText.trim()) throw new Error("请输入需要生成的配音文本");

    setIsLoading(true);

    try {
      let bodyData;
      let contentType;

      if (cloneMode === 'zero_shot' || cloneMode === 'my_voices') {
        const arrayBuffer = await referenceAudio.arrayBuffer();
        const audioBytes = new Uint8Array(arrayBuffer);

        const payload = {
          text: targetText.trim(),
          model: model,
          format: audioFormat,
          temperature: temperature,
          top_p: topP,
          references: [
            {
              audio: audioBytes,
              text: referenceText.trim()
            }
          ]
        };
        bodyData = encode(payload);
        contentType = 'application/msgpack';
      } else {
        const payload = {
          text: targetText.trim(),
          model: model,
          format: audioFormat,
          temperature: temperature,
          top_p: topP,
          reference_id: referenceId.trim()
        };
        bodyData = JSON.stringify(payload);
        contentType = 'application/json';
      }

      const response = await fetch('/api/fish/v1/tts', {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: bodyData
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.detail || errorData.error || errorMsg;
        } catch { /* response may not be JSON, use default error message */ }
        throw new Error(`API 请求失败: ${errorMsg}`);
      }

      return await response.blob();
    } finally {
      setIsLoading(false);
    }
  };

  return { generate, isLoading };
}
