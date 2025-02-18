import ws_name from '/src/assets/images/ws_name.svg';

type InputProps = {
  placeHolder: string;
  type: string;
  value: string;
  onChange: (e: string) => void;
};

export default function Input({
  placeHolder,
  type,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="w-full mx-auto">
      <div className="flex h-20">
        <span className="inline-flex items-center px-3 text-sm border border-e-0 rounded-s-md bg-neutral-600 text-neutral-400 border-neutral-600">
          <img src={ws_name} className="w-4 h-4 text-neutral-400" />
        </span>
        <input
          onChange={(e) => onChange(e.target.value)}
          type={type}
          className="rounded-none rounded-e-lg border block flex-1 min-w-0 w-full text-sm p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeHolder}
          value={value || ''}
        />
      </div>
    </div>
  );
}
