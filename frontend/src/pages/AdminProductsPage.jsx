import { useCallback } from 'react';
import { Navigate } from 'react-router';
import { LoaderIcon, PackageIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { AdminProductForm } from '../components/AdminProductForm.jsx';
import { Container } from '../components/Container.jsx';
import { AdminProductsTableSkeleton } from '../components/LoadingSkeletons.jsx';
import { Modal } from '../components/Modal.jsx';
import { useAdminProductsPage } from '../hooks/useAdminProductsPage.js';
import { IK_PRESETS, imageKitOptimizedUrl } from '../lib/imagekitUrl.js';
import { buttonClass } from '../lib/ui.js';
import { formatPrice } from '../utils/format.js';

function AdminProductsPage() {
  const {
    getToken,
    meData,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    products,
    isLoading,
    saveMutation,
    deleteMutation,
  } = useAdminProductsPage();

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
  }, [setModalOpen, setEditing]);

  if (meData && meData.user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  function handleDeleteProduct(product) {
    if (!window.confirm(`¿Eliminar "${product.name}" de forma permanente?`)) return;
    deleteMutation.mutate(product.id);
  }

  return (
    <Container className="py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Productos</h1>
          <p className="mt-2 text-body">Administra el catálogo de la tienda.</p>
        </div>
        <button
          type="button"
          className={buttonClass({ variant: 'primary', size: 'sm' })}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <PlusIcon className="size-4" aria-hidden />
          Nuevo producto
        </button>
      </div>

      {isLoading ? (
        <AdminProductsTableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-paper shadow-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-paper-soft text-xs font-bold tracking-[0.06em] text-muted">
              <tr>
                <th className="px-5 py-4">IMAGEN</th>
                <th className="px-5 py-4">NOMBRE</th>
                <th className="px-5 py-4">CATEGORÍA</th>
                <th className="px-5 py-4">SLUG</th>
                <th className="px-5 py-4">PRECIO</th>
                <th className="px-5 py-4">ESTADO</th>
                <th className="px-5 py-4">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => {
                const deleting = deleteMutation.isPending && deleteMutation.variables === p.id;
                return (
                  <tr key={p.id}>
                    <td className="px-5 py-3">
                      <div className="size-14 overflow-hidden rounded-xl bg-paper">
                        {p.imageUrl ? (
                          <img
                            src={imageKitOptimizedUrl(p.imageUrl, IK_PRESETS.adminThumb)}
                            alt=""
                            className="h-full w-full object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center">
                            <PackageIcon className="size-6 text-line" aria-hidden />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold">{p.name}</td>
                    <td className="px-5 py-3 text-body">{p.category ?? '-'}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">{p.slug}</td>
                    <td className="px-5 py-3 tabular-nums">
                      {formatPrice(p.priceCents, p.currency)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          p.active ? 'bg-success-soft text-success' : 'bg-paper-soft text-muted'
                        }`}
                      >
                        {p.active ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className={buttonClass({ variant: 'ghost', size: 'sm' })}
                          onClick={() => {
                            setEditing(p);
                            setModalOpen(true);
                          }}
                        >
                          <PencilIcon className="size-4" aria-hidden />
                          Editar
                        </button>
                        <button
                          type="button"
                          className={buttonClass({ variant: 'danger', size: 'sm' })}
                          disabled={deleting}
                          onClick={() => handleDeleteProduct(p)}
                        >
                          {deleting ? (
                            <LoaderIcon className="size-4 animate-spin" aria-hidden />
                          ) : (
                            <Trash2Icon className="size-4" aria-hidden />
                          )}
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        onClose={closeModal}
      >
        <AdminProductForm
          key={editing?.id ?? 'new'}
          initial={editing}
          saving={saveMutation.isPending}
          error={saveMutation.isError}
          getToken={getToken}
          onCancel={closeModal}
          onSubmit={(body) => saveMutation.mutate({ body, id: editing?.id })}
        />
      </Modal>
    </Container>
  );
}

export default AdminProductsPage;
