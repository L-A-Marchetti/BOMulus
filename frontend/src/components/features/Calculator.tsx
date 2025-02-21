import React, { useEffect } from 'react';
import Spinner from '../shared/Spinner';
import { CalculatorStore } from '../../store/CalculatorStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import Radial, { RadialData } from '../shared/Radial';

export function Calculator(): React.JSX.Element {
  const Calculator = CalculatorStore();
  const CompareView = CompareViewStore();
  const totalComponents = CompareView.components?.length || 0;
  const mouserCount = CompareView.components?.filter(
    (component) =>
      component.analyzed &&
      !component.mismatch_mpn &&
      component.sources.some((source) => source === 'Mouser'),
  ).length;
  const digikeyCount = CompareView.components?.filter(
    (component) =>
      component.analyzed &&
      !component.mismatch_mpn &&
      component.sources.some((source) => source === 'Digikey'),
  ).length;
  const unprocuredCount = CompareView.components?.filter(
    (component) => component.analyzed && component.mismatch_mpn === true,
  ).length;
  const coverage =
    totalComponents > 0 && CompareView.components
      ? (CompareView.components?.filter(
          (component) => component.analyzed && component.mismatch_mpn === false,
        ).length /
          totalComponents) *
        100
      : 0;

  const bomCoverage: RadialData[] = [
    {
      value: mouserCount
        ? Math.round((mouserCount / totalComponents) * 100)
        : 0,
      label: 'Mouser',
      color: '#1C64F2',
    },
    {
      value: digikeyCount
        ? Math.round((digikeyCount / totalComponents) * 100)
        : 0,
      label: 'Digikey',
      color: '#16BDCA',
    },
    {
      value: unprocuredCount
        ? Math.round((unprocuredCount / totalComponents) * 100)
        : 0,
      label: 'Unprocured',
      color: '#FDBA8C',
    },
  ];

  return CompareView.isVisible ? (
    <>
      <div className="px-8">
        <Radial title="BOM Coverage" data={bomCoverage} />
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
