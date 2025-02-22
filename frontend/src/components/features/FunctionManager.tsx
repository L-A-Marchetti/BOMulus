// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import Spinner from '../shared/Spinner';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';
import Button from '../shared/Button';
import { CompareViewStore } from '../../store/CompareViewStore';
import { FileManagerStore } from '../../store/FileManagerStore';
import { SettingsStore } from '../../store/SettingsStore';
import Input from '../shared/Input';

export function FunctionManager(): React.JSX.Element {
  const FunctionManager = FunctionManagerStore();
  const CompareView = CompareViewStore();
  const FileManager = FileManagerStore();
  const Settings = SettingsStore();

  return !FileManager.isVisible && !Settings.isVisible ? (
    <>
      <div
        className={`w-full flex flex-col gap-8 ${FunctionManager.isVisible ? 'mt-8' : ''}`}
      >
        <Button
          onClick={() => {
            CompareView.toggleVisibility();
            FunctionManager.toggleVisibility();
          }}
          text={FunctionManager.isVisible ? 'Back' : 'Function Manager'}
          bg="bg-neutral-700"
          bgHover="hover:bg-neutral-900"
          txtColor="text-neutral-400"
          h="h-20"
          img={null}
        />
        {FunctionManager.isVisible ? (
          FunctionManager.monitor.isLoading ? (
            <Spinner text="Function Manager is loading..." />
          ) : FunctionManager.monitor.error ? (
            <p>{FunctionManager.monitor.error}</p>
          ) : (
            <>
              <div className="flex items-start justify-center gap-8">
                <ul className="flex w-full gap-2 flex-col">
                  <input
                    type="text"
                    onChange={(e) =>
                      FunctionManager.setSearchQueries(
                        'not assigned',
                        e.target.value,
                      )
                    }
                    placeholder="Search Designators"
                    value={
                      FunctionManager.searchQueries.find(
                        (s) => s.name === 'not assigned',
                      )?.query || ''
                    }
                  />{' '}
                  {FunctionManager.designators
                    ?.filter((d) => {
                      const query =
                        FunctionManager.searchQueries.find(
                          (s) => s.name === 'not assigned',
                        )?.query || '';
                      return (
                        d.label.name === 'not assigned' &&
                        d.designator.toLowerCase().includes(query.toLowerCase())
                      );
                    })
                    .map((d) => (
                      <li>
                        <label
                          onClick={() =>
                            FunctionManager.toggleDesignatorSelection(d)
                          }
                          className={`inline-flex items-center justify-between w-full py-2 px-5 border-2 rounded-lg cursor-pointer hover:text-neutral-300 bg-neutral-800 hover:bg-neutral-700 ${FunctionManager.selectedDesignators.includes(d) ? 'border-blue-600 text-neutral-300' : 'border-neutral-700 text-neutral-400'}`}
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
                <ul className="flex w-full gap-2 flex-col">
                  <li>
                    <label className="inline-flex items-center justify-between w-full py-3 px-5 text-neutral-500 bg-white border-2 border-neutral-200 rounded-lg dark:border-neutral-700 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 dark:peer-checked:text-neutral-300 peer-checked:text-neutral-600 dark:text-neutral-400 dark:bg-neutral-800">
                      <div className="flex flex-col items-center justify-center gap-3 w-full">
                        <div className="flex items-center justify-center w-full gap-3">
                          <Input
                            h="h-10"
                            placeHolder="Function Name"
                            type="text"
                            value={FunctionManager.name}
                            onChange={FunctionManager.setName}
                          />
                          <input
                            type="color"
                            className={`w-full h-10 bg-[${FunctionManager.color}]`}
                            onChange={(e) =>
                              FunctionManager.setColor(e.target.value)
                            }
                          />
                        </div>
                        <Button
                          h="h-10"
                          img={null}
                          text="+"
                          bg="bg-neutral-700"
                          bgHover="hover:bg-neutral-900"
                          txtColor="text-white"
                          onClick={() => FunctionManager.createFunction()}
                        />
                      </div>
                    </label>
                  </li>
                  {FunctionManager.functions?.map((f) => (
                    <li>
                      <div
                        onClick={() => {
                          if (FunctionManager.selectedDesignators.length > 0) {
                            FunctionManager.assignToFunction(f.name);
                          } else {
                            FunctionManager.toggleFunctionExpand(f.name);
                          }
                        }}
                        className={`${FunctionManager.selectedDesignators.length > 0 ? 'animate-pulse' : ''} flex gap-3 flex-col items-center justify-between w-full py-2 px-5 text-neutral-500 bg-white border-2 border-neutral-200 rounded-lg cursor-pointer dark:hover:text-neutral-300 dark:border-neutral-700 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 hover:text-neutral-600 dark:peer-checked:text-neutral-300 peer-checked:text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700`}
                      >
                        <div className="flex items-center justify-center w-full">
                          <span
                            style={{ backgroundColor: f.color }}
                            className={`flex w-3 h-3 mr-3 rounded-full aspect-square`}
                          ></span>
                          <div className="w-full text-ws font-semibold">
                            {f.name}
                          </div>
                          <div className="w-full text-sm">
                            {
                              FunctionManager.designators?.filter((d) =>
                                d.label.name.includes(f.name),
                              ).length
                            }{' '}
                            / {FunctionManager.designators?.length} assigned
                          </div>
                        </div>
                        {FunctionManager.expandedFunctions.includes(f.name) &&
                        FunctionManager.selectedDesignators.length === 0 ? (
                          <div className="flex flex-col items-start justify-start w-full">
                            <input
                              className="w-full my-3"
                              type="search"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                FunctionManager.setSearchQueries(
                                  f.name,
                                  e.target.value,
                                );
                              }}
                              placeholder="Search Designators"
                              value={
                                FunctionManager.searchQueries.find(
                                  (s) => s.name === f.name,
                                )?.query || ''
                              }
                            />
                            {FunctionManager.designators
                              ?.filter(
                                (d) =>
                                  d.label.name.includes(f.name) &&
                                  (!FunctionManager.searchQueries.find(
                                    (s) => s.name === f.name,
                                  )?.query ||
                                    d.designator
                                      .toLowerCase()
                                      .includes(
                                        FunctionManager.searchQueries
                                          .find((s) => s.name === f.name)
                                          ?.query.toLowerCase() || '',
                                      )),
                              )
                              .map((d) => (
                                <li className="w-full">
                                  <label
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      FunctionManager.removeDesignator(d);
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
                                        {f.name === 'not assigned'
                                          ? ''
                                          : 'Remove'}
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
                </ul>
              </div>
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
