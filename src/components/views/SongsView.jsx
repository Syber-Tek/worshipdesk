export default function SongsView({ themeMode }) {
  const isLight = themeMode === 'light'

  return (
    <div className={`p-5 rounded-lg border space-y-2 transition-colors duration-200 ${
      isLight
        ? 'bg-[#FFFFFF] border-[#E5E7EB]'
        : 'bg-[#151619] border-[#2A2C31]'
    }`}>
      <h2 className="text-sm font-semibold text-[#D4A94A]">Hymns & Song Library</h2>
      <p className={isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}>Hymn numbers and lyrics database viewer.</p>
    </div>
  )
}
