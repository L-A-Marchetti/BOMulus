import { useEffect, useState } from 'react';
import list from '/src/assets/images/list.svg';

type WorkspaceCardProps = {
  workspaceName: string;
  openWs: () => void;
  deleteWs: () => void;
};

export default function WorkspaceCard({
  workspaceName,
  openWs,
  deleteWs,
}: WorkspaceCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true)
  }, []);

  return (
    <a
      href="#"
      onClick={openWs}
      className={`w-full transition max-w-65 rounded-lg bg-neutral-700 hover:scale-105 hover:bg-neutral-600 aspect-square ${opacity ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className="inline-block text-neutral-400 hover:bg-neutral-700 rounded-lg text-sm p-1.5"
          type="button"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>
        {isDropdownOpen && (
          <div
            onMouseLeave={() => setIsDropdownOpen(!isDropdownOpen)}
            className="absolute right-4 mt-10 z-10 text-base list-none divide-y divide-neutral-100 rounded-lg shadow-sm w-44 bg-neutral-700"
          >
            <ul className="py-2">
              <li>
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href="#"
                  className="block px-4 py-2 text-sm hover:bg-neutral-600 text-neutral-200 hover:text-white"
                >
                  Edit Name
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href="#"
                  className="block px-4 py-2 text-sm hover:bg-neutral-600 text-neutral-200 hover:text-white"
                >
                  Export
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWs();
                  }}
                  className="block px-4 py-2 text-sm hover:bg-red-300 text-red-300 hover:text-black"
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center pb-10">
        <img className="w-24 h-24 mb-3" src={list} alt="Workspace" />
        <h5 className="mb-1 text-xl font-medium text-white">{workspaceName}</h5>
        <span className="text-sm text-neutral-400">Workspace</span>
      </div>
    </a>
  );
}
