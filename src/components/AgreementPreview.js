import React from 'react';
import html2pdf from 'html2pdf.js';
import { ArrowLeft, Edit3, Download } from 'lucide-react';
import { CLAUSE_LIBRARY } from '../clauseLibrary';
import { computeTotals, buildClauseContext } from '../calc';
import { STUDIO } from '../defaults';

const H2 = ({ children }) => (
  <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-950 border-b-2 border-[#C5A059] pb-2 mb-3 mt-8" style={{ breakAfter: 'avoid' }}>
    {children}
  </h2>
);

const P = ({ children }) => <p className="text-[11.5px] text-slate-600 leading-[1.7] mb-2">{children}</p>;

function ClauseBlocks({ clause, ctx, state }) {
  if (state.override != null) {
    return state.override.split('\n').filter(Boolean).map((line, i) => <P key={i}>{line}</P>);
  }
  return clause.render(ctx).map((block, i) =>
    typeof block === 'string'
      ? <P key={i}>{block}</P>
      : <p key={i} className="text-[11.5px] text-slate-600 leading-[1.7] mb-1 pl-4 relative"><span className="absolute left-0">-</span>{block.li}</p>
  );
}

export default function AgreementPreview({ data, onBack, onEdit }) {
  const { packageTotal, depositAmount, balanceAmount } = computeTotals(data);
  const ctx = buildClauseContext(data);

  const handleDownload = () => {
    const el = document.getElementById('agreement-print-root');
    const filename = `Agreement - ${data.clientName || 'Client'}.pdf`;
    html2pdf().set({
      margin: [12, 12, 12, 12],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    }).from(el).save();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8 no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-[11px] font-black uppercase tracking-[0.2em]">
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onEdit} className="flex items-center gap-2 border border-slate-200 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50">
            <Edit3 size={14} /> Edit
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#C5A059]">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      <div id="agreement-print-root" className="bg-white border border-slate-100 rounded-2xl shadow-sm p-10 md:p-14">
        <div className="text-center mb-8">
          <img src={STUDIO.logoUrl} alt={STUDIO.name} className="h-12 mx-auto mb-4" />
          <h1 className="text-xl font-black uppercase tracking-[0.15em] text-slate-950">Event Coverage Contract</h1>
          <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] mt-1">Agreement for Photography &amp; Videography Services</p>
        </div>

        <H2>Client Information</H2>
        <div className="grid grid-cols-2 gap-3 text-[11.5px] text-slate-600 mb-2">
          <p><strong className="text-slate-900">Client Name:</strong> {data.clientName}</p>
          <p><strong className="text-slate-900">Telephone:</strong> {data.clientPhone}</p>
          <p><strong className="text-slate-900">Email:</strong> {data.clientEmail}</p>
          <p><strong className="text-slate-900">Address:</strong> {data.clientAddress}</p>
        </div>

        <P>
          This contract is for photography/videography services to be provided by {STUDIO.name}, the photographer/videographer, for the event of the above-named client scheduled for:
        </P>

        <table className="w-full text-[11px] text-slate-600 border-collapse mt-3 mb-4">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-2 pr-2 font-black uppercase tracking-wider text-[10px]">Date</th>
              <th className="py-2 pr-2 font-black uppercase tracking-wider text-[10px]">Time</th>
              <th className="py-2 pr-2 font-black uppercase tracking-wider text-[10px]">Services</th>
              <th className="py-2 pr-2 font-black uppercase tracking-wider text-[10px]">Venue</th>
            </tr>
          </thead>
          <tbody>
            {data.eventDays.map((d) => (
              <tr key={d.id} className="border-b border-slate-100">
                <td className="py-2 pr-2">{d.date}</td>
                <td className="py-2 pr-2">{d.time}</td>
                <td className="py-2 pr-2">{[d.photo && 'Photo', d.video && 'Video'].filter(Boolean).join(' + ')}</td>
                <td className="py-2 pr-2 whitespace-pre-line">{d.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <P>{data.deliveryTimeline}</P>

        <H2>Package Summary &amp; Fees</H2>
        <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-3 gap-2 text-[11.5px] mb-3" style={{ breakInside: 'avoid' }}>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400">Total Package</p>
            <p className="font-black text-slate-950">${packageTotal.toLocaleString()} {data.taxNote}</p>
            <p className="text-slate-400 text-[10px] mt-1">{data.paymentMethodNote}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400">Reservation Deposit</p>
            <p className="font-black text-[#C5A059]">${depositAmount.toLocaleString()}</p>
            <p className="text-slate-400 text-[10px] mt-1">Non-refundable · Due at signing</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400">Remaining Balance</p>
            <p className="font-black text-slate-950">${balanceAmount.toLocaleString()}</p>
            <p className="text-slate-400 text-[10px] mt-1">Due before or on the last day of the event</p>
          </div>
        </div>

        <p className="text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1 mt-4">Deliverables</p>
        {data.deliverables.filter(Boolean).map((d, i) => (
          <p key={i} className="text-[11.5px] text-slate-600 leading-[1.7] mb-1 pl-4 relative"><span className="absolute left-0">-</span>{d}</p>
        ))}

        <p className="text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1 mt-4">Delivery</p>
        <P>Fee includes photo editing, digital processing of camera raw files &amp; footage, with final images and video provided in an online link.</P>
        <p className="text-[11.5px] text-slate-600 leading-[1.7] mb-1 pl-4 relative"><span className="absolute left-0">-</span>USB's / Additional USB's will be charged at ${data.rates.usbFee}.</p>
        <p className="text-[11.5px] text-slate-600 leading-[1.7] mb-1 pl-4 relative"><span className="absolute left-0">-</span>Additional hours of photography/video: ${data.rates.extraHourRate}/hr. The contracted rate will not be reduced if the client decides to use services for fewer hours on the day of the event.</p>
        <p className="text-[11.5px] text-slate-600 leading-[1.7] mb-1 pl-4 relative"><span className="absolute left-0">-</span>Online link will be removed after {data.rates.linkExpiryMonths} months. If the client requires a link after {data.rates.linkExpiryMonths} months, there will be an additional cost of ${data.rates.extraLinkFee} per upload link.</p>

        {CLAUSE_LIBRARY.map((clause) => {
          const state = data.clauses[clause.key] || { enabled: true, override: null };
          if (!state.enabled) return null;
          return (
            <div key={clause.key} style={{ breakInside: 'avoid' }}>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1 mt-4">{clause.title}</p>
              <ClauseBlocks clause={clause} ctx={ctx} state={state} />
            </div>
          );
        })}

        <H2>Agreement</H2>
        <P>This Contract incorporates the entire understanding of the parties. Any modifications of this Contract must be in writing and signed by both parties.</P>
        <P>To confirm your booking and acknowledge acceptance of this contract, please sign, date, and return with the retainer to {STUDIO.name}. It is recommended you print a copy for your records.</P>

        <div className="grid grid-cols-2 gap-8 mt-10 pt-6 border-t border-slate-100" style={{ breakInside: 'avoid' }}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-6">Client</p>
            <div className="border-b border-slate-300 mb-1 h-8"></div>
            <p className="text-[10px] text-slate-400">Signature</p>
            <div className="border-b border-slate-300 mb-1 h-8 mt-4"></div>
            <p className="text-[10px] text-slate-400">Date</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-6">{STUDIO.name}</p>
            <div className="border-b border-slate-300 mb-1 h-8"></div>
            <p className="text-[10px] text-slate-400">{STUDIO.photographerName} · {STUDIO.photographerTitle}</p>
            <div className="border-b border-slate-300 mb-1 h-8 mt-4"></div>
            <p className="text-[10px] text-slate-400">Date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
