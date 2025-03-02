import { useEffect, useState } from 'react';
import moq from '/src/assets/images/moq.svg';
import lifecycle from '/src/assets/images/lifecycle.svg';
import manmessage from '/src/assets/images/manmessage.svg';
import outofstock from '/src/assets/images/outofstock.svg';
import mismatchingmpn from '/src/assets/images/mismatchingmpn.svg';

type WarningCellProps = {
  hasWarning: boolean;
  hasLifeCycleWarning: boolean;
  hasMessageWarning: boolean;
  hasMpnWarning: boolean;
  hasMoqWarning: boolean;
  hasOutOfStockWarning: boolean;
  operatorColor: string;
};

export default function WarningCell({
  hasWarning,
  hasLifeCycleWarning,
  hasMessageWarning,
  hasMpnWarning,
  hasMoqWarning,
  hasOutOfStockWarning,
  operatorColor,
}: WarningCellProps) {
  return (
    <td className={`px-6 py-2`}>
      <div className="flex items-center justify-start gap-2">
        {hasWarning ? (
          <div className={`min-w-2 h-10 bg-yellow-500`}></div>
        ) : (
          <></>
        )}
        <div className={`min-w-2 h-10 ${operatorColor}`}></div>
        {hasLifeCycleWarning ? (
          <img className="w-5 aspect-square" src={lifecycle} />
        ) : (
          ''
        )}
        {hasMessageWarning ? (
          <img className="w-5 aspect-square" src={manmessage} />
        ) : (
          ''
        )}
        {hasMpnWarning ? (
          <img className="w-5 aspect-square" src={mismatchingmpn} />
        ) : (
          ''
        )}
        {hasMoqWarning ? <img className="w-5 aspect-square" src={moq} /> : ''}
        {hasOutOfStockWarning ? (
          <img className="w-5 aspect-square" src={outofstock} />
        ) : (
          ''
        )}
      </div>
    </td>
  );
}
