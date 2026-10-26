import { PackageIcon } from 'lucide-react';
import { IK_PRESETS, imageKitOptimizedUrl } from '../lib/imagekitUrl.js';

const SIZES = {
  md: 'size-[5.5rem]',
  lg: 'size-32 sm:size-36',
};

function Thumb({ item, preset, iconClass }) {
  return item.imageUrl ? (
    <img
      src={imageKitOptimizedUrl(item.imageUrl, preset)}
      alt=""
      className="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span className="flex h-full w-full items-center justify-center">
      <PackageIcon className={`${iconClass} text-line`} aria-hidden />
    </span>
  );
}

// Order thumbnail: one product image, or a 2×2 mosaic with a "+N" counter.
export function OrderPreview({ items, size = 'md' }) {
  const box = SIZES[size] ?? SIZES.md;
  const preset = size === 'lg' ? IK_PRESETS.orderPreviewLg : IK_PRESETS.orderPreviewMd;
  const iconClass = size === 'lg' ? 'size-12' : 'size-8';

  if (!items?.length) {
    return (
      <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-paper-soft ${box}`}>
        <PackageIcon className={`${iconClass} text-line`} aria-hidden />
      </div>
    );
  }

  if (items.length === 1) {
    return (
      <div className={`shrink-0 overflow-hidden rounded-2xl bg-paper ${box}`}>
        <Thumb item={items[0]} preset={preset} iconClass={iconClass} />
      </div>
    );
  }

  const cap = 4;
  const show = items.slice(0, cap);
  const rest = items.length > cap ? items.length - cap : 0;

  return (
    <div
      className={`grid shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl bg-paper-soft p-0.5 ${box}`}
    >
      {show.map((item, i) => (
        <div
          key={`${item.slug}-${i}`}
          className="relative min-h-0 overflow-hidden rounded-md bg-paper"
        >
          <Thumb item={item} preset={preset} iconClass="size-4" />
          {i === cap - 1 && rest > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/80 text-sm font-bold text-white tabular-nums">
              +{rest}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
