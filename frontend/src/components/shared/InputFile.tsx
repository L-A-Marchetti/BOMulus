import { useEffect, useState } from 'react';
import ws_path from '/src/assets/images/ws_path.svg';

type InputFileProps = {
  placeHolder: string;
  value: string;
  onClick: () => void;
};

export default function InputFile({
  placeHolder,
  value,
  onClick,
}: InputFileProps) {
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true)
  }, []);
  return (
    <div className={`w-full mx-auto transition ${opacity ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex h-20">
        <span className="inline-flex items-center px-3 text-sm border border-e-0 rounded-s-md bg-neutral-600 text-neutral-400 border-neutral-600">
          <img src={ws_path} className="w-4 h-4 text-neutral-400" />
        </span>
        <input
          onClick={onClick}
          className="cursor-pointer rounded-none rounded-e-lg border block flex-1 min-w-0 w-full text-sm p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeHolder}
          value={value || ''}
          readOnly
        />
      </div>
    </div>
  );
}
