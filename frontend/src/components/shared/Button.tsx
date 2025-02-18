type ButtonProps = {
  text: string;
  bg: string;
  bgHover: string;
  txtColor :string;
  onClick: () => void;
};

export default function Button({ text, bg, bgHover, txtColor, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-20 cursor-pointer py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg focus:z-10 focus:ring-4 focus:ring-neutral-700 ${bg} ${txtColor} hover:text-white ${bgHover} hover:scale-95 transition`}
    >
      {text}
    </button>
  );
}
