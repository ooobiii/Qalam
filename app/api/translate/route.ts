import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Access environment variable for API key
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const { text, sourceLanguage, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required parameters: text or targetLanguage' },
        { status: 400 }
      );
    }

    // Get the language name for clearer prompt
    const langName = getLanguageName(targetLanguage);

    // Create prompt for translation
    const prompt = `Translate the following text from ${sourceLanguage !== 'auto' ? getLanguageName(sourceLanguage) : 'the detected language'} to ${langName}. Only return the translation, nothing else:\n\n${text}`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given text to ${langName}. Only respond with the translation, no explanations or additional text.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const translation = data.choices[0].message.content.trim();

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate text', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Helper function to get language name from code
function getLanguageName(code: string): string {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ur': 'Urdu',
    'auto': 'Auto Detect'
  };

  return languageMap[code] || code;
} 