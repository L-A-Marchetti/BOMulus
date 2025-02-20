// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import Button from '../shared/Button';
import moq from '/src/assets/images/moq.svg';
import lifecycle from '/src/assets/images/lifecycle.svg';
import manmessage from '/src/assets/images/manmessage.svg';
import outofstock from '/src/assets/images/outofstock.svg';
import mismatchingmpn from '/src/assets/images/mismatchingmpn.svg';
import Input from '../shared/Input';

export function Filters(): React.JSX.Element {
  const CompareView = CompareViewStore();

  return CompareView.isVisible && CompareView.components ? (
    <>
      <div className="flex flex-col items-center justify-center gap-8 px-8">
        <div className="flex items-center justify-center w-full gap-8">
          <div className="flex items-center justify-center w-full">
            <Button
              onClick={() => {
                CompareView.toggleOperatorVisibility('INSERT');
              }}
              text={String(CompareView.insert?.length)}
              bg={
                !CompareView.insertIsVisible
                  ? 'bg-neutral-900'
                  : 'bg-emerald-900'
              }
              bgHover="hover:bg-emerald-800"
              txtColor="text-white rounded-none rounded-l-lg"
              h="h-10"
              img={null}
            />
            <Button
              onClick={() => {
                CompareView.toggleOperatorVisibility('UPDATE');
              }}
              text={String(CompareView.update?.length)}
              bg={
                !CompareView.updateIsVisible
                  ? 'bg-neutral-900'
                  : 'bg-purple-900'
              }
              bgHover="hover:bg-purple-800"
              txtColor="text-white rounded-none"
              h="h-10"
              img={null}
            />
            <Button
              onClick={() => {
                CompareView.toggleOperatorVisibility('DELETE');
              }}
              text={String(CompareView.delete?.length)}
              bg={
                !CompareView.deleteIsVisible ? 'bg-neutral-900' : 'bg-rose-900'
              }
              bgHover="hover:bg-rose-800"
              txtColor="text-white rounded-none"
              h="h-10"
              img={null}
            />
            <Button
              onClick={() => {
                CompareView.toggleOperatorVisibility('EQUAL');
              }}
              text={String(CompareView.equal?.length)}
              bg={
                !CompareView.equalIsVisible
                  ? 'bg-neutral-900'
                  : 'bg-neutral-700'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none rounded-r-lg"
              h="h-10"
              img={null}
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <Button
              text={String(CompareView.warningOutOfStock.length)}
              onClick={() => CompareView.toggleWarningFilter('outOfStock')}
              bg={
                CompareView.selectedWarnings.includes('outOfStock')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none rounded-l-lg text-nowrap"
              h="h-10"
              img={outofstock}
            />
            <Button
              text={String(CompareView.warningLifeCycle.length)}
              onClick={() => CompareView.toggleWarningFilter('lifeCycle')}
              bg={
                CompareView.selectedWarnings.includes('lifeCycle')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none text-nowrap"
              h="h-10"
              img={lifecycle}
            />
            <Button
              text={String(CompareView.warningMessage.length)}
              onClick={() => CompareView.toggleWarningFilter('message')}
              bg={
                CompareView.selectedWarnings.includes('message')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none text-nowrap"
              h="h-10"
              img={manmessage}
            />
            <Button
              text={String(CompareView.warningMismatchMpn.length)}
              onClick={() => CompareView.toggleWarningFilter('mismatchMpn')}
              bg={
                CompareView.selectedWarnings.includes('mismatchMpn')
                  ? 'bg-neutral-900'
                  : 'bg-neutral-600'
              }
              bgHover="hover:bg-neutral-700"
              txtColor="text-white rounded-none text-nowrap"
              h="h-10"
              img={mismatchingmpn}
            />
            <Button
              text={String(CompareView.warningMoq.length)}
              onClick={() => CompareView.toggleWarningFilter('moq')}
              bg={
                CompareView.selectedWarnings.includes('moq')
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
            onChange={CompareView.setSearchQuery}
            value={CompareView.searchQuery}
            placeHolder="Search Query"
            type="search"
            h="h-10"
          />
          <select
            onChange={(e) =>
              CompareViewStore.getState().setSortOrder(e.target.value)
            }
            value={CompareViewStore.getState().sortOrder}
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
    </>
  ) : (
    <></>
  );
}
