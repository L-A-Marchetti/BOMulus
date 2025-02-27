import { useEffect, useState } from 'react';

type ButtonProps = {
  h: string;
  img: string | null;
  text: string;
  bg: string;
  bgHover: string;
  txtColor: string;
  onClick: () => void;
};

export default function Button({
  h,
  img,
  text,
  bg,
  bgHover,
  txtColor,
  onClick,
}: ButtonProps) {
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);
  return (
    <button
      onClick={onClick}
      className={`w-full ${h} cursor-pointer py-2.5 px-5 text-sm font-medium rounded-lg focus:outline-none focus:z-10 ${bg} ${txtColor} hover:text-white ${bgHover} ${opacity ? 'opacity-100' : 'opacity-0'} hover:scale-99 transition`}
    >
      <div className="flex items-center justify-center">
        {img ? <img src={img} className="mr-2 h-5" /> : <></>}
        {text}
      </div>
    </button>
  );
}
