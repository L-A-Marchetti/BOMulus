import { useEffect, useState } from 'react';

type ButtonImgProps = {
  img: string;
  value: string;
  onClick: () => void;
};

export default function ButtonImg({ img, value, onClick }: ButtonImgProps) {
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full h-full relative inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-neutral-700 rounded-lg hover:bg-neutral-800 focus:ring-4 focus:outline-none focus:ring-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800"
    >
      <img className="w-full h-15" src={img} />
      <div className="animate-bounce absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
        {value}
      </div>
    </button>
  );
}
