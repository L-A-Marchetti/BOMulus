import { useEffect, useState } from 'react';
import { core } from '../../../../wailsjs/go/models';

type MSPricing = core.MSPricing;

type PricingCellProps = {
  pricing: MSPricing;
  isUpdate: boolean;
  oldQuantity: number;
  newQuantity: number;
  quantity: number;
};

export default function PricingCell({
  pricing,
  isUpdate,
  oldQuantity,
  newQuantity,
  quantity,
}: PricingCellProps) {
  return (
    <td
      className={`px-6 py-4 flex flex-col items-center justify-center gap-2`}
      style={{ textAlign: 'center' }}
    >
      <div style={{ whiteSpace: 'nowrap' }}>
        {pricing.best_price ? (
          <>
            {pricing.best_supplier?.charAt(0)}{' '}
            {pricing?.is_moq_not_reached
              ? `< ${pricing.moq} | $${parseFloat(pricing.best_price).toFixed(2)} | $${parseFloat(pricing.best_unit_price).toFixed(2)}/u`
              : `$${parseFloat(pricing.best_price).toFixed(2)} | $${parseFloat(pricing.best_unit_price).toFixed(2)}/u`}
          </>
        ) : (
          '-'
        )}
      </div>
      {isUpdate ? `${oldQuantity} -> ${newQuantity}` : quantity}
    </td>
  );
}
