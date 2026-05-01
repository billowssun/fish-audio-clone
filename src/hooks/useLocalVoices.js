import { useState, useEffect } from 'react';
import localforage from 'localforage';

export default function useLocalVoices() {
  const [savedVoices, setSavedVoices] = useState([]);

  const loadVoices = async () => {
    try {
      const voices = await localforage.getItem('my_saved_voices') || [];
      setSavedVoices(voices);
    } catch (err) {
      console.error("加载本地音色失败:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVoices();
  }, []);

  const saveVoice = async ({ referenceAudio, referenceText, voiceName }) => {
    if (!referenceAudio || !referenceText.trim()) {
      throw new Error("必须包含音频和对应文本才能保存！");
    }
    if (!voiceName.trim()) {
      throw new Error("请输入音色名称！");
    }

    const arrayBuffer = await referenceAudio.arrayBuffer();
    const newVoice = {
      id: Date.now().toString(),
      name: voiceName.trim(),
      audioData: arrayBuffer,
      audioName: referenceAudio.name,
      audioMime: referenceAudio.type,
      text: referenceText.trim(),
      timestamp: new Date().toISOString()
    };

    const currentVoices = await localforage.getItem('my_saved_voices') || [];
    const updatedVoices = [newVoice, ...currentVoices];
    await localforage.setItem('my_saved_voices', updatedVoices);
    setSavedVoices(updatedVoices);
    return newVoice;
  };

  const deleteVoice = async (id) => {
    const updatedVoices = savedVoices.filter(v => v.id !== id);
    await localforage.setItem('my_saved_voices', updatedVoices);
    setSavedVoices(updatedVoices);
  };

  return { savedVoices, saveVoice, deleteVoice };
}
