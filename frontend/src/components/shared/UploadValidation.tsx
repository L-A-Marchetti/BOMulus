import { FileManagerStore } from '../../store/FileManagerStore';

export default function UploadValidation(): React.JSX.Element {
  const FileManager = FileManagerStore();
  if (
    !FileManager.filesToValidate ||
    FileManager.filesToValidate.length === 0
  ) {
    return <p>No files to validate.</p>;
  }
  const file = FileManager.filesToValidate[0];

  return (
    <div role="dialog" aria-modal="true" className="h-50">
      <p onClick={FileManager.cancelValidation}>Cancel</p>
      <p onClick={FileManager.confirmValidation}>Validate</p>
      <div>
        <span>Header Row: </span>
        <span
          onClick={() => {
            FileManager.validationControl('Header', '-');
          }}
        >
          −
        </span>
        <span> {file.filters.header} </span>
        <span
          onClick={() => {
            FileManager.validationControl('Header', '+');
          }}
        >
          +
        </span>
      </div>
      <table>
        <thead>
          <tr>
            {[
              'Quantity',
              'MPN',
              'Description',
              'Designator',
              'Manufacturer',
            ].map((column, index) => (
              <th key={index}>
                {column}
                <div>
                  <span
                    onClick={() => {
                      FileManager.validationControl(column, '-');
                    }}
                  >
                    −
                  </span>
                  <span
                    onClick={() => {
                      FileManager.validationControl(column, '+');
                    }}
                  >
                    +
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {file.content.slice(file.filters.header).map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row[file.filters.quantity] || 'N/A'}</td>
              <td>{row[file.filters.mpn] || 'N/A'}</td>
              <td>{row[file.filters.description] || 'N/A'}</td>
              <td>{row[file.filters.designator] || 'N/A'}</td>
              <td>{row[file.filters.manufacturer] || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
