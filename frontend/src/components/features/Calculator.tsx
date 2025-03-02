import React from 'react';
import { CalculatorStore } from '../../store/CalculatorStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import Radial, { RadialData } from '../shared/Radial';
import Donut from '../shared/Donut';
import Linear from '../shared/Linear';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';
import { useShallow } from 'zustand/react/shallow';

export function Calculator(): React.JSX.Element {
  const { productionQuantity, setProductionQuantity, calculationResult } =
    CalculatorStore(
      useShallow((state) => ({
        productionQuantity: state.productionQuantity,
        setProductionQuantity: state.setProductionQuantity,
        calculationResult: state.calculationResult,
      })),
    );

  const { isVisible, components } = CompareViewStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      components: state.components,
    })),
  );

  const { functions, designators } = FunctionManagerStore(
    useShallow((state) => ({
      functions: state.functions,
      designators: state.designators,
    })),
  );

  const totalComponents = components?.length || 0;
  const mouserCount = components?.filter(
    (component) =>
      component.analyzed &&
      !component.mismatch_mpn &&
      component.sources.some((source) => source === 'Mouser'),
  ).length;
  const digikeyCount = components?.filter(
    (component) =>
      component.analyzed &&
      !component.mismatch_mpn &&
      component.sources.some((source) => source === 'Digikey'),
  ).length;
  const unprocuredCount = components?.filter(
    (component) => component.analyzed && component.mismatch_mpn === true,
  ).length;
  const coverage =
    totalComponents > 0 && components
      ? (components?.filter(
          (component) => component.analyzed && component.mismatch_mpn === false,
        ).length /
          totalComponents) *
        100
      : 0;
  const inStockCount = components?.filter(
    (component) =>
      component.availability?.some((stock) => stock.value !== '') &&
      component.analyzed,
  ).length;
  const outOfStockCount = components?.filter(
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

  const series: ApexAxisChartSeries = [
    {
      name: 'Price',
      data: [
        calculationResult?.OldPrice || 0,
        calculationResult?.orderPrice || 0,
      ],
      color: '#1A56DB',
    },
    {
      name: 'Compliance',
      data: [643, 813],
      color: '#7E3BF2',
    },
  ];

  const functionsPrice: RadialData[] = functions
    ? functions.map((func) => {
        const totalBestUnitPrice = designators
          ?.filter((d) => d.label.name === func.name)
          .reduce((acc, d) => {
            const component = components?.find((comp) =>
              comp.designators.includes(d),
            );
            if (component && component.Operator !== 'DELETE') {
              return (
                acc +
                (parseFloat(component?.calculated_price?.best_unit_price) || 0)
              );
            }
            return acc;
          }, 0);

        return {
          value: totalBestUnitPrice
            ? parseFloat(totalBestUnitPrice.toFixed(2))
            : 0,
          label: func.name,
          color: func.color,
        };
      })
    : [];

  return (isVisible &&
    components?.filter((component) => component.analyzed).length) ||
    0 > 0 ? (
    <>
      <div className="px-8 flex items-center justify-center gap-8 flex-wrap">
        <Radial title="BOM Coverage" data={bomCoverage} />
        <Donut title="Availability" isPrice={false} data={availability} />
        <Donut title="Functions Pricing" isPrice={true} data={functionsPrice} />
        <Linear title="BOM Evolution" data={series} />
      </div>
      <div className="flex items-center justify-center mx-8 gap-8">
        <input
          className="text-2xl border-b-2 border-neutral-700 w-full outline-none"
          placeholder="Production Quantity"
          value={String(productionQuantity)}
          onChange={(e) =>
            setProductionQuantity(parseInt(e.target.value, 10), false)
          }
        />
        <div>
          <p className="text-xs">Price per Board</p>
          <p className="text-2xl">
            ${calculationResult?.unitPrice.toFixed(2) || 0}
          </p>
        </div>
        <div>
          <p className="text-xs">Order Price</p>
          <p className="text-2xl">
            ${calculationResult?.orderPrice.toFixed(2) || 0}
          </p>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
