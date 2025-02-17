import add from '/src/assets/images/add_circle.svg'

type DarkCardProps = {
  onClick: () => void;
};

export default function DarkCard({ onClick }: DarkCardProps) {

  return (
    <div
      onClick={onClick}
      className="w-full h-full transition rounded-lg bg-neutral-800 border-3 border-neutral-700 hover:scale-95"
    >
      <div className="h-full flex items-center justify-center px-3">
        <img className="w-10 h-10" src={add} alt="Workspace" />
      </div>
    </div>
  );
}
