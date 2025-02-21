import React, { useEffect } from 'react';
import Spinner from '../shared/Spinner';
import { CalculatorStore } from '../../store/CalculatorStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import Radial from '../shared/Radial';

export function Calculator(): React.JSX.Element {
  const Calculator = CalculatorStore();
  const CompareView = CompareViewStore();

  return CompareView.isVisible ? (
    <>
      <div className="px-8">
        <Radial />
      </div>
      <div className="flex items-center justify-center mx-8 gap-8">
        <input
          className="text-2xl border-b-2 border-neutral-700 w-full outline-none"
          placeholder="Production Quantity"
          value={String(Calculator.productionQuantity)}
          onChange={(e) =>
            Calculator.setProductionQuantity(
              parseInt(e.target.value, 10),
              false,
            )
          }
        />
        <div>
          <p className="text-xs">Price per Board</p>
          <p className="text-2xl">
            ${Calculator.calculationResult?.unitPrice.toFixed(2) || 0}
          </p>
        </div>
        <div>
          <p className="text-xs">Order Price</p>
          <p className="text-2xl">
            ${Calculator.calculationResult?.orderPrice.toFixed(2) || 0}
          </p>
        </div>
        {Calculator.monitor.isLoading ? (
          <Spinner text="Calculator is loading..." />
        ) : Calculator.monitor.error ? (
          <p>{Calculator.monitor.error}</p>
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
