const STATUS = {
  paid: { label: 'Pagado', className: 'bg-success-soft text-success' },
  pending: { label: 'Pendiente', className: 'bg-warning-soft text-warning' },
  failed: { label: 'Fallido', className: 'bg-brand-soft text-brand' },
};

export function OrderStatusBadge({ status, className = '' }) {
  const s = STATUS[status] ?? { label: status, className: 'bg-paper-soft text-muted' };
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${s.className} ${className}`}
    >
      {s.label}
    </span>
  );
}
