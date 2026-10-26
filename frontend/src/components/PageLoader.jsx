import { LoaderIcon } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="flex h-[60vh] items-center justify-center" role="status">
      <LoaderIcon className="size-8 animate-spin text-brand" aria-hidden />
      <span className="sr-only">Cargando…</span>
    </div>
  );
};

export default PageLoader;
