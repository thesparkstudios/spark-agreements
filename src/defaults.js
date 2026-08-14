// Default studio info, rates and package content — pulled from the
// standard Spark Studios contract so a new agreement starts fully
// populated and only client/event-specific fields need editing.

import { buildClauseState } from './clauseLibrary';

export const STUDIO = {
  name: 'The Spark Studios',
  photographerName: 'Waqar Ahmed',
  photographerTitle: 'Photographer/Videographer',
  logoUrl: '/logo.png',
};

export const DEFAULT_DEPOSIT_PERCENT = 30;

export const DEFAULT_RATES = {
  usbFee: 100,
  extraHourRate: 350,
  linkExpiryMonths: 3,
  extraLinkFee: 95,
  lateFeeDailyPercent: 2,
  revisionFeeHourly: 100,
  includedTravelLocations: 2,
  extraTravelFee: 120,
  dataRetentionMonths: 3,
  extraRetentionFeeMonthly: 40,
  socialMediaOptOutFee: 200,
};

export const DEFAULT_DELIVERABLES = [
  '1 Professional Lead Photographer (2 Cameras / More Coverage)',
  '1 Professional Lead Videographer (with Multiple camera angles)',
  'Highlight Film For Each Day',
  'Full-Length Edited Documentary For Each Day',
  'Unlimited Professionally Edited Photos',
  'Aerial Drone Cinematography',
  'Online Digital Gallery',
  'Complimentary Photoshoot (E-Shoot) Before The Event Date',
];

export const DEFAULT_DELIVERY_TIMELINE =
  'The edited material will be ready in about 3-5 months after the event, with early delivery prioritized.';

export const DEFAULT_PAYMENT_METHOD_NOTE = 'Cash or e-transfer';
export const DEFAULT_TAX_NOTE = '+ HST';

export const emptyEventDay = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  date: '',
  time: '',
  photo: true,
  video: true,
  venue: '',
});

export const buildDefaultAgreement = () => ({
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  eventDays: [emptyEventDay()],
  packageTotal: '',
  taxNote: DEFAULT_TAX_NOTE,
  paymentMethodNote: DEFAULT_PAYMENT_METHOD_NOTE,
  depositPercent: DEFAULT_DEPOSIT_PERCENT,
  depositOverrideAmount: '',
  deliverables: [...DEFAULT_DELIVERABLES],
  deliveryTimeline: DEFAULT_DELIVERY_TIMELINE,
  rates: { ...DEFAULT_RATES },
  clauses: buildClauseState(),
  status: 'draft',
});
