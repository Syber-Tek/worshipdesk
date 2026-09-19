import React from 'react'
import { TickSquare, Plus, Show, Send, ArrowUp, ArrowDown, Delete, Activity } from 'react-iconly'

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
    <div className="space-y-4 max-w-4xl w-full mx-auto">
      <div className={`p-5 rounded-lg border space-y-4 transition-colors duration-200 ${
        isLight ? 'bg-[#FFFFFF] border-[#E5E7EB]' : 'bg-[#151619] border-[#2A2C31]'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${
          isLight ? 'border-[#E5E7EB]' : 'border-[#2A2C31]'
        }`}>
          <div>
            <h2 className="text-sm font-bold text-accent flex items-center gap-2">
              <TickSquare set="bold" primaryColor="#D4A94A" size="small" /> Sunday Service Order Playlist
            </h2>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-[#6B7280]' : 'text-[#9B9CA3]'}`}>
              Reorderable service items (click item to stage or present).
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent/90 text-text-primary rounded font-semibold text-xs transition shadow cursor-pointer w-full sm:w-auto"
          >
            <Plus set="bold" primaryColor="#0B0C0E" size="small" /> Add Service Item
          </button>
        </div>

        {playlist.length === 0 ? (
          <div className={`p-8 rounded-lg border text-center space-y-3 ${
            isLight ? 'bg-[#F3F4F6] border-[#E5E7EB]' : 'bg-[#1C1D21] border-[#2A2C31]'
          }`}>
            <div className="flex justify-center">
              <TickSquare set="light" primaryColor={isLight ? '#9CA3AF' : '#6B6C73'} size="large" />
            </div>
            <h3 className={`text-sm font-bold ${isLight ? 'text-[#111827]' : 'text-text-primary'}`}>No Items in Service Playlist</h3>
            <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-[#4B5563]' : 'text-[#9B9CA3]'}`}>
              Your service order is currently empty. Add scripture readings, hymns, or sermon slides to build your Sunday worship plan.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-accent text-text-primary font-semibold text-xs rounded shadow hover:bg-accent/90 transition cursor-pointer"
            >
              + Add First Service Item
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.map((item, index) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 transition ${
                  item.status === 'live'
                    ? 'bg-live/10 border-live'
                    : item.status === 'next'
                    ? isLight
                      ? 'bg-[#F3F4F6] border-accent'
                      : 'bg-[#1C1D21] border-accent/50'
                    : isLight
                    ? 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#D1D5DB]'
                    : 'bg-[#1C1D21] border-[#2A2C31] hover:border-[#3A3B40]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`flex items-center gap-1.5 ${isLight ? 'text-[#9CA3AF]' : 'text-[#6B6C73]'}`}>
                    <span className="font-mono text-[10px]">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.status === 'live' && (
                      <Activity set="bold" primaryColor="#E5484D" size="small" />
                    )}
                    {item.status === 'next' && (
                      <Activity set="bold" primaryColor="#D4A94A" size="small" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-xs truncate ${isLight ? 'text-[#111827]' : 'text-text-primary'}`}>
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
                    className={`p-1 border rounded transition cursor-pointer ${
                      isLight
                        ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] text-accent border-[#D1D5DB]'
                        : 'bg-[#24262B] hover:bg-[#2A2C31] text-accent border-[#2A2C31]'
                    }`}
                  >
                    <Show set="bold" primaryColor="#D4A94A" size="small" />
                  </button>
                  <button
                    onClick={() => handlePresentItemNow(item)}
                    title="Present Live Now"
                    className="p-1 bg-accent hover:bg-accent/90 text-text-primary rounded transition shadow cursor-pointer"
                  >
                    <Send set="bold" primaryColor="#0B0C0E" size="small" />
                  </button>
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                    className={`p-1 border rounded transition disabled:opacity-30 cursor-pointer ${
                      isLight
                        ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#4B5563] border-[#D1D5DB]'
                        : 'bg-[#24262B] hover:bg-[#2A2C31] text-[#9B9CA3] border-[#2A2C31]'
                    }`}
                  >
                    <ArrowUp set="light" primaryColor="currentColor" size="small" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === playlist.length - 1}
                    title="Move Down"
                    className={`p-1 border rounded transition disabled:opacity-30 cursor-pointer ${
                      isLight
                        ? 'bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#4B5563] border-[#D1D5DB]'
                        : 'bg-[#24262B] hover:bg-[#2A2C31] text-[#9B9CA3] border-[#2A2C31]'
                    }`}
                  >
                    <ArrowDown set="light" primaryColor="currentColor" size="small" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete Item"
                    className={`p-1 border rounded transition cursor-pointer ${
                      isLight
                        ? 'bg-[#E5E7EB] hover:bg-live/20 text-[#6B7280] hover:text-live border-[#D1D5DB]'
                        : 'bg-[#24262B] hover:bg-live/20 text-[#6B6C73] hover:text-live border-[#2A2C31]'
                    }`}
                  >
                    <Delete set="light" primaryColor="#E5484D" size="small" />
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
