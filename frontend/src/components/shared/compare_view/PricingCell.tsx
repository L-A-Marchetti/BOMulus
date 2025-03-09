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
    <td className="px-6 py-2 flex flex-col items-center justify-center gap-2 text-center">
      <div className="w-full flex items-center whitespace-nowrap">
        {pricing.best_supplier != '' ? (
          <span
            style={{
              backgroundColor:
                pricing.best_supplier === 'Mouser' ? '#1C64F2' : '#16BDCA',
            }}
            className="w-2 h-2 mr-2 aspect-square"
          />
        ) : (
          <></>
        )}
        <div className="grow text-center">
          {pricing?.best_price
            ? pricing?.is_moq_not_reached
              ? `< ${pricing.moq} | $${parseFloat(pricing.best_price).toFixed(2)} | $${parseFloat(pricing.best_unit_price).toFixed(2)}/u`
              : `$${parseFloat(pricing.best_price).toFixed(2)} | $${parseFloat(pricing.best_unit_price).toFixed(2)}/u`
            : '-'}
        </div>
      </div>
      {isUpdate ? `${oldQuantity} -> ${newQuantity}` : quantity}
    </td>
  );
}
