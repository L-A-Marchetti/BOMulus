// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';

export function UnassignedDesignators(): React.JSX.Element {
  const {
    designators,
    selectedDesignators,
    toggleDesignatorSelection,
    searchQueries,
    setSearchQueries,
  } = FunctionManagerStore(
    useShallow((state) => ({
      designators: state.designators,
      selectedDesignators: state.selectedDesignators,
      toggleDesignatorSelection: state.toggleDesignatorSelection,
      searchQueries: state.searchQueries,
      setSearchQueries: state.setSearchQueries,
    })),
  );

  return (
    <ul className="flex w-full gap-2 flex-col">
      <input
        type="search"
        onChange={(e) => setSearchQueries('not assigned', e.target.value)}
        placeholder="Search Designators"
        value={
          searchQueries.find((s) => s.name === 'not assigned')?.query || ''
        }
      />{' '}
      {designators
        ?.filter((d) => {
          const query =
            searchQueries.find((s) => s.name === 'not assigned')?.query || '';
          return (
            d.label.name === 'not assigned' &&
            d.designator.toLowerCase().includes(query.toLowerCase())
          );
        })
        .map((d) => (
          <li key={d.ID}>
            <label
              onClick={() => toggleDesignatorSelection(d)}
              className={`inline-flex items-center justify-between w-full py-2 px-5 border-2 rounded-lg cursor-pointer hover:text-neutral-300 bg-neutral-800 hover:bg-neutral-700 ${selectedDesignators.includes(d) ? 'border-blue-600 text-neutral-300' : 'border-neutral-700 text-neutral-400'}`}
            >
              <div className="flex items-center justify-center w-full">
                <span
                  style={{ backgroundColor: d.label.color }}
                  className={`flex w-3 h-3 mr-3 rounded-full aspect-square`}
                ></span>
                <div className="w-full text-ws font-semibold">
                  {d.designator}
                </div>
                <div className="w-full text-sm">{d.label.name}</div>
              </div>
            </label>
          </li>
        ))}
    </ul>
  );
}
