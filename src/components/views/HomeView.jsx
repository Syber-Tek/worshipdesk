export default function HomeView({ themeMode }) {
  const isLight = themeMode === 'light'

  return (
    <div className="space-y-4 max-w-2xl">
      <div className={`p-5 rounded-lg border space-y-2 transition-colors duration-200 ${
        isLight
          ? 'bg-[#FFFFFF] border-[#E5E7EB]'
          : 'bg-[#151619] border-[#2A2C31]'
      }`}>
        <h2 className="text-sm font-semibold text-[#D4A94A]">Control Dashboard</h2>
        <p className={isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}>
          Welcome to Church Presenter. Use the left icon rail to navigate between scripture lookup, songs library, service planner, and settings.
        </p>
      </div>
    </div>
  )
}
