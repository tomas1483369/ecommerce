import { useState } from 'react';
import { uploadImageToImageKit } from '../lib/imagekitUpload.js';
import { IK_PRESETS, imageKitOptimizedUrl } from '../lib/imagekitUrl.js';
import { LoaderIcon } from 'lucide-react';
import { buttonClass, inputClass, labelClass } from '../lib/ui.js';

export function AdminProductForm({ initial, saving, error, getToken, onCancel, onSubmit }) {
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'General');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [priceCents, setPriceCents] = useState(initial ? String(initial.priceCents / 100) : '');
  const [currency, setCurrency] = useState(initial?.currency ?? 'cop');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [imageKitFileId, setImageKitFileId] = useState(initial?.imageKitFileId ?? '');
  const [active, setActive] = useState(initial?.active ?? true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const dollars = Number.parseFloat(priceCents);
    if (Number.isNaN(dollars) || dollars <= 0) return;

    const body = {
      slug: slug.trim(),
      name: name.trim(),
      category: category.trim() || 'General',
      description: description.trim(),
      priceCents: Math.round(dollars * 100),
      currency: currency.trim().toLowerCase(),
      imageUrl: imageUrl.trim() || null,
      imageKitFileId: imageKitFileId.trim() || null,
      active,
    };

    if (initial) {
      const patch = {};
      if (body.name !== initial.name) patch.name = body.name;
      if (body.category !== (initial.category ?? 'General')) patch.category = body.category;
      if (body.description !== initial.description) patch.description = body.description;
      if (body.priceCents !== initial.priceCents) patch.priceCents = body.priceCents;
      if (body.currency !== initial.currency) patch.currency = body.currency;
      if ((body.imageUrl ?? '') !== (initial.imageUrl ?? '')) patch.imageUrl = body.imageUrl;
      if ((body.imageKitFileId ?? null) !== (initial.imageKitFileId ?? null)) {
        patch.imageKitFileId = body.imageKitFileId;
      }
      if (body.active !== initial.active) patch.active = body.active;
      if (Object.keys(patch).length === 0) {
        onCancel();
        return;
      }
      onSubmit(patch);
    } else {
      onSubmit(body);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError(null);

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('La imagen pesa demasiado (máximo 10 MB).');
      return;
    }

    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.jpg';
    const base = (slug.trim() || 'product').replace(/[^\w-]+/g, '-').slice(0, 80);

    setUploadingImage(true);

    try {
      const { url, fileId } = await uploadImageToImageKit(file, getToken, {
        fileName: `${base}-${Date.now()}${ext}`,
      });

      setImageUrl(url);
      setImageKitFileId(fileId ?? '');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'No se pudo subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className={labelClass}>
        Slug
        <input
          className={inputClass}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          disabled={Boolean(initial)}
        />
      </label>

      <label className={labelClass}>
        Nombre
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className={labelClass}>
        Categoría
        <input
          className={inputClass}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ej.: Celulares"
          required
        />
      </label>

      <label className={labelClass}>
        Descripción
        <textarea
          className={`${inputClass} h-24 resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass}>
          Precio
          <input
            className={inputClass}
            type="number"
            step="0.01"
            min="0.01"
            value={priceCents}
            onChange={(e) => setPriceCents(e.target.value)}
            required
          />
        </label>

        <label className={labelClass}>
          Moneda
          <input
            className={inputClass}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Imagen</span>
        <label className="flex cursor-pointer flex-wrap items-center gap-3">
          <span className={buttonClass({ variant: 'outline', size: 'sm' })}>
            {uploadingImage ? <LoaderIcon className="size-4 animate-spin" aria-hidden /> : null}
            {uploadingImage ? 'Subiendo…' : 'Subir imagen'}
          </span>
          <span className="text-xs text-muted">PNG, JPG, WebP o GIF · máximo 10 MB</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            disabled={uploadingImage || saving}
            onChange={handleImageUpload}
          />
        </label>

        <label className={labelClass}>
          <span className="text-xs font-normal text-muted">O pega la URL de la imagen (HTTPS)</span>
          <input
            className={inputClass}
            type="url"
            value={imageUrl}
            onChange={(e) => {
              const v = e.target.value;
              if (v !== imageUrl) setImageKitFileId('');
              setImageUrl(v);
            }}
            placeholder="https://..."
          />
        </label>

        {uploadError ? (
          <span className="text-xs text-brand" role="alert">
            {uploadError}
          </span>
        ) : null}
        {imageUrl ? (
          <div className="overflow-hidden rounded-2xl bg-paper-soft p-2">
            <img
              src={imageKitOptimizedUrl(imageUrl, IK_PRESETS.formPreview)}
              alt=""
              className="mx-auto max-h-32 w-auto object-contain"
              decoding="async"
            />
          </div>
        ) : null}
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          className="size-5 accent-brand"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Visible en la tienda
      </label>

      {error ? (
        <p role="alert" className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand">
          No se pudo guardar. Revisa que el slug no esté repetido y que los campos sean válidos.
        </p>
      ) : null}

      <div className="mt-2 flex justify-end gap-3">
        <button type="button" className={buttonClass({ variant: 'ghost' })} onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="submit"
          className={buttonClass({ variant: 'primary' })}
          disabled={saving || uploadingImage}
        >
          {saving ? <LoaderIcon className="size-4 animate-spin" aria-hidden /> : null}
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
