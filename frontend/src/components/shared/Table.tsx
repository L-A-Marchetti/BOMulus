import React, { useEffect, useState } from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import ComponentRow from './compare_view/ComponentRow';

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
      components: CompareView.del
        ? CompareView.filterComponents(CompareView.del)
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
                  <ComponentRow
                    key={component.id}
                    component={component}
                    isUpdate={isUpdate}
                    color={color}
                  />
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
