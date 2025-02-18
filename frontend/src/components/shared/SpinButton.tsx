import { useEffect, useState } from 'react';

type SpinButtonProps = {
  label: string;
  more: () => void;
  less: () => void;
};

export default function SpinButton({ label, more, less }: SpinButtonProps) {
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);
  return (
    <div className="w-full flex flex-col rounded-md shadow-xs" role="group">
      <button
        onClick={less}
        type="button"
        className="px-4 py-2 text-xs font-medium text-neutral-900 bg-white border border-neutral-200 rounded-t-lg hover:bg-neutral-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:text-white dark:hover:bg-neutral-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        -
      </button>
      <button
        type="button"
        className="w-full px-4 py-2 text-xs font-medium text-neutral-900 bg-white border border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
      >
        {label}
      </button>
      <button
        onClick={more}
        type="button"
        className="px-4 py-2 text-xs font-medium text-neutral-900 bg-white border border-neutral-200 rounded-b-lg hover:bg-neutral-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:text-white dark:hover:bg-neutral-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        +
      </button>
    </div>
  );
}
