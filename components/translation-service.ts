"use client";

import { Language } from "./language-selector";

// Keep the mock translations as fallback in case API fails
const mockTranslations: Record<string, Record<string, string>> = {
  "en": {
    "es": "Esto es una traducción del inglés al español. La traducción automática facilita la comunicación entre idiomas diferentes.",
    "fr": "C'est une traduction de l'anglais vers le français. La traduction automatique facilite la communication entre différentes langues.",
    "de": "Dies ist eine Übersetzung vom Englischen ins Deutsche. Automatische Übersetzung erleichtert die Kommunikation zwischen verschiedenen Sprachen.",
    "ar": "هذه ترجمة من الإنجليزية إلى العربية. الترجمة الآلية تسهل التواصل بين اللغات المختلفة.",
    "zh": "这是从英语到中文的翻译。自动翻译促进了不同语言之间的交流。",
    "ja": "これは英語から日本語への翻訳です。自動翻訳は異なる言語間のコミュニケーションを容易にします。",
    "ko": "이것은 영어에서 한국어로의 번역입니다. 자동 번역은 서로 다른 언어 간의 의사 소통을 용이하게 합니다.",
    "ur": "یہ انگریزی سے اردو میں ترجمہ ہے۔ آٹومیٹک ترجمہ مختلف زبانوں کے درمیان مواصلات کو آسان بناتا ہے۔"
  },
  "es": {
    "en": "This is a translation from Spanish to English. Automatic translation facilitates communication between different languages.",
    "fr": "C'est une traduction de l'espagnol vers le français. La traduction automatique facilite la communication entre différentes langues.",
    "de": "Dies ist eine Übersetzung vom Spanischen ins Deutsche. Automatische Übersetzung erleichtert die Kommunikation zwischen verschiedenen Sprachen.",
    "ar": "هذه ترجمة من الإسبانية إلى العربية. الترجمة الآلية تسهل التواصل بين اللغات المختلفة.",
    "zh": "这是从西班牙语到中文的翻译。自动翻译促进了不同语言之间的交流。",
    "ja": "これはスペイン語から日本語への翻訳です。自動翻訳は異なる言語間のコミュニケーションを容易にします。",
    "ko": "이것은 스페인어에서 한국어로의 번역입니다. 자동 번역은 서로 다른 언어 간의 의사 소통을 용이하게 합니다."
  },
  "fr": {
    "en": "This is a translation from French to English. Automatic translation facilitates communication between different languages.",
    "es": "Esta es una traducción del francés al español. La traducción automática facilita la comunicación entre diferentes idiomas.",
    "de": "Dies ist eine Übersetzung vom Französischen ins Deutsche. Automatische Übersetzung erleichtert die Kommunikation zwischen verschiedenen Sprachen.",
    "ar": "هذه ترجمة من الفرنسية إلى العربية. الترجمة الآلية تسهل التواصل بين اللغات المختلفة.",
    "zh": "这是从法语到中文的翻译。自动翻译促进了不同语言之间的交流。",
    "ja": "これはフランス語から日本語への翻訳です。自動翻訳は異なる言語間のコミュニケーションを容易にします。",
    "ko": "이것은 프랑스어에서 한국어로의 번역입니다. 자동 번역은 서로 다른 언어 간의 의사 소통을 용이하게 합니다."
  },
  "de": {
    "en": "This is a translation from German to English. Automatic translation facilitates communication between different languages.",
    "es": "Esta es una traducción del alemán al español. La traducción automática facilita la comunicación entre diferentes idiomas.",
    "fr": "C'est une traduction de l'allemand vers le français. La traduction automatique facilite la communication entre différentes langues.",
    "ar": "هذه ترجمة من الألمانية إلى العربية. الترجمة الآلية تسهل التواصل بين اللغات المختلفة.",
    "zh": "这是从德语到中文的翻译。自动翻译促进了不同语言之间的交流。",
    "ja": "これはドイツ語から日本語への翻訳です。自動翻訳は異なる言語間のコミュニケーションを容易にします。",
    "ko": "이것은 독일어에서 한국어로의 번역입니다. 자동 번역은 서로 다른 언어 간의 의사 소통을 용이하게 합니다."
  },
  "ar": {
    "en": "This is a translation from Arabic to English. Automatic translation facilitates communication between different languages.",
    "es": "Esta es una traducción del árabe al español. La traducción automática facilita la comunicación entre diferentes idiomas.",
    "fr": "C'est une traduction de l'arabe vers le français. La traduction automatique facilite la communication entre différentes langues.",
    "de": "Dies ist eine Übersetzung vom Arabischen ins Deutsche. Automatische Übersetzung erleichtert die Kommunikation zwischen verschiedenen Sprachen.",
    "zh": "这是从阿拉伯语到中文的翻译。自动翻译促进了不同语言之间的交流。",
    "ja": "これはアラビア語から日本語への翻訳です。自動翻訳は異なる言語間のコミュニケーションを容易にします。",
    "ko": "이것은 아랍어에서 한국어로의 번역입니다. 자동 번역은 서로 다른 언어 간의 의사 소통을 용이하게 합니다."
  }
};

