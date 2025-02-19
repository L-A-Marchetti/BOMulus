import { useEffect, useState } from 'react';
import ws_path from '/src/assets/images/ws_path.svg';

type BannerProps = {
  text: string;
  onClick: () => void;
};

export default function Banner({ text, onClick }: BannerProps) {
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);
  return (
    <div
      className={`transition w-full flex items-center p-4 rounded-lg bg-neutral-700 ${opacity ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
    >
      <svg
        className="shrink-0 w-4 h-4 text-neutral-300"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div className="ms-3 text-sm font-medium text-neutral-300">{text}</div>
      <button
        onClick={onClick}
        type="button"
        className="cursor-pointer ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-neutral-400 p-1.5 inline-flex items-center justify-center h-8 w-8 bg-neutral-600 text-neutral-300 hover:bg-neutral-500 hover:text-white"
        data-dismiss-target="#alert-5"
        aria-label="Close"
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}
