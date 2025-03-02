import { useEffect, useState } from 'react';
import { core } from '../../../../wailsjs/go/models';
import { CompareViewStore } from '../../../store/CompareViewStore';
import WarningCell from './WarningCell';
import PricingCell from './PricingCell';
import { HighlightText } from '../../../utils/HightlightText';
import DesignatorsCell from './DesignatorsCell';
import Details from '../Details';
import { useShallow } from 'zustand/react/shallow';

type Component = core.Component;

type ComponentRowProps = {
  component: Component;
  isUpdate: boolean;
  color: string;
  isVisible: boolean;
};

export default function ComponentRow({
  component,
  isUpdate,
  color,
  isVisible,
}: ComponentRowProps) {
  const [opacity, setOpacity] = useState(false);
  const {
    componentHasAWarning,
    warningLifeCycle,
    warningMessage,
    warningMismatchMpn,
    warningMoq,
    warningOutOfStock,
    expandedComponents,
    toggleComponentDetails,
  } = CompareViewStore(
    useShallow((state) => ({
      componentHasAWarning: state.componentHasAWarning,
      warningLifeCycle: state.warningLifeCycle,
      warningMessage: state.warningMessage,
      warningMismatchMpn: state.warningMismatchMpn,
      warningMoq: state.warningMoq,
      warningOutOfStock: state.warningOutOfStock,
      expandedComponents: state.expandedComponents,
      toggleComponentDetails: state.toggleComponentDetails,
    })),
  );

  useEffect(() => {
    console.log('ComponentRow');
    setOpacity(true);
  }, []);

  return (
    <tbody className={isVisible ? '' : 'hidden'}>
      <tr
        className={`hover:scale-99 transition ${opacity ? 'opacity-100' : 'opacity-0'} border-b-1 border-neutral-700`}
        onClick={() => {
          component.analyzed ? toggleComponentDetails(component.id) : '';
        }}
      >
        <WarningCell
          hasWarning={componentHasAWarning(component.id)}
          hasLifeCycleWarning={warningLifeCycle.includes(component.id)}
          hasMessageWarning={warningMessage.includes(component.id)}
          hasMpnWarning={warningMismatchMpn.includes(component.id)}
          hasMoqWarning={warningMoq.includes(component.id)}
          hasOutOfStockWarning={warningOutOfStock.includes(component.id)}
          operatorColor={color}
        />
        <PricingCell
          pricing={component.calculated_price}
          isUpdate={isUpdate}
          oldQuantity={component.OldQuantity}
          newQuantity={component.NewQuantity}
          quantity={component.quantity}
        />
        <td className="px-6 py-2">{HighlightText(component.mpn)}</td>
        <DesignatorsCell designators={component.designators} />
        <td className="px-6 py-2">
          {HighlightText(component.user_description)}
        </td>
      </tr>
      {expandedComponents.includes(component.id) && (
        <>
          <Details
            component={component}
            onCancel={() => toggleComponentDetails(component.id)}
          />
        </>
      )}
    </tbody>
  );
}
