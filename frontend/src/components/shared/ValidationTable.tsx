import { useEffect, useState } from 'react';
import { FileManagerStore } from '../../store/FileManagerStore';
import Button from './Button';
import SpinButton from './SpinButton';

export default function ValidationTable() {
  const [opacity, setOpacity] = useState(false);
  const FileManager = FileManagerStore();
  if (
    !FileManager.filesToValidate ||
    FileManager.filesToValidate.length === 0
  ) {
    return <p>No files to validate.</p>;
  }
  const file = FileManager.filesToValidate[0];

  useEffect(() => {
    setOpacity(true);
  }, []);

  return (
    <div
      className={`w-full transition relative overflow-x-auto shadow-md sm:rounded-lg ${opacity ? 'opacity-100' : 'opacity-0'}`}
    >
      <table className="w-full text-sm text-left rtl:text-right text-neutral-500 dark:text-neutral-400">
        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-neutral-900 bg-white dark:text-white dark:bg-neutral-800">
          File Validation
          <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
            Adjust column mappings using +/- buttons beside each header. Review
            your data preview, then click "Validate" to confirm or "Cancel" to
            abort. Make sure headers and columns align correctly with your data.
          </p>
          <div className="mt-6 flex gap-8">
            <Button
              onClick={FileManager.cancelValidation}
              text="Cancel"
              bg="bg-neutral-700"
              bgHover="hover:bg-neutral-900"
              txtColor="text-neutral-400"
            />
            <Button
              onClick={FileManager.confirmValidation}
              text="Validate"
              bg="bg-emerald-700"
              bgHover="hover:bg-emerald-900"
              txtColor="text-white"
            />
          </div>
        </caption>
        <thead className="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400">
          <tr>
            <th scope="col" colSpan={5} className="px-6 py-3 text-center">
              <SpinButton
                label="Header"
                less={() => {
                  FileManager.validationControl('Header', '-');
                }}
                more={() => {
                  FileManager.validationControl('Header', '+');
                }}
              />
            </th>
          </tr>
          <tr>
            {[
              'Quantity',
              'MPN',
              'Description',
              'Designator',
              'Manufacturer',
            ].map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                <SpinButton
                  label={column}
                  less={() => {
                    FileManager.validationControl(column, '-');
                  }}
                  more={() => {
                    FileManager.validationControl(column, '+');
                  }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {file.content.slice(file.filters.header).map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-neutral-200"
            >
              <td className="px-6 py-4 text-xs">
                {row[file.filters.quantity] || 'N/A'}
              </td>
              <td className="px-6 py-4 text-xs">
                {row[file.filters.mpn] || 'N/A'}
              </td>
              <td className="px-6 py-4 text-xs">
                {row[file.filters.description] || 'N/A'}
              </td>
              <td className="px-6 py-4 text-xs">
                {row[file.filters.designator] || 'N/A'}
              </td>
              <td className="px-6 py-4 text-xs">
                {row[file.filters.manufacturer] || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
