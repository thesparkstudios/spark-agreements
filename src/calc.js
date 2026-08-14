import { STUDIO } from './defaults';

export function computeTotals(data) {
  const packageTotal = Number(data.packageTotal) || 0;
  const depositPercent = Number(data.depositPercent) || 0;
  const hasOverride = data.depositOverrideAmount !== '' && data.depositOverrideAmount != null;
  const overrideAmount = hasOverride ? Number(data.depositOverrideAmount) : null;

  const depositAmount = overrideAmount != null && !Number.isNaN(overrideAmount)
    ? overrideAmount
    : Math.round(((packageTotal * depositPercent) / 100) * 100) / 100;

  const balanceAmount = Math.max(Math.round((packageTotal - depositAmount) * 100) / 100, 0);

  return { packageTotal, depositAmount, balanceAmount };
}

export function buildClauseContext(data) {
  const { packageTotal, depositAmount, balanceAmount } = computeTotals(data);
  return {
    studioName: STUDIO.name,
    photographerName: STUDIO.photographerName,
    rates: data.rates,
    packageTotal,
    depositAmount,
    balanceAmount,
    paymentMethodNote: data.paymentMethodNote,
  };
}
