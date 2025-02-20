import { useEffect, useState } from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import { HighlightText } from '../../utils/HightlightText';
import ComponentDetails from './ComponentDetails';
import moq from '/src/assets/images/moq.svg';
import lifecycle from '/src/assets/images/lifecycle.svg';
import manmessage from '/src/assets/images/manmessage.svg';
import outofstock from '/src/assets/images/outofstock.svg';
import mismatchingmpn from '/src/assets/images/mismatchingmpn.svg';

export default function Table() {
  const [opacity, setOpacity] = useState(false);
  const CompareView = CompareViewStore();

  const categories = [
    {
      name: 'Insert',
      components: CompareView.insert
        ? CompareView.filterComponents(CompareView.insert)
        : null,
      isVisible: CompareView.insertIsVisible,
      color: 'bg-emerald-900',
      isUpdate: false,
    },
    {
      name: 'Update',
      components: CompareView.update
        ? CompareView.filterComponents(CompareView.update)
        : null,
      isVisible: CompareView.updateIsVisible,
      color: 'bg-purple-900',
      isUpdate: true,
    },
    {
      name: 'Delete',
      components: CompareView.delete
        ? CompareView.filterComponents(CompareView.delete)
        : null,
      isVisible: CompareView.deleteIsVisible,
      color: 'bg-rose-900',
      isUpdate: false,
    },
    {
      name: 'Equal',
      components: CompareView.equal
        ? CompareView.filterComponents(CompareView.equal)
        : null,
      isVisible: CompareView.equalIsVisible,
      color: 'bg-neutral-700',
      isUpdate: false,
    },
  ];

  useEffect(() => {
    setOpacity(true);
  }, []);
  return (
    <div
      className={`transition relative overflow-x-auto shadow-md sm:rounded-lg ${opacity ? 'opacity-100' : 'opacity-0'}`}
    >
      <table className="w-full text-xs text-left rtl:text-right text-white">
        {categories
          .filter(({ isVisible }) => isVisible)
          .map(({ components, color, isUpdate }) =>
            components && components.length > 0 ? (
              components?.map((component) => (
                <>
                  <tr
                    className={`hover:scale-95 transition`}
                    key={component.id}
                  >
                    <td className={`px-6 py-4`}>
                      <div className="flex items-center justify-start gap-2">
                        {CompareView.componentHasAWarning(component.id) ? (
                          <div className={`w-2 h-10 bg-yellow-500`}></div>
                        ) : (
                          <></>
                        )}
                        <div className={`w-2 h-10 ${color}`}></div>
                        {CompareView.warningLifeCycle.includes(component.id) ? (
                          <>
                            <img src={lifecycle} />
                            <br />
                          </>
                        ) : (
                          ''
                        )}
                        {CompareView.warningMessage.includes(component.id) ? (
                          <>
                            <img src={manmessage} />
                            <br />
                          </>
                        ) : (
                          ''
                        )}
                        {CompareView.warningMismatchMpn.includes(
                          component.id,
                        ) ? (
                          <>
                            <img src={mismatchingmpn} />
                            <br />
                          </>
                        ) : (
                          ''
                        )}
                        {CompareView.warningMoq.includes(component.id) ? (
                          <>
                            <img src={moq} />
                            <br />
                          </>
                        ) : (
                          ''
                        )}
                        {CompareView.warningOutOfStock.includes(
                          component.id,
                        ) ? (
                          <>
                            <img src={outofstock} />
                            <br />
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ textAlign: 'center' }}>
                      <div style={{ whiteSpace: 'nowrap' }}>
                        {component.calculated_price.best_price ? (
                          <>
                            {component.calculated_price.best_supplier?.charAt(
                              0,
                            )}{' '}
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
                    <td className="px-6 py-4">
                      {HighlightText(component.mpn)}
                    </td>
                    <td className="px-6 py-4">
                      {/*HighlightText(component.designator)*/}
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
                  </tr>
                  {CompareView.expandedComponents.includes(component.id) && (
                    <ComponentDetails component={component} />
                  )}
                </>
              ))
            ) : (
              <></>
            ),
          )}
      </table>
    </div>
  );
}
