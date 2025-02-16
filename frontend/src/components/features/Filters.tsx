// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';

export function Filters(): React.JSX.Element {
  const CompareView = CompareViewStore();

  return CompareView.isVisible ? (
    <>
      <div>
        <span
          style={{ backgroundColor: 'LightGreen' }}
          onClick={() => {
            CompareView.toggleOperatorVisibility('INSERT');
          }}
        >
          {CompareView.insert?.length}
        </span>{' '}
        <span
          style={{ backgroundColor: 'MediumPurple' }}
          onClick={() => {
            CompareView.toggleOperatorVisibility('UPDATE');
          }}
        >
          {CompareView.update?.length}
        </span>{' '}
        <span
          style={{ backgroundColor: 'LightCoral' }}
          onClick={() => {
            CompareView.toggleOperatorVisibility('DELETE');
          }}
        >
          {CompareView.delete?.length}
        </span>{' '}
        <span
          style={{ backgroundColor: 'LightGray' }}
          onClick={() => {
            CompareView.toggleOperatorVisibility('EQUAL');
          }}
        >
          {CompareView.equal?.length}
        </span>
        {' | '}
        <span onClick={() => CompareView.toggleWarningFilter('outOfStock')}>
          Out Of Stock {CompareView.warningOutOfStock.length}
        </span>
        {' | '}
        <span onClick={() => CompareView.toggleWarningFilter('lifeCycle')}>
          Lifecycle Status {CompareView.warningLifeCycle.length}
        </span>
        {' | '}
        <span onClick={() => CompareView.toggleWarningFilter('message')}>
          Manufacturer Messages {CompareView.warningMessage.length}
        </span>
        {' | '}
        <span onClick={() => CompareView.toggleWarningFilter('mismatchMpn')}>
          Mismatching Mpn {CompareView.warningMismatchMpn.length}
        </span>
        {' | '}
        <span onClick={() => CompareView.toggleWarningFilter('moq')}>
          Minimum Order of Quantity {CompareView.warningMoq.length}
        </span>
        {' | '}
        <input
          onChange={(e) => CompareView.setSearchQuery(e.target.value)}
          value={CompareView.searchQuery}
          placeholder="Search Query"
        />
        {' | '}
        <select
          onChange={(e) =>
            CompareViewStore.getState().setSortOrder(e.target.value)
          }
          value={CompareViewStore.getState().sortOrder}
        >
          <option value="default">Sort</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="price-unit-asc">Unit Price (Low to High)</option>
          <option value="price-unit-desc">Unit Price (High to Low)</option>
        </select>
      </div>
    </>
  ) : (
    <></>
  );
}
