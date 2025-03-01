// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';

export function FunctionCreator(): React.JSX.Element {
  const { name, setName, color, setColor, createFunction } =
    FunctionManagerStore(
      useShallow((state) => ({
        name: state.name,
        setName: state.setName,
        color: state.color,
        setColor: state.setColor,
        createFunction: state.createFunction,
      })),
    );

  return (
    <li>
      <label className="inline-flex items-center justify-between w-full py-3 px-5 text-neutral-500 bg-white border-2 border-neutral-200 rounded-lg dark:border-neutral-700 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 dark:peer-checked:text-neutral-300 peer-checked:text-neutral-600 dark:text-neutral-400 dark:bg-neutral-800">
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <div className="flex items-center justify-center w-full gap-3">
            <Input
              h="h-10"
              placeHolder="Function Name"
              type="text"
              value={name}
              onChange={setName}
            />
            <input
              type="color"
              className={`w-full h-10 bg-[${color}]`}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <Button
            h="h-10"
            img={null}
            text="+"
            bg="bg-neutral-700"
            bgHover="hover:bg-neutral-900"
            txtColor="text-white"
            onClick={() => createFunction()}
          />
        </div>
      </label>
    </li>
  );
}
