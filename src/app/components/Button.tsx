interface ButtonProps {
  isDisabled: boolean;
  children: React.ReactNode;
}

export function Button({ isDisabled, children }: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="w-full rounded-md bg-teal-600 p-2 font-medium text-white shadow transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {children}
    </button>
  );
}
