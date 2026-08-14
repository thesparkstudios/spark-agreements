import React from 'react';
import { Plus, Search, Edit3, Copy, Trash2, Eye, FileText } from 'lucide-react';
import { computeTotals } from '../calc';

export default function Dashboard({
  agreements, searchTerm, setSearchTerm,
  onNew, onEdit, onDuplicate, onDelete, onPreview,
  deletingId,
}) {
  const filtered = agreements
    .filter((a) => (a.clientName || '').toLowerCase().includes(searchTerm.toLowerCase().trim()))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-light text-slate-950 uppercase font-serif">Agreements</h1>
          <p className="text-slate-400 text-[10px] tracking-[0.3em] uppercase font-black mt-1">The Spark Studios</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-slate-950 text-white px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all active:scale-95"
        >
          <Plus size={16} /> New Agreement
        </button>
      </div>

      <div className="relative mb-8">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by client name..."
          className="w-full pl-11 pr-4 py-4 border border-slate-200 bg-white rounded-2xl outline-none focus:ring-1 focus:ring-[#C5A059] text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <FileText size={40} className="mx-auto mb-4 text-slate-200" strokeWidth={1.5} />
          <p className="text-sm">No agreements yet. Create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const { packageTotal, depositAmount, balanceAmount } = computeTotals(a);
            return (
              <div
                key={a.id}
                className="flex items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow flex-wrap"
              >
                <div className="min-w-[180px]">
                  <p className="font-black text-slate-950 text-sm">{a.clientName || 'Untitled Client'}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {a.eventDays?.[0]?.date || 'No date set'}
                    {a.eventDays?.length > 1 ? ` +${a.eventDays.length - 1} more` : ''}
                  </p>
                </div>
                <div className="text-[11px] text-slate-500 flex gap-6">
                  <span>Total: <strong className="text-slate-900">${packageTotal.toLocaleString()}</strong></span>
                  <span>Deposit: <strong className="text-slate-900">${depositAmount.toLocaleString()}</strong></span>
                  <span>Balance: <strong className="text-slate-900">${balanceAmount.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onPreview(a.id)} title="Preview" className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => onEdit(a.id)} title="Edit" className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => onDuplicate(a.id)} title="Duplicate" className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    title="Delete"
                    disabled={deletingId === a.id}
                    className="w-9 h-9 rounded-xl border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
