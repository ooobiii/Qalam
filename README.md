# Qalam

Qalam is a real-time speech transcription and translation application that helps bridge language barriers with AI-powered translation.

📝 **Live Transcription**: Capture spoken language in real-time
🌍 **Instant Translation**: Translate to 8+ supported languages
🎙️ **Voice Recognition**: Works with your device's microphone

## Features

- **Multi-language Support**: Arabic, Chinese, English, French, German, Japanese, Korean, Spanish, and Urdu
- **Real-time Processing**: Immediate transcription and translation as you speak
- **OpenAI Integration**: Uses OpenAI API for high-quality translations
- **Dark/Light Mode**: Comfortable viewing in any environment

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- An OpenAI API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qalam.git
cd qalam
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use Qalam.

## Usage

1. Select your speech language from the dropdown
2. Choose the language you want to translate to
3. Click the microphone button and start speaking
4. View the transcription and translation in real-time

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [OpenAI API](https://openai.com/api/) - Translation service
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Speech recognition

## License

This project is open source and available under the [MIT License](LICENSE).
