export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch('https://api.deepgram.com/v1/listen?detect_language=true&model=whisper-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_DEEPGRAM_API_KEY}`
      },
      body: formData
    });

    const data = await response.json();
    return data.results?.channels[0]?.alternatives[0]?.transcript || '';
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

export async function synthesizeSpeech(text: string): Promise<string> {
  try {
    const response = await fetch('https://api.deepgram.com/v1/speak', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        voice: 'nova',
        model: 'aura-alpha'
      })
    });

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Speech synthesis error:', error);
    throw error;
  }
}