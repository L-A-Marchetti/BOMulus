import { useEffect, useState } from 'react';
import { core } from '../../../wailsjs/go/models';
import { CompareViewStore } from '../../store/CompareViewStore';
import { HighlightText } from '../../utils/HightlightText';
import ComponentDetails from './ComponentDetails';

type Component = core.Component;

type TableProps = {
  components: Component[] | undefined;
  isUpdate: boolean;
  color: string;
};

export default function Table({ components, isUpdate, color }: TableProps) {
  const [opacity, setOpacity] = useState(false);
  const CompareView = CompareViewStore();

  useEffect(() => {
    setOpacity(true);
  }, []);
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-xs text-left rtl:text-right text-white">
        {components?.map((component) => (
          <>
            <tr
              className={`border-b-0 ${color} border-neutral-700`}
              style={{
                border: CompareView.componentHasAWarning(component.id)
                  ? '5px solid yellow'
                  : '',
              }}
              key={component.id}
            >
              <td
                className="px-6 py-4"
                style={{
                  backgroundColor: CompareView.componentHasAWarning(
                    component.id,
                  )
                    ? 'yellow'
                    : '',
                }}
              >
                {CompareView.warningLifeCycle.includes(component.id) ? (
                  <>
                    Lifecycle
                    <br />
                  </>
                ) : (
                  ''
                )}
                {CompareView.warningMessage.includes(component.id) ? (
                  <>
                    Message
                    <br />
                  </>
                ) : (
                  ''
                )}
                {CompareView.warningMismatchMpn.includes(component.id) ? (
                  <>
                    Mismatching Mpn
                    <br />
                  </>
                ) : (
                  ''
                )}
                {CompareView.warningMoq.includes(component.id) ? (
                  <>
                    MOQ
                    <br />
                  </>
                ) : (
                  ''
                )}
                {CompareView.warningOutOfStock.includes(component.id) ? (
                  <>
                    Out Of Stock
                    <br />
                  </>
                ) : (
                  ''
                )}
              </td>
              <td className="px-6 py-4" style={{ textAlign: 'center' }}>
                <div style={{ whiteSpace: 'nowrap' }}>
                  {component.calculated_price.best_price ? (
                    <>
                      {component.calculated_price.best_supplier?.charAt(0)}{' '}
                      {component.calculated_price?.is_moq_not_reached
                        ? `< ${component.calculated_price.moq} | $${parseFloat(component.calculated_price.best_price).toFixed(2)} | $${parseFloat(component.calculated_price.best_unit_price).toFixed(2)}/u`
                        : `$${parseFloat(component.calculated_price.best_price).toFixed(2)} | $${parseFloat(component.calculated_price.best_unit_price).toFixed(2)}/u`}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
                {isUpdate
                  ? `${component.OldQuantity} -> ${component.NewQuantity}`
                  : component.quantity}
              </td>
              <td className="px-6 py-4">{HighlightText(component.mpn)}</td>
              <td className="px-6 py-4">
                {HighlightText(
                  component.designators
                    .map((designator) => designator.designator)
                    .join(', '),
                )}
              </td>
              <td className="px-6 py-4">
                {HighlightText(component.user_description)}
              </td>
              <td className="px-6 py-4">
                {component.analyzed && (
                  <button
                    onClick={() =>
                      CompareView.toggleComponentDetails(component.id)
                    }
                  >
                    {CompareView.expandedComponents.includes(component.id)
                      ? 'Close'
                      : 'Open'}
                  </button>
                )}
              </td>
              <td className="px-6 py-4">Bookmark</td>
            </tr>
            {CompareView.expandedComponents.includes(component.id) && (
              <ComponentDetails component={component} />
            )}
          </>
        ))}
      </table>
    </div>
  );
}
