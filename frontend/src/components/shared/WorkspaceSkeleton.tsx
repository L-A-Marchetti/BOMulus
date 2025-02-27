import { useEffect, useState } from 'react';

export default function WorkspaceSkeleton() {
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);

  return (
    <div
      className={`w-full transition max-w-61 rounded-lg border-neutral-700 border-3 aspect-square ${opacity ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex justify-end px-4 pt-4"></div>
      <div className="flex flex-col items-center pb-10">
        <h5 className="mb-1 text-xl font-medium text-white"></h5>
      </div>
    </div>
  );
}
