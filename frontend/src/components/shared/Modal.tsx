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
    <div role="dialog" aria-modal="true">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
}
