import React, { useEffect, useState } from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import { HighlightText } from '../../utils/HightlightText';
import ComponentDetails from './ComponentDetails';
import moq from '/src/assets/images/moq.svg';
import lifecycle from '/src/assets/images/lifecycle.svg';
import manmessage from '/src/assets/images/manmessage.svg';
import outofstock from '/src/assets/images/outofstock.svg';
import mismatchingmpn from '/src/assets/images/mismatchingmpn.svg';
import Details from './Details';

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
              <React.Fragment key={color}>
                {components?.map((component) => (
                  <tbody key={component.id}>
                    <tr
                      className={`hover:scale-99 transition border-b-1 border-neutral-700`}
                      onClick={() => {
                        component.analyzed
                          ? CompareView.toggleComponentDetails(component.id)
                          : '';
                      }}
                    >
                      <td className={`px-6 py-4`}>
                        <div className="flex items-center justify-start gap-2">
                          {CompareView.componentHasAWarning(component.id) ? (
                            <div className={`min-w-2 h-10 bg-yellow-500`}></div>
                          ) : (
                            <></>
                          )}
                          <div className={`min-w-2 h-10 ${color}`}></div>
                          {CompareView.warningLifeCycle.includes(
                            component.id,
                          ) ? (
                            <img
                              className="w-5 aspect-square"
                              src={lifecycle}
                            />
                          ) : (
                            ''
                          )}
                          {CompareView.warningMessage.includes(component.id) ? (
                            <img
                              className="w-5 aspect-square"
                              src={manmessage}
                            />
                          ) : (
                            ''
                          )}
                          {CompareView.warningMismatchMpn.includes(
                            component.id,
                          ) ? (
                            <img
                              className="w-5 aspect-square"
                              src={mismatchingmpn}
                            />
                          ) : (
                            ''
                          )}
                          {CompareView.warningMoq.includes(component.id) ? (
                            <img className="w-5 aspect-square" src={moq} />
                          ) : (
                            ''
                          )}
                          {CompareView.warningOutOfStock.includes(
                            component.id,
                          ) ? (
                            <img
                              className="w-5 aspect-square"
                              src={outofstock}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 flex flex-col items-center justify-center gap-2"
                        style={{ textAlign: 'center' }}
                      >
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
                      <td className="px-6 py-4 text-[10px]">
                        <div className="flex items-center justify-start flex-wrap gap-1">
                          {component.designators.map((d, index) => (
                            <div
                              key={d.ID}
                              className="flex items-center justify-start"
                            >
                              {d.label.name !== 'not assigned' ? (
                                <span
                                  style={{ backgroundColor: d.label.color }}
                                  className="flex w-2 h-2 mr-1 rounded-full aspect-square"
                                />
                              ) : (
                                <></>
                              )}
                              {HighlightText(d.designator)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {HighlightText(component.user_description)}
                      </td>
                    </tr>
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
                  </tbody>
                ))}
              </React.Fragment>
            ) : (
              <React.Fragment key={color}></React.Fragment>
            ),
          )}
      </table>
    </div>
  );
}
