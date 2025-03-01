// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import Button from '../shared/Button';
import moq from '/src/assets/images/moq.svg';
import lifecycle from '/src/assets/images/lifecycle.svg';
import manmessage from '/src/assets/images/manmessage.svg';
import outofstock from '/src/assets/images/outofstock.svg';
import mismatchingmpn from '/src/assets/images/mismatchingmpn.svg';
import Input from '../shared/Input';
import { useShallow } from 'zustand/react/shallow';

export function Filters(): React.JSX.Element {
  const {
    isVisible,
    components,
    insert,
    insertIsVisible,
    update,
    updateIsVisible,
    del,
    deleteIsVisible,
    equal,
    equalIsVisible,
    warningOutOfStock,
    warningLifeCycle,
    warningMessage,
    warningMismatchMpn,
    warningMoq,
    selectedWarnings,
    searchQuery,
    toggleOperatorVisibility,
    toggleWarningFilter,
    setSearchQuery,
    setSortOrder,
    sortOrder,
  } = CompareViewStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      components: state.components,
      insert: state.insert,
      insertIsVisible: state.insertIsVisible,
      update: state.update,
      updateIsVisible: state.updateIsVisible,
      del: state.del,
      deleteIsVisible: state.deleteIsVisible,
      equal: state.equal,
      equalIsVisible: state.equalIsVisible,
      warningOutOfStock: state.warningOutOfStock,
      warningLifeCycle: state.warningLifeCycle,
      warningMessage: state.warningMessage,
      warningMismatchMpn: state.warningMismatchMpn,
      warningMoq: state.warningMoq,
      selectedWarnings: state.selectedWarnings,
      searchQuery: state.searchQuery,
      toggleOperatorVisibility: state.toggleOperatorVisibility,
      toggleWarningFilter: state.toggleWarningFilter,
      setSearchQuery: state.setSearchQuery,
      setSortOrder: state.setSortOrder,
      sortOrder: state.sortOrder,
    })),
  );

  useEffect(() => {
    console.log('Filters');
  }, []);

  return (
    <div className={isVisible && components ? '' : 'hidden'}>
      <div className="flex flex-col items-center justify-center gap-8 px-8">
        <div className="flex items-center justify-center w-full gap-8">
          <div className="flex items-center justify-center w-full">
            <Button
              onClick={() => {
                toggleOperatorVisibility('INSERT');
              }}
              text={String(insert?.length)}
              bg={!insertIsVisible ? 'bg-neutral-900' : 'bg-emerald-900'}
              bgHover="hover:bg-emerald-800"
              txtColor="text-white rounded-none rounded-l-lg"
              h="h-10"
              img={null}
            />
            <Button
              onClick={() => {
                toggleOperatorVisibility('UPDATE');
              }}
              text={String(update?.length)}
              bg={!updateIsVisible ? 'bg-neutral-900' : 'bg-purple-900'}
              bgHover="hover:bg-purple-800"
              txtColor="text-white rounded-none"
              h="h-10"
              img={null}
            />
            <Button
              onClick={() => {
                toggleOperatorVisibility('DELETE');
              }}
              text={String(del?.length)}
              bg={!deleteIsVisible ? 'bg-neutral-900' : 'bg-rose-900'}
              bgHover="hover:bg-rose-800"
              txtColor="text-white rounded-none"
              h="h-10"
              img={null}
            />
            <Button
              onClick={() => {
                toggleOperatorVisibility('EQUAL');
              }}
              text={String(equal?.length)}
              bg={!equalIsVisible ? 'bg-neutral-900' : 'bg-neutral-700'}
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none rounded-r-lg"
              h="h-10"
              img={null}
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <Button
              text={String(warningOutOfStock.length)}
              onClick={() => toggleWarningFilter('outOfStock')}
              bg={
                selectedWarnings.includes('outOfStock')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none rounded-l-lg text-nowrap"
              h="h-10"
              img={outofstock}
            />
            <Button
              text={String(warningLifeCycle.length)}
              onClick={() => toggleWarningFilter('lifeCycle')}
              bg={
                selectedWarnings.includes('lifeCycle')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none text-nowrap"
              h="h-10"
              img={lifecycle}
            />
            <Button
              text={String(warningMessage.length)}
              onClick={() => toggleWarningFilter('message')}
              bg={
                selectedWarnings.includes('message')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none text-nowrap"
              h="h-10"
              img={manmessage}
            />
            <Button
              text={String(warningMismatchMpn.length)}
              onClick={() => toggleWarningFilter('mismatchMpn')}
              bg={
                selectedWarnings.includes('mismatchMpn')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none text-nowrap"
              h="h-10"
              img={mismatchingmpn}
            />
            <Button
              text={String(warningMoq.length)}
              onClick={() => toggleWarningFilter('moq')}
              bg={
                selectedWarnings.includes('moq')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none rounded-r-lg text-nowrap"
              h="h-10"
              img={moq}
            />
          </div>

          <Input
            onChange={setSearchQuery}
            value={searchQuery}
            placeHolder="Search Query"
            type="search"
            h="h-10"
          />
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="appearance-none h-10 bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="default">Sort</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="price-unit-asc">Unit Price (Low to High)</option>
            <option value="price-unit-desc">Unit Price (High to Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
