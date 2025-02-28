import { useEffect, useState } from 'react';
import { core } from '../../../../wailsjs/go/models';
import { CompareViewStore } from '../../../store/CompareViewStore';
import WarningCell from './WarningCell';
import PricingCell from './PricingCell';
import { HighlightText } from '../../../utils/HightlightText';
import DesignatorsCell from './DesignatorsCell';

type Component = core.Component;

type ComponentRowProps = {
  component: Component;
  isUpdate: boolean;
  color: string;
};

export default function ComponentRow({
  component,
  isUpdate,
  color,
}: ComponentRowProps) {
  const [opacity, setOpacity] = useState(false);
  const CompareView = CompareViewStore();

  useEffect(() => {
    setOpacity(true);
  }, []);

  return (
    <tbody>
      <tr
        className={`hover:scale-99 transition ${opacity ? 'opacity-100' : 'opacity-0'} border-b-1 border-neutral-700`}
        onClick={() => {
          component.analyzed
            ? CompareView.toggleComponentDetails(component.id)
            : '';
        }}
      >
        <WarningCell
          hasWarning={CompareView.componentHasAWarning(component.id)}
          hasLifeCycleWarning={CompareView.warningLifeCycle.includes(
            component.id,
          )}
          hasMessageWarning={CompareView.warningMessage.includes(component.id)}
          hasMpnWarning={CompareView.warningMismatchMpn.includes(component.id)}
          hasMoqWarning={CompareView.warningMoq.includes(component.id)}
          hasOutOfStockWarning={CompareView.warningOutOfStock.includes(
            component.id,
          )}
          operatorColor={color}
        />
        <PricingCell
          pricing={component.calculated_price}
          isUpdate={isUpdate}
          oldQuantity={component.OldQuantity}
          newQuantity={component.NewQuantity}
          quantity={component.quantity}
        />
        <td className="px-6 py-4">{HighlightText(component.mpn)}</td>
        <DesignatorsCell designators={component.designators} />
        <td className="px-6 py-4">
          {HighlightText(component.user_description)}
        </td>
      </tr>
      {/*
      {CompareView.expandedComponents.includes(component.id) && (
        <>
          <Details
            component={component}
            onCancel={() =>
              CompareView.toggleComponentDetails(component.id)
            }
          />
        </>
      )}
        */}
    </tbody>
  );
}