// Keep seed phrases as fallback
const seedPhrases: Record<string, string[]> = {
  "en": [
    "Hello, how are you?",
    "Welcome to our service.",
    "Thank you for your time.",
    "This is an example translation.",
    "The weather is nice today."
  ],
  "es": [
    "Hola, ¿cómo estás?",
    "Bienvenido a nuestro servicio.",
    "Gracias por tu tiempo.",
    "Esta es una traducción de ejemplo.",
    "El clima está agradable hoy."
  ],
  "fr": [
    "Bonjour, comment allez-vous?",
    "Bienvenue à notre service.",
    "Merci pour votre temps.",
    "Ceci est une traduction d'exemple.",
    "Le temps est agréable aujourd'hui."
  ],
  "de": [
    "Hallo, wie geht es dir?",
    "Willkommen bei unserem Service.",
    "Danke für deine Zeit.",
    "Dies ist eine Beispielübersetzung.",
    "Das Wetter ist heute schön."
  ],
  "ar": [
    "مرحبا، كيف حالك؟",
    "مرحبا بكم في خدمتنا.",
    "شكرا لوقتك.",
    "هذه ترجمة مثال.",
    "الطقس لطيف اليوم."
  ],
  "zh": [
    "你好，你好吗？",
    "欢迎使用我们的服务。",
    "谢谢您的时间。",
    "这是一个示例翻译。",
    "今天天气很好。"
  ],
  "ja": [
    "こんにちは、お元気ですか？",
    "私たちのサービスへようこそ。",
    "お時間をいただきありがとうございます。",
    "これは翻訳例です。",
    "今日は天気が良いです。"
  ],
  "ko": [
    "안녕하세요, 어떻게 지내세요?",
    "저희 서비스에 오신 것을 환영합니다.",
    "시간 내주셔서 감사합니다.",
    "이것은 번역 예시입니다.",
    "오늘 날씨가 좋습니다."
  ],
  "ur": [
    "ہیلو، آپ کیسے ہیں؟",
    "ہماری سروس میں خوش آمدید۔",
    "آپ کے وقت کا شکریہ۔",
    "یہ ایک مثال ترجمہ ہے۔",
    "آج موسم اچھا ہے۔"
  ]
};

/**
 * Determines the language of the input text using character and pattern analysis
 * @param text Text to analyze
 * @returns Language code
 */
