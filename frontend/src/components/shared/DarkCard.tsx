import { useEffect, useState } from 'react';
import add from '/src/assets/images/add_circle.svg';
import imp from '/src/assets/images/import_folder.svg';

type DarkCardProps = {
  addWs: () => void;
  importWs: () => void;
};

export default function DarkCard({ addWs, importWs }: DarkCardProps) {
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);
  return (
    <div
      className={`w-full h-full transition rounded-lg bg-neutral-800 border-3 border-neutral-700 hover:scale-95 group ${opacity ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="h-full flex flex-col items-center justify-center">
        <a
          href="#"
          onClick={addWs}
          className="transition h-full flex items-center hover:bg-neutral-700 hover:w-full px-3"
        >
          <img className="w-10 h-10" src={add} alt="Workspace" />
        </a>
        <div className="w-3/5 border-b border-neutral-600 group-hover:border-b-0 transition" />
        <a
          href="#"
          onClick={importWs}
          className="transition h-full flex items-center hover:bg-neutral-700 hover:w-full px-3"
        >
          <img className="w-10 h-10" src={imp} alt="Workspace" />
        </a>
      </div>
    </div>
  );
}
