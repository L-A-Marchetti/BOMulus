import React, { useEffect, useState } from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import ComponentRow from './compare_view/ComponentRow';
import { useShallow } from 'zustand/react/shallow';

export default function Table() {
  const [opacity, setOpacity] = useState(false);
  const {
    insert,
    insertIsVisible,
    update,
    updateIsVisible,
    del,
    deleteIsVisible,
    equal,
    equalIsVisible,
    filterComponents,
  } = CompareViewStore(
    useShallow((state) => ({
      insert: state.insert,
      insertIsVisible: state.insertIsVisible,
      update: state.update,
      updateIsVisible: state.updateIsVisible,
      del: state.del,
      deleteIsVisible: state.deleteIsVisible,
      equal: state.equal,
      equalIsVisible: state.equalIsVisible,
      filterComponents: state.filterComponents,
      searchQuery: state.searchQuery,
      selectedWarnings: state.selectedWarnings,
      sortOrder: state.sortOrder,
    })),
  );

  const categories = [
    {
      name: 'Insert',
      components: insert,
      filteredComponents: insert ? filterComponents(insert) : null,
      isVisible: insertIsVisible,
      color: 'bg-emerald-900',
      isUpdate: false,
    },
    {
      name: 'Update',
      components: update,
      filteredComponents: update ? filterComponents(update) : null,
      isVisible: updateIsVisible,
      color: 'bg-purple-900',
      isUpdate: true,
    },
    {
      name: 'Delete',
      components: del,
      filteredComponents: del ? filterComponents(del) : null,
      isVisible: deleteIsVisible,
      color: 'bg-rose-900',
      isUpdate: false,
    },
    {
      name: 'Equal',
      components: equal,
      filteredComponents: equal ? filterComponents(equal) : null,
      isVisible: equalIsVisible,
      color: 'bg-neutral-700',
      isUpdate: false,
    },
  ];

  useEffect(() => {
    console.log('Table');
    setOpacity(true);
  }, []);

  return (
    <div
      className={`transition relative overflow-x-auto sm:rounded-lg ${opacity ? 'opacity-100' : 'opacity-0'}`}
    >
      <table className="w-full text-xs text-left rtl:text-right text-white">
        {categories.map(
          ({ components, color, isUpdate, isVisible, filteredComponents }) => (
            <React.Fragment key={color}>
              {components?.map((component) => (
                <ComponentRow
                  key={component.id}
                  component={component}
                  isUpdate={isUpdate}
                  color={color}
                  isVisible={
                    (isVisible && filteredComponents?.includes(component)) ||
                    false
                  }
                />
              ))}
            </React.Fragment>
          ),
        )}
      </table>
    </div>
  );
}