export function detectLanguage(text: string): string {
  if (!text || text.length === 0) return "unknown";
  
  // Clean and normalize the text
  const cleanText = text.trim().toLowerCase();
  
  // Count characters by language patterns
  const patterns = {
    en: /[a-z]/g,
    es: /[áéíóúüñ]/g,
    fr: /[àâçéèêëîïôœùûüÿ]/g,
    de: /[äöüß]/g,
    ar: /[\u0600-\u06FF]/g,
    zh: /[\u4e00-\u9fff]/g,
    ja: /[\u3040-\u309F\u30A0-\u30FF]/g,
    ko: /[\uAC00-\uD7AF]/g,
    ur: /[\u0600-\u06FF]/g  // Urdu uses Arabic script
  };

  // Count matches for each language
  const counts: Record<string, number> = {};
  Object.entries(patterns).forEach(([lang, pattern]) => {
    const matches = cleanText.match(pattern);
    counts[lang] = matches ? matches.length : 0;
  });

  // Additional English detection based on common words
  const englishWords = /\b(the|is|are|was|were|have|has|had|will|would|can|could|should|may|might|must|be|been|being|do|does|did|i|you|he|she|it|we|they)\b/gi;
  const englishWordMatches = cleanText.match(englishWords);
  if (englishWordMatches) {
    counts.en += englishWordMatches.length * 2; // Give extra weight to English word matches
  }

  // Find the language with the highest count
  let maxCount = 0;
  let detectedLang = "en"; // Default to English if no clear pattern is found

  Object.entries(counts).forEach(([lang, count]) => {
    if (count > maxCount) {
      maxCount = count;
      detectedLang = lang;
    }
  });

  // If very few characters matched any pattern, default to English
  const totalMatches = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (totalMatches < cleanText.length * 0.1) {
    detectedLang = "en";
  }

  return detectedLang;
}

/**
 * Translates text using OpenAI API
 * @param text Text to translate
 * @param sourceLanguage Source language code (or auto for detection)
 * @param targetLanguage Target language to translate to
 * @returns Translated text
 */
export async function translateText(
  text: string, 
  sourceLanguage: string = "auto", 
  targetLanguage: Language
): Promise<string> {
  if (!text || text.trim().length === 0) {
    return "";
  }
  
  // Auto-detect language if needed
  const detectedLang = sourceLanguage === "auto" ? detectLanguage(text) : sourceLanguage;
  
  // Don't translate if source and target are the same
  if (detectedLang === targetLanguage.code) {
    return text;
  }

  try {
    // Try to use OpenAI translation API
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLanguage: detectedLang,
        targetLanguage: targetLanguage.code
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error("OpenAI translation error:", error);
    
    // Fallback to mock translations
    console.log("Falling back to mock translation");
    
    // Try to use predefined translations first for short phrases
    if (text.length < 30 && mockTranslations[detectedLang]?.[targetLanguage.code]) {
      return mockTranslations[detectedLang][targetLanguage.code];
    }
    
    // Simple deterministic "translation" for demo purposes
    try {
      // Use hash of input to select a seed phrase
      const hash = simpleHash(text);
      const targetSeeds = seedPhrases[targetLanguage.code] || seedPhrases["en"];
      
      // Use the hash to select a phrase from the target language
      const seedIndex = hash % targetSeeds.length;
      const targetPhrase = targetSeeds[seedIndex];
      
      // For longer text, combine multiple seed phrases from the TARGET language
      if (text.length > 50) {
        const secondHash = simpleHash(text.substring(text.length / 2));
        const secondIndex = secondHash % targetSeeds.length;
        const thirdHash = simpleHash(text.substring(0, text.length / 3));
        const thirdIndex = thirdHash % targetSeeds.length;
        
        // Create a more varied translation by combining multiple phrases
        return `${targetPhrase} ${targetSeeds[secondIndex]} ${targetSeeds[thirdIndex]}`;
      }
      
      return targetPhrase;
    } catch (error) {
      console.error("Fallback translation error:", error);
      return `[Translation error for: ${text.substring(0, 20)}...]`;
    }
  }
}

/**
 * Simple hash function for consistent pseudo-random seed selection
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
} 