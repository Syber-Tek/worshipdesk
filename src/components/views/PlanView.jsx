import React from 'react'
import {
  FaListCheck,
  FaPlus,
  FaGripVertical,
  FaCircle,
  FaEye,
  FaPaperPlane,
  FaArrowUp,
  FaArrowDown,
  FaTrash
} from 'react-icons/fa6'

export default function PlanView({
  playlist,
  setShowAddModal,
  handleSelectItem,
  handlePresentItemNow,
  handleMoveUp,
  handleMoveDown,
  handleDeleteItem,
  themeMode
}) {
  const isLight = themeMode === 'light'

  return (
    <div className="space-y-4 max-w-4xl">
      <div className={`p-5 rounded-lg border space-y-4 transition-colors duration-200 ${
        isLight ? 'bg-[#FFFFFF] border-[#E5E7EB]' : 'bg-[#151619] border-[#2A2C31]'
      }`}>
        <div className={`flex justify-between items-center border-b pb-3 ${
          isLight ? 'border-[#E5E7EB]' : 'border-[#2A2C31]'
        }`}>
          <div>
            <h2 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
              <FaListCheck /> Sunday Service Order Playlist
            </h2>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-[#6B7280]' : 'text-[#9B9CA3]'}`}>
              Reorderable service items (click item to stage or present).
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A94A] hover:bg-[#D4A94A]/90 text-[#0B0C0E] rounded font-semibold text-xs transition shadow"
          >
            <FaPlus /> Add Service Item
          </button>
        </div>

        {playlist.length === 0 ? (
          <div className={`p-8 rounded-lg border text-center space-y-3 ${
            isLight ? 'bg-[#F3F4F6] border-[#E5E7EB]' : 'bg-[#1C1D21] border-[#2A2C31]'
          }`}>
            <FaListCheck className={`text-3xl mx-auto ${isLight ? 'text-[#9CA3AF]' : 'text-[#6B6C73]'}`} />
            <h3 className={`text-sm font-bold ${isLight ? 'text-[#111827]' : 'text-[#EDEDEE]'}`}>No Items in Service Playlist</h3>
            <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
              Your service order is currently empty. Add scripture readings, hymns, or sermon slides to build your Sunday worship plan.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#D4A94A] text-[#0B0C0E] font-semibold text-xs rounded shadow hover:bg-[#D4A94A]/90 transition"
            >
              + Add First Service Item
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.map((item, index) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition ${
                  item.status === 'live'
                    ? 'bg-[#E5484D]/10 border-[#E5484D]'
                    : item.status === 'next'
                    ? isLight
                      ? 'bg-[#F3F4F6] border-[#D4A94A]'
                      : 'bg-[#1C1D21] border-[#D4A94A]/50'
                    : isLight
                    ? 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#D1D5DB]'
                    : 'bg-[#1C1D21] border-[#2A2C31] hover:border-[#3A3B40]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`flex items-center gap-1.5 ${isLight ? 'text-[#9CA3AF]' : 'text-[#6B6C73]'}`}>
                    <FaGripVertical className="text-xs cursor-grab" />
                    <span className="font-mono text-[10px]">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.status === 'live' && (
                      <FaCircle className="text-[7px] text-[#E5484D] animate-pulse" />
                    )}
                    {item.status === 'next' && (
                      <FaCircle className="text-[7px] text-[#D4A94A]" />
                    )}
                    {item.status === 'pending' && (
                      <FaCircle className={`text-[7px] ${isLight ? 'text-[#9CA3AF]' : 'text-[#6B6C73]'}`} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-xs truncate ${isLight ? 'text-[#111827]' : 'text-[#EDEDEE]'}`}>
                        {item.title}
                      </h4>
                      <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                        isLight
                          ? 'bg-[#E5E7EB] text-[#4B5563] border-[#D1D5DB]'
                          : 'bg-[#24262B] text-[#9B9CA3] border-[#2A2C31]'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSelectItem(item)}
                    title="Stage as Next"
                    className={`p-1.5 border rounded transition ${
                      isLight
                        ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#D4A94A] border-[#D1D5DB]'
                        : 'bg-[#24262B] hover:bg-[#2A2C31] text-[#D4A94A] border-[#2A2C31]'
                    }`}
                  >
                    <FaEye className="text-xs" />
                  </button>
                  <button
                    onClick={() => handlePresentItemNow(item)}
                    title="Present Live Now"
                    className="p-1.5 bg-[#D4A94A] hover:bg-[#D4A94A]/90 text-[#0B0C0E] rounded transition shadow"
                  >
                    <FaPaperPlane className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                    className={`p-1.5 border rounded transition disabled:opacity-30 ${
                      isLight
                        ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#4B5563] border-[#D1D5DB]'
                        : 'bg-[#24262B] hover:bg-[#2A2C31] text-[#9B9CA3] border-[#2A2C31]'
                    }`}
                  >
                    <FaArrowUp className="text-[10px]" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === playlist.length - 1}
                    title="Move Down"
                    className={`p-1.5 border rounded transition disabled:opacity-30 ${
                      isLight
                        ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#4B5563] border-[#D1D5DB]'
                        : 'bg-[#24262B] hover:bg-[#2A2C31] text-[#9B9CA3] border-[#2A2C31]'
                    }`}
                  >
                    <FaArrowDown className="text-[10px]" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete Item"
                    className={`p-1.5 border rounded transition ${
                      isLight
                        ? 'bg-[#E5E7EB] hover:bg-[#E5484D]/20 text-[#6B7280] hover:text-[#E5484D] border-[#D1D5DB]'
                        : 'bg-[#24262B] hover:bg-[#E5484D]/20 text-[#6B6C73] hover:text-[#E5484D] border-[#2A2C31]'
                    }`}
                  >
                    <FaTrash className="text-[10px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
