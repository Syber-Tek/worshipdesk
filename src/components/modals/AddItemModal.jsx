import React from 'react'
import { FaPlus, FaXmark } from 'react-icons/fa6'

export default function AddItemModal({
  showAddModal,
  setShowAddModal,
  newItemTitle,
  setNewItemTitle,
  newItemContent,
  setNewItemContent,
  newItemType,
  setNewItemType,
  handleAddItem,
  themeMode
}) {
  if (!showAddModal) return null

  const isLight = themeMode === 'light'

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
      isLight ? 'bg-black/30' : 'bg-[#0B0C0E]/80'
    }`}>
      <div className={`border rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4 transition-colors duration-200 ${
        isLight
          ? 'bg-[#FFFFFF] border-[#E5E7EB] text-[#111827]'
          : 'bg-[#151619] border-[#2A2C31] text-[#EDEDEE]'
      }`}>
        <div className={`flex justify-between items-center border-b pb-3 ${
          isLight ? 'border-[#E5E7EB]' : 'border-[#2A2C31]'
        }`}>
          <h3 className="text-sm font-bold text-[#D4A94A] flex items-center gap-2">
            <FaPlus /> Add New Service Playlist Item
          </h3>
          <button
            onClick={() => setShowAddModal(false)}
            className={`transition ${isLight ? 'text-[#6B7280] hover:text-[#111827]' : 'text-[#6B6C73] hover:text-[#EDEDEE]'}`}
          >
            <FaXmark className="text-base" />
          </button>
        </div>

        <form onSubmit={handleAddItem} className="space-y-3">
          <div>
            <label className={`text-[11px] block mb-1 font-semibold ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
              Item Type
            </label>
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
              className={`w-full border rounded px-3 py-2 text-xs outline-none ${
                isLight
                  ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827]'
                  : 'bg-[#1C1D21] border-[#2A2C31] text-[#EDEDEE]'
              }`}
            >
              <option value="Bible Verse">Bible Verse</option>
              <option value="Hymn">Hymn / Song</option>
              <option value="Custom Slide">Custom Sermon Slide</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label className={`text-[11px] block mb-1 font-semibold ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
              Item Title / Heading
            </label>
            <input
              type="text"
              placeholder="e.g. Sermon Note: Living by Faith"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className={`w-full border rounded px-3 py-2 text-xs outline-none focus:border-[#D4A94A] ${
                isLight
                  ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF]'
                  : 'bg-[#1C1D21] border-[#2A2C31] text-[#EDEDEE] placeholder-[#6B6C73]'
              }`}
            />
          </div>

          <div>
            <label className={`text-[11px] block mb-1 font-semibold ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
              Slide Body Content / Text
            </label>
            <textarea
              rows={3}
              placeholder="Enter scripture verse, song stanza, or announcement text..."
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              className={`w-full border rounded px-3 py-2 text-xs outline-none focus:border-[#D4A94A] ${
                isLight
                  ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF]'
                  : 'bg-[#1C1D21] border-[#2A2C31] text-[#EDEDEE] placeholder-[#6B6C73]'
              }`}
            />
          </div>

          <div className={`flex justify-end gap-2 pt-2 border-t ${isLight ? 'border-[#E5E7EB]' : 'border-[#2A2C31]'}`}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                isLight
                  ? 'bg-[#E5E7EB] text-[#4B5563] hover:text-[#111827]'
                  : 'bg-[#24262B] text-[#9B9CA3] hover:text-[#EDEDEE]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#D4A94A] text-[#0B0C0E] font-bold rounded text-xs shadow hover:bg-[#D4A94A]/90 transition"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
