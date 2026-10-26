// Shared loading placeholders; `skeleton` is a utility defined in index.css.

export function ProductPageSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16" aria-busy="true">
      <div className="skeleton aspect-[4/3] w-full rounded-3xl lg:aspect-square" />
      <div className="flex flex-col gap-4">
        <div className="skeleton h-12 w-3/4" />
        <div className="skeleton h-9 w-40" />
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-14 w-56 rounded-full" />
      </div>
    </div>
  );
}

export function CartSkeleton({ lines = 3 }) {
  const n = Math.min(Math.max(lines, 1), 8);
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]" aria-busy="true">
      <ul className="flex flex-col divide-y divide-line rounded-3xl bg-paper px-6">
        {Array.from({ length: n }).map((_, i) => (
          <li key={i} className="flex gap-6 py-6">
            <div className="skeleton size-28 shrink-0 rounded-2xl" />
            <div className="flex flex-1 flex-col gap-3">
              <div className="skeleton h-6 w-48 max-w-full" />
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-9 w-32 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
      <div className="skeleton h-72 w-full rounded-3xl" />
    </div>
  );
}

export function OrdersListSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-5 rounded-3xl bg-paper p-5">
          <div className="skeleton size-[5.5rem] shrink-0 rounded-2xl" />
          <div className="flex flex-1 flex-col gap-3">
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-4 w-56 max-w-full" />
          </div>
          <div className="skeleton h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

export function AdminProductsTableSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-line rounded-3xl bg-paper" aria-busy="true">
      {[1, 2, 3, 4, 5, 6].map((row) => (
        <div key={row} className="flex items-center gap-5 px-5 py-3">
          <div className="skeleton size-14 shrink-0 rounded-xl" />
          <div className="skeleton h-5 flex-1" />
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-5 w-20" />
        </div>
      ))}
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <div className="skeleton h-5 w-40" />
      <div className="skeleton h-56 w-full rounded-3xl" />
      <div className="skeleton h-64 w-full rounded-3xl" />
    </div>
  );
}
