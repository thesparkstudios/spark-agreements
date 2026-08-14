import React from 'react';
import { Plus, Trash2, Save, Eye, ArrowLeft } from 'lucide-react';
import Section from './Section';
import { CLAUSE_LIBRARY } from '../clauseLibrary';
import { computeTotals, buildClauseContext } from '../calc';
import { emptyEventDay } from '../defaults';

const inputCls = 'w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-1 focus:ring-[#C5A059] text-sm';
const labelCls = 'block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2';

function Field({ label, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export default function AgreementForm({ data, setData, onSave, onPreview, onCancel, isSaving }) {
  const update = (patch) => setData((prev) => ({ ...prev, ...patch }));
  const updateRate = (key, value) => setData((prev) => ({ ...prev, rates: { ...prev.rates, [key]: value } }));
  const updateDay = (id, patch) => setData((prev) => ({
    ...prev,
    eventDays: prev.eventDays.map((d) => (d.id === id ? { ...d, ...patch } : d)),
  }));
  const addDay = () => setData((prev) => ({ ...prev, eventDays: [...prev.eventDays, emptyEventDay()] }));
  const removeDay = (id) => setData((prev) => ({ ...prev, eventDays: prev.eventDays.filter((d) => d.id !== id) }));

  const updateDeliverable = (idx, value) => setData((prev) => ({
    ...prev,
    deliverables: prev.deliverables.map((d, i) => (i === idx ? value : d)),
  }));
  const addDeliverable = () => setData((prev) => ({ ...prev, deliverables: [...prev.deliverables, ''] }));
  const removeDeliverable = (idx) => setData((prev) => ({
    ...prev,
    deliverables: prev.deliverables.filter((_, i) => i !== idx),
  }));

  const toggleClause = (key) => setData((prev) => ({
    ...prev,
    clauses: {
      ...prev.clauses,
      [key]: { ...prev.clauses[key], enabled: !prev.clauses[key].enabled },
    },
  }));
  const setClauseOverride = (key, text) => setData((prev) => ({
    ...prev,
    clauses: {
      ...prev.clauses,
      [key]: { ...prev.clauses[key], override: text },
    },
  }));

  const { packageTotal, depositAmount, balanceAmount } = computeTotals(data);
  const ctx = buildClauseContext(data);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-[11px] font-black uppercase tracking-[0.2em]">
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onPreview} className="flex items-center gap-2 border border-slate-200 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50">
            <Eye size={14} /> Preview
          </button>
          <button onClick={onSave} disabled={isSaving} className="flex items-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#C5A059] disabled:opacity-50">
            <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <Section title="Client Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Client Name">
            <input className={inputCls} value={data.clientName} onChange={(e) => update({ clientName: e.target.value })} />
          </Field>
          <Field label="Telephone">
            <input className={inputCls} value={data.clientPhone} onChange={(e) => update({ clientPhone: e.target.value })} />
          </Field>
          <Field label="Email">
            <input className={inputCls} value={data.clientEmail} onChange={(e) => update({ clientEmail: e.target.value })} />
          </Field>
          <Field label="Address">
            <input className={inputCls} value={data.clientAddress} onChange={(e) => update({ clientAddress: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="Event Schedule">
        <div className="space-y-4">
          {data.eventDays.map((day, i) => (
            <div key={day.id} className="border border-slate-100 rounded-xl p-4 relative">
              {data.eventDays.length > 1 && (
                <button onClick={() => removeDay(day.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              )}
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Day {i + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date">
                  <input className={inputCls} placeholder="Sep 26th, 2026" value={day.date} onChange={(e) => updateDay(day.id, { date: e.target.value })} />
                </Field>
                <Field label="Time">
                  <input className={inputCls} placeholder="4 hrs" value={day.time} onChange={(e) => updateDay(day.id, { time: e.target.value })} />
                </Field>
                <Field label="Venue">
                  <input className={inputCls} value={day.venue} onChange={(e) => updateDay(day.id, { venue: e.target.value })} />
                </Field>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={day.photo} onChange={(e) => updateDay(day.id, { photo: e.target.checked })} /> Photo
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={day.video} onChange={(e) => updateDay(day.id, { video: e.target.checked })} /> Video
                  </label>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addDay} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
            <Plus size={14} /> Add Day
          </button>
        </div>
      </Section>

      <Section title="Package & Fees">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Total Package ($)">
            <input type="number" className={inputCls} value={data.packageTotal} onChange={(e) => update({ packageTotal: e.target.value })} />
          </Field>
          <Field label="Tax Note">
            <input className={inputCls} value={data.taxNote} onChange={(e) => update({ taxNote: e.target.value })} />
          </Field>
          <Field label="Deposit Percent (%)">
            <input type="number" className={inputCls} value={data.depositPercent} onChange={(e) => update({ depositPercent: e.target.value, depositOverrideAmount: '' })} />
          </Field>
          <Field label="Deposit Override ($, optional)">
            <input type="number" className={inputCls} placeholder="Leave blank to use %" value={data.depositOverrideAmount} onChange={(e) => update({ depositOverrideAmount: e.target.value })} />
          </Field>
          <Field label="Payment Method Note">
            <input className={inputCls} value={data.paymentMethodNote} onChange={(e) => update({ paymentMethodNote: e.target.value })} />
          </Field>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 flex justify-between text-sm">
          <div><p className="text-[10px] uppercase text-slate-400 font-black">Total</p><p className="font-black">${packageTotal.toLocaleString()}</p></div>
          <div><p className="text-[10px] uppercase text-slate-400 font-black">Deposit</p><p className="font-black text-[#C5A059]">${depositAmount.toLocaleString()}</p></div>
          <div><p className="text-[10px] uppercase text-slate-400 font-black">Balance</p><p className="font-black">${balanceAmount.toLocaleString()}</p></div>
        </div>
      </Section>

      <Section title="Deliverables">
        <div className="space-y-2">
          {data.deliverables.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={inputCls} value={d} onChange={(e) => updateDeliverable(i, e.target.value)} />
              <button onClick={() => removeDeliverable(i)} className="text-slate-300 hover:text-red-400 shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
          <button onClick={addDeliverable} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#C5A059] mt-2">
            <Plus size={14} /> Add Deliverable
          </button>
        </div>
      </Section>

      <Section title="Delivery & Rates" subtitle="Pre-filled with your standard numbers — only edit what's different for this client.">
        <div className="mb-4">
          <Field label="Delivery Timeline">
            <textarea className={inputCls} rows={2} value={data.deliveryTimeline} onChange={(e) => update({ deliveryTimeline: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="USB Fee ($)"><input type="number" className={inputCls} value={data.rates.usbFee} onChange={(e) => updateRate('usbFee', e.target.value)} /></Field>
          <Field label="Extra Hour Rate ($/hr)"><input type="number" className={inputCls} value={data.rates.extraHourRate} onChange={(e) => updateRate('extraHourRate', e.target.value)} /></Field>
          <Field label="Online Link Expiry (months)"><input type="number" className={inputCls} value={data.rates.linkExpiryMonths} onChange={(e) => updateRate('linkExpiryMonths', e.target.value)} /></Field>
          <Field label="Extra Link Fee ($)"><input type="number" className={inputCls} value={data.rates.extraLinkFee} onChange={(e) => updateRate('extraLinkFee', e.target.value)} /></Field>
          <Field label="Late Payment Fee (%/day)"><input type="number" className={inputCls} value={data.rates.lateFeeDailyPercent} onChange={(e) => updateRate('lateFeeDailyPercent', e.target.value)} /></Field>
          <Field label="Revision Fee ($/hr)"><input type="number" className={inputCls} value={data.rates.revisionFeeHourly} onChange={(e) => updateRate('revisionFeeHourly', e.target.value)} /></Field>
          <Field label="Included Travel Locations"><input type="number" className={inputCls} value={data.rates.includedTravelLocations} onChange={(e) => updateRate('includedTravelLocations', e.target.value)} /></Field>
          <Field label="Extra Travel Fee ($/location)"><input type="number" className={inputCls} value={data.rates.extraTravelFee} onChange={(e) => updateRate('extraTravelFee', e.target.value)} /></Field>
          <Field label="Data Retention (months)"><input type="number" className={inputCls} value={data.rates.dataRetentionMonths} onChange={(e) => updateRate('dataRetentionMonths', e.target.value)} /></Field>
          <Field label="Extra Retention Fee ($/month)"><input type="number" className={inputCls} value={data.rates.extraRetentionFeeMonthly} onChange={(e) => updateRate('extraRetentionFeeMonthly', e.target.value)} /></Field>
          <Field label="Social Media Opt-Out Fee ($)"><input type="number" className={inputCls} value={data.rates.socialMediaOptOutFee} onChange={(e) => updateRate('socialMediaOptOutFee', e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Standard Clauses" subtitle="Toggle clauses on/off, or edit the text for a one-off change to this agreement.">
        <div className="space-y-3">
          {CLAUSE_LIBRARY.map((clause) => {
            const state = data.clauses[clause.key] || { enabled: true, override: null };
            const rendered = clause.render(ctx)
              .map((b) => (typeof b === 'string' ? b : `• ${b.li}`))
              .join('\n');
            return (
              <div key={clause.key} className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <input type="checkbox" checked={state.enabled} onChange={() => toggleClause(clause.key)} />
                    {clause.title}
                  </label>
                </div>
                {state.enabled && (
                  <textarea
                    className="w-full text-[12px] text-slate-500 bg-slate-50 rounded-lg p-3 outline-none focus:ring-1 focus:ring-[#C5A059]"
                    rows={3}
                    value={state.override ?? rendered}
                    onChange={(e) => setClauseOverride(clause.key, e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
