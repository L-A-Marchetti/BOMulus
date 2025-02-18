type ModalProps = {
  title: string;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Modal({
  title,
  text,
  onConfirm,
  onCancel,
}: ModalProps) {
  return (
    <div className="scale-105 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative p-4 w-full max-w-md bg-neutral-900 rounded-lg shadow-sm">
        <button
          type="button"
          className="cursor-pointer absolute top-3 end-2.5 text-neutral-400 bg-transparent rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center hover:bg-neutral-600 hover:text-white"
          onClick={onCancel}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
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
          <span className="sr-only">Close modal</span>
        </button>
        <div className="p-4 md:p-5 text-center">
          <svg
            className="mx-auto mb-4 w-12 h-12 text-neutral-200"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h2 className="my-5 text-xl text-red-400">{title}</h2>
          <h3 className="mb-5 text-lg font-normal text-neutral-400">{text}</h3>
          <button
            onClick={onConfirm}
            className="cursor-pointer border-2 border-red-400 text-white bg-neutral-900 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Yes, I'm sure
          </button>
          <button
            onClick={onCancel}
            className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-neutral-700 bg-neutral-800 text-neutral-400 border-neutral-900 hover:text-white hover:bg-neutral-700"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
}
