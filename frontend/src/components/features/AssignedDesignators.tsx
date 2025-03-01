// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';

export function AssignedDesignators(): React.JSX.Element {
  const {
    designators,
    selectedDesignators,
    searchQueries,
    setSearchQueries,
    functions,
    expandedFunctions,
    toggleFunctionExpand,
    assignToFunction,
    removeDesignator,
  } = FunctionManagerStore(
    useShallow((state) => ({
      designators: state.designators,
      selectedDesignators: state.selectedDesignators,
      searchQueries: state.searchQueries,
      setSearchQueries: state.setSearchQueries,
      functions: state.functions,
      expandedFunctions: state.expandedFunctions,
      toggleFunctionExpand: state.toggleFunctionExpand,
      assignToFunction: state.assignToFunction,
      removeDesignator: state.removeDesignator,
    })),
  );

  return (
    <>
      {functions?.map((f) => (
        <li>
          <div
            onClick={() => {
              if (selectedDesignators.length > 0) {
                assignToFunction(f.name);
              } else {
                toggleFunctionExpand(f.name);
              }
            }}
            className={`${selectedDesignators.length > 0 ? 'animate-pulse' : ''} flex gap-3 flex-col items-center justify-between w-full py-2 px-5 text-neutral-500 bg-white border-2 border-neutral-200 rounded-lg cursor-pointer dark:hover:text-neutral-300 dark:border-neutral-700 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 hover:text-neutral-600 dark:peer-checked:text-neutral-300 peer-checked:text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700`}
          >
            <div className="flex items-center justify-center w-full">
              <span
                style={{ backgroundColor: f.color }}
                className={`flex w-3 h-3 mr-3 rounded-full aspect-square`}
              ></span>
              <div className="w-full text-ws font-semibold">{f.name}</div>
              <div className="w-full text-sm">
                {
                  designators?.filter((d) => d.label.name.includes(f.name))
                    .length
                }{' '}
                / {designators?.length} assigned
              </div>
            </div>
            {expandedFunctions.includes(f.name) &&
            selectedDesignators.length === 0 ? (
              <div className="flex flex-col items-start justify-start w-full">
                <input
                  className="w-full my-3"
                  type="search"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    setSearchQueries(f.name, e.target.value);
                  }}
                  placeholder="Search Designators"
                  value={
                    searchQueries.find((s) => s.name === f.name)?.query || ''
                  }
                />
                {designators
                  ?.filter(
                    (d) =>
                      d.label.name.includes(f.name) &&
                      (!searchQueries.find((s) => s.name === f.name)?.query ||
                        d.designator
                          .toLowerCase()
                          .includes(
                            searchQueries
                              .find((s) => s.name === f.name)
                              ?.query.toLowerCase() || '',
                          )),
                  )
                  .map((d) => (
                    <li className="w-full">
                      <label
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDesignator(d);
                        }}
                        className="inline-flex items-center justify-between w-full py-2 px-5 text-neutral-500 bg-white border-2 border-neutral-200 rounded-lg cursor-pointer dark:hover:text-neutral-300 dark:border-neutral-700 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 hover:text-neutral-600 dark:peer-checked:text-neutral-300 peer-checked:text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      >
                        <div className="flex items-center justify-center w-full">
                          <span
                            style={{
                              backgroundColor: d.label.color,
                            }}
                            className={`flex w-3 h-3 mr-3 rounded-full aspect-square`}
                          ></span>
                          <div className="w-full text-ws font-semibold">
                            {d.designator}
                          </div>
                          <div className="w-full text-sm">
                            {f.name === 'not assigned' ? '' : 'Remove'}
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </li>
      ))}
    </>
  );
}
