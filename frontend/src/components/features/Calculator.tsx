import React, { useEffect } from 'react';
import Spinner from '../shared/Spinner';
import { CalculatorStore } from '../../store/CalculatorStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import Radial, { RadialData } from '../shared/Radial';
import Donut from '../shared/Donut';
import Linear from '../shared/Linear';

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
  const inStockCount = CompareView.components?.filter(
    (component) =>
      component.availability?.some((stock) => stock.value !== '') &&
      component.analyzed,
  ).length;
  const outOfStockCount = CompareView.components?.filter(
    (component) =>
      component.availability?.every((stock) => stock.value === '') &&
      component.analyzed,
  ).length;

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

  const availability: RadialData[] = [
    {
      value: inStockCount || 0,
      label: 'In Stock',
      color: '#16BDCA',
    },
    {
      value: outOfStockCount || 0,
      label: 'Out of Stock',
      color: '#E74694',
    },
  ];

  const functionsPrice: RadialData[] = [
    {
      value: 150,
      label: 'Not Assaigned',
      color: '#1C64F2',
    },
    {
      value: 340,
      label: 'Audio',
      color: '#16BDCA',
    },
    {
      value: 214,
      label: 'Alimentation',
      color: '#FDBA8C',
    },
    {
      value: 64,
      label: 'HF',
      color: '#E74694',
    },
  ];

  return CompareView.isVisible && CompareView.components ? (
    <>
      <div className="px-8 flex items-center justify-center gap-8 flex-wrap">
        <Radial title="BOM Coverage" data={bomCoverage} />
        <Donut title="Availability" isPrice={false} data={availability} />
        <Donut title="Functions Pricing" isPrice={true} data={functionsPrice} />
        <Linear title="BOM Evolution" isPrice={false} data={bomCoverage} />
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
