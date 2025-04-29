import Link from 'next/link'

export function BuyMeCoffee() {
  return (
    <Link
      href="https://buymeacoffee.com/ooobiii"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center bg-[#FFDD00] hover:bg-[#FFCD00] text-black font-medium px-3 py-1 rounded-md transition-colors"
    >
      Buy me a coffee
    </Link>
  )
} 