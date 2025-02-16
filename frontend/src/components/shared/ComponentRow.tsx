import { core } from '../../../wailsjs/go/models';
import { CompareViewStore } from '../../store/CompareViewStore';
import ComponentDetails from './ComponentDetails';
import { HighlightText } from '../../utils/HightlightText';

type Component = core.Component;

type ComponentRowProps = {
  components: Component[] | undefined;
  isUpdate: boolean;
  color: string;
};

export default function ComponentRow({
  components,
  isUpdate,
  color,
}: ComponentRowProps) {
  const CompareView = CompareViewStore();

  return (
    <>
      {components?.map((component) => (
        <>
          <tr
            style={{
              backgroundColor: color,
              border: CompareView.componentHasAWarning(component.id)
                ? '5px solid yellow'
                : '',
            }}
            key={component.id}
          >
            <td
              style={{
                backgroundColor: CompareView.componentHasAWarning(component.id)
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
            <td style={{ textAlign: 'center' }}>
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
            <td>{HighlightText(component.mpn)}</td>
            <td>{HighlightText(component.designator)}</td>
            <td>{HighlightText(component.user_description)}</td>
            <td>
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
            <td>Bookmark</td>
          </tr>
          {CompareView.expandedComponents.includes(component.id) && (
            <ComponentDetails component={component} />
          )}
        </>
      ))}
    </>
  );
}
