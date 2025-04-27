# Qalam

Qalam is a real-time speech transcription and translation application that helps bridge language barriers with AI-powered translation.

📝 **Live Transcription**: Capture spoken language in real-time
🌍 **Instant Translation**: Translate to multiple supported languages
🎙️ **Voice Recognition**: Works with your device's microphone
💾 **Save Transcriptions**: Store and manage your transcriptions with a Supabase backend

## Features

- **Multi-language Support**: Arabic, Chinese, English, French, German, Japanese, Korean, Spanish, and Urdu
- **Real-time Processing**: Immediate transcription and translation as you speak
- **User Authentication**: Google authentication via Supabase
- **Cloud Storage**: Save your transcriptions to access them later
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Comfortable viewing in any environment

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- A Supabase account with a new project
- An OpenAI API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/live-transcription-translation.git
cd live-transcription-translation
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Set up your Supabase database:
   - Run the SQL commands found in `supabase/migrations/` in your Supabase SQL Editor
   - Or follow the instructions in `SUPABASE_SETUP.md`

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to use Qalam.

## Usage

1. Select your speech language from the dropdown
2. Choose the language you want to translate to
3. Click the microphone button and start speaking
4. View the transcription and translation in real-time
5. Sign in with Google to save your transcriptions
6. Access your saved transcriptions on the My Transcriptions page

## Database Schema

The application uses a Supabase PostgreSQL database with the following structure:

- **transcriptions** table:
  - id (uuid, auto-generated)
  - created_at (timestamp)
  - user_id (uuid) - links to auth.users
  - title (text)
  - content (text) - original transcription
  - translation (text) - translated content
  - source_language (varchar) - language code of the original
  - target_language (varchar) - language code of the translation

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [Supabase](https://supabase.com/) - Backend and Authentication
- [OpenAI API](https://openai.com/api/) - Translation service
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Speech recognition
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## License

This project is open source and available under the [MIT License](LICENSE).
