type Props = {
  title: string;
  description: string;
  color: "green" | "blue";
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function RoleCard({
  title,
  description,
  color,
  onClick,
  loading,
  disabled,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl shadow text-left transition ${
        color === "green"
          ? "bg-green-500 hover:bg-green-600"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
      }`}
    >
      <h2 className="text-lg font-semibold">
        {loading ? "Loading..." : title}
      </h2>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
}