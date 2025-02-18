import { useEffect, useState } from "react";

type ButtonProps = {
  text: string;
  bg: string;
  bgHover: string;
  txtColor :string;
  onClick: () => void;
};

export default function Button({ text, bg, bgHover, txtColor, onClick }: ButtonProps) {
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true)
  }, []);
  return (
    <button
      onClick={onClick}
      className={`w-full h-20 cursor-pointer py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg focus:z-10 focus:ring-4 focus:ring-neutral-700 ${bg} ${txtColor} hover:text-white ${bgHover} ${opacity ? 'opacity-100' : 'opacity-0'} hover:scale-95 transition`}
    >
      {text}
    </button>
  );
}
