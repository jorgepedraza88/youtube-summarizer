export function Loader() {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <div className="relative size-28">
          <div
            className="absolute h-full w-full animate-spin rounded-full border-[3px] border-gray-100/10 border-b-teal-500 border-r-teal-500"
            style={{ animationDuration: '3s' }}
          ></div>

          <div
            className="absolute h-full w-full animate-spin rounded-full border-[3px] border-gray-100/10 border-t-teal-500"
            style={{ animationDuration: '3s' }}
          ></div>
        </div>

        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-teal-500/10 via-transparent to-teal-500/5 blur-sm"></div>
      </div>
    </div>
  );
}
