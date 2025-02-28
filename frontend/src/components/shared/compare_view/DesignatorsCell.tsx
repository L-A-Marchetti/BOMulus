import { useEffect, useState } from 'react';
import { core } from '../../../../wailsjs/go/models';
import { HighlightText } from '../../../utils/HightlightText';

type Designator = core.Designator;

type DesignatorsCellProps = {
  designators: Designator[];
};

export default function DesignatorsCell({ designators }: DesignatorsCellProps) {
  return (
    <td className={`px-6 py-4 text-[10px]`}>
      <div className="flex items-center justify-start flex-wrap gap-1">
        {designators.map((d) => (
          <div key={d.ID} className="flex items-center justify-start">
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
  );
}
