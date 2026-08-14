// Standard contract clauses, extracted verbatim from The Spark Studios'
// existing agreements and parameterized against an agreement's rates/
// computed values. Each clause can be toggled on/off per agreement, and
// its rendered text can be edited inline before the final document is
// generated.
//
// A clause's `render(ctx)` returns an array of blocks:
//   a plain string  -> paragraph
//   { li: string }  -> bullet item

const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const possessive = (name) => `${name}${name.endsWith('s') ? "'" : "'s"}`;

export const CLAUSE_LIBRARY = [
  {
    key: 'rawMaterial',
    title: 'Raw Material',
    defaultEnabled: true,
    render: (ctx) => [
      `${ctx.studioName} does not and will not provide RAW pictures or video; however, no moments will be cut or missed. An exception for RAW photos can be made upon request via e-mail or WhatsApp.`,
    ],
  },
  {
    key: 'changes',
    title: 'Changes',
    defaultEnabled: true,
    render: (ctx) => [
      { li: '15 days of the delivery of images and videos for any changes. Please note these changes can also take additional time (2 to 3 months).' },
      { li: `${ctx.studioName} will use its best efforts to ensure all photographs and videos meet professional standards of quality and artistry.` },
      { li: `Photography: the first batch of minor changes is at no cost; after that, each change will be charged at ${money(ctx.rates.revisionFeeHourly)}/hr.` },
      { li: `Video: the first draft will be provided for approval. The first revision with minor changes is free of charge. Any changes after will be charged at ${money(ctx.rates.revisionFeeHourly)}/hr.` },
      { li: `If ${ctx.studioName} missed a requested change without reason, or made a mistake in the edit, it will be corrected without any questions asked and without any fee.` },
    ],
  },
  {
    key: 'majorChanges',
    title: 'Photography & Video — Major Changes',
    defaultEnabled: true,
    render: (ctx) => [
      `Requests for adjustments such as correcting makeup issues, fixing eyelashes, modifying hair, altering facial features, changing body shapes, or requesting time-intensive changes will be considered major changes. These types of adjustments are typically due to factors beyond ${possessive(ctx.studioName)} control (e.g. makeup artist or other external sources). Major changes may incur additional fees.`,
    ],
  },
  {
    key: 'minorChanges',
    title: 'Photography & Video — Minor Changes',
    defaultEnabled: true,
    render: () => [
      'Minor changes include adjustments such as color correction, exposure balancing, slight skin smoothing, basic blemish removal, and small lighting corrections. These edits are designed to enhance the overall quality and consistency of images without fundamentally altering any major aspects of appearance or style.',
    ],
  },
  {
    key: 'reservationPayment',
    title: 'Reservation & Payment',
    defaultEnabled: true,
    render: (ctx) => [
      `Upon your signature, ${ctx.studioName} will reserve the time and date agreed upon and will not make other reservations for that time and date. For this reason, the Reservation Deposit of ${money(ctx.depositAmount)} is non-refundable, even if the date is changed or the event canceled for any reason, including Acts of God, fire, strike and/or extreme weather. The Reservation Deposit is applied towards the contracted event photography/video package totaling ${money(ctx.packageTotal)}. Remaining amount of ${money(ctx.balanceAmount)} is to be paid before the event or on the last day of the event in ${(ctx.paymentMethodNote || 'cash or via e-transfer').toLowerCase()}.`,
    ],
  },
  {
    key: 'latePayment',
    title: 'Late Payment Fee',
    defaultEnabled: true,
    render: (ctx) => [
      `Any outstanding balance not paid by the agreed-upon due date will incur a late payment fee of ${ctx.rates.lateFeeDailyPercent} percent (${ctx.rates.lateFeeDailyPercent}%) per day on the overdue amount, compounded daily, until the full balance is paid. Delays in final payment will also result in delayed delivery of all Edited Material.`,
    ],
  },
  {
    key: 'punctuality',
    title: 'Client Punctuality & Service Commencement',
    defaultEnabled: true,
    render: (ctx) => [
      "The Service Provider's contracted service time will commence precisely at the scheduled start time as outlined in the Event agenda provided by the Client(s), regardless of the Client(s)' or Event participants' readiness or punctuality. The photo and video crew's billable time begins upon their arrival at the first designated location as per the agreed-upon schedule. No adjustments or extensions to the contracted service hours will be made for delays caused by the Client(s) or Event participants.",
      'The client(s) will be responsible for designating an Event Guide, if desired. The role of the Event Guide is to identify people/objects for specific photographs, as well as ensure that these subjects are available when needed. It is recommended that the client(s) develop a list of desired poses, locations, and subjects (family and friends; items; etc.) and share this with the photographer/videographer well before the event. The photographer/videographer will NOT be held accountable for not capturing desired photographs if there is no one to assist in identifying or gathering people/items/locations. The parties agree to positive cooperation and communication for the best possible result.',
      `${ctx.studioName} is not responsible for key individuals failure to be present or to cooperate during photography/video sessions, nor for missed images due to details not revealed to ${ctx.studioName}.`,
    ],
  },
  {
    key: 'vendorBreaks',
    title: 'Vendors Table and Breaks',
    defaultEnabled: true,
    render: () => [
      'If the event is at a hall, the client will provide an appropriate vendor table and chairs for the crew.',
      'Our photographers and videographers will require a food break at the time of dinner for 30 minutes or after every 4 hours of work. The client will consider this and will allow 15–30 minutes for the break. Either the client can offer food to the crew or let us arrange our own food.',
    ],
  },
  {
    key: 'travel',
    title: 'Travel to Multiple Locations',
    defaultEnabled: true,
    render: (ctx) => [
      'Travel time during the event to shoot destinations will be considered within the booking time slot.',
      `Travel to a maximum of ${ctx.rates.includedTravelLocations} (${ctx.rates.includedTravelLocations}) distinct locations on the event day is included in the agreed-upon service package. Any additional travel beyond these included locations will be charged at a rate of ${money(ctx.rates.extraTravelFee)} CAD per additional location. This charge covers the additional time, fuel, and logistical coordination required for each extra venue.`,
    ],
  },
  {
    key: 'ownership',
    title: 'Ownership Rights',
    defaultEnabled: true,
    render: (ctx) => [
      `It is understood that ${ctx.studioName} will act as the sole and exclusive event photographer/videographer for the client.`,
      `Client(s) acknowledge that all work created under this agreement is the intellectual property of the photographer/videographer, who shall retain the copyright to the photographs/video. Client(s) will have unlimited personal use of the photographs/video at any time for no additional fee. Client(s) give permission for the photographer/videographer to use the work for publication, display, advertising, promotion and other uses. If the client doesn't want ${ctx.studioName} and its associate companies to use this work on their social media handles, it must be discussed (a ${money(ctx.rates.socialMediaOptOutFee)} penalty fee may also apply depending on the outcome of the situation). Agreement has been reached, ${ctx.studioName} will waive the fee and will be allowed to use BTS footage from the event.`,
    ],
  },
  {
    key: 'dataBackups',
    title: 'Data Back-ups',
    defaultEnabled: true,
    render: (ctx) => [
      `${ctx.studioName} is not responsible for long-term data preservation.`,
      `We will keep your RAW photos and videos for up to ${ctx.rates.dataRetentionMonths} months after delivery (via online link or USB). After that, RAW data will be deleted and only edited content will be kept.`,
      `Client(s) are responsible for making copies of the edited material on their end. Edited data will be available for download for ${ctx.rates.dataRetentionMonths} months after delivery; if the client requires edited material beyond this timeline, there will be an additional fee on a one-time or month-to-month basis.`,
      `If the client wants us to keep the RAW or edited data available for a longer period, it will be an additional cost of ${money(ctx.rates.extraRetentionFeeMonthly)}/month.`,
    ],
  },
  {
    key: 'refunds',
    title: 'Refunds',
    defaultEnabled: true,
    render: (ctx) => [
      `While the photographer/videographer takes the utmost care with respect to exposure, processing and delivery of photographs/video, in the event that images become lost, stolen or destroyed for reasons within or beyond the control of the photographer/videographer, liability is limited to a refund of retainer and payment received. The limit of liability shall not exceed the contract price stated herein. ${ctx.studioName} will not be held responsible for any ruined photographs due to guests' (or any other) flashes, or any other cause in or outside of ${possessive(ctx.studioName)} control.`,
      `In the event that "${ctx.photographerName}" or the designated lead photographer and videographer is unable to photograph/video the event due to: illness, emergency, accident, or Act of God, every effort will be made to find a suitable replacement. If a replacement is unavailable, the payment(s) made to ${ctx.studioName} will be refunded in full, and return of the payment(s) shall be the entire obligation under this contract. No other damages or guarantees of any kind are recognized or warranted.`,
    ],
  },
  {
    key: 'rescheduling',
    title: 'Rescheduling or Cancellations',
    defaultEnabled: true,
    render: (ctx) => [
      `In the event that the client(s) reschedule the event (within 1 year) and ${ctx.studioName} is able to re-book the original event/event date, ${ctx.studioName} will amend the event date in this contract. In the event that the client(s) reschedule and ${ctx.studioName} is NOT able to re-book the original event/event date, ${ctx.studioName} will amend the event date in this contract and client(s) will forfeit the Reservation Deposit. Client should note that the Reservation Deposit will not then be available to apply toward their final installment. In the event that the client(s) cancel the Event outright, Client will forfeit all monies paid up to the date. Cancellation must be in writing (print or email) even if a phone call was made to inform ${ctx.studioName} of the cancellation.`,
      `In the event that the Client postpones the event to an indefinite date, ${ctx.studioName} will retain the deposit for up to one (1) year. If the event remains unscheduled after the first year, the deposit will be adjusted to 80% of the original booking amount for the second year. Beyond the second year, the Client will forfeit the deposit, and it will no longer be applicable to any future date changes.`,
    ],
  },
];

export const buildClauseState = () =>
  Object.fromEntries(
    CLAUSE_LIBRARY.map((c) => [c.key, { enabled: c.defaultEnabled, override: null }])
  );
