"use client";

import Image from "next/image";
import type { ChangeEvent, ReactElement } from "react";
import { useActionState, useEffect, useState } from "react";
import type { Category } from "@/domain/catalog/category";
import type { Product } from "@/domain/catalog/product";
import type { Brand } from "@/domain/demo-store/demo-store-repository";
import { createProductAction, updateProductAction } from "@/features/catalog/catalog.actions";
import { PRODUCT_DESCRIPTION_MAX_WORDS } from "@/features/catalog/catalog.schemas";
import {
  initialCreateProductActionState,
  type CreateProductActionState,
} from "@/features/catalog/catalog.types";

interface AddProductFormProps {
  brands: Brand[];
  categories: Category[];
  onSuccess?: () => void;
  product?: Product;
}

export function AddProductForm({
  brands,
  categories,
  onSuccess,
  product,
}: AddProductFormProps): ReactElement {
  const [descriptionWordCount, setDescriptionWordCount] = useState(
    countWords(product?.description ?? ""),
  );
  const [arabicDescriptionWordCount, setArabicDescriptionWordCount] = useState(
    countWords(product?.descriptionAr ?? ""),
  );
  const [state, action, pending] = useActionState<CreateProductActionState, FormData>(
    product ? updateProductAction : createProductAction,
    initialCreateProductActionState,
  );

  useEffect(() => {
    if (state.status === "success") onSuccess?.();
  }, [onSuccess, state.status]);

  return (
    <form action={action} className="space-y-8">
      {product ? <input name="id" type="hidden" value={product.id} /> : null}
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-[#102846]">1. Product details</h3>
          <p className="mt-1 text-sm text-slate-500">
            Name the product, choose the category, and describe what customers are buying.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Field
            error={state.fieldErrors?.name?.[0]}
            label="Product name"
            name="name"
            placeholder="Victron Blue Smart Charger 12V 15A"
            defaultValue={product?.name}
            required
          />
          <Field
            defaultValue={product?.nameAr ?? undefined}
            error={state.fieldErrors?.nameAr?.[0]}
            label="Product name (Arabic)"
            name="nameAr"
            placeholder="اسم المنتج بالعربية"
          />
          <BrandSelect
            brands={brands}
            currentBrand={product?.brand}
            error={state.fieldErrors?.brand?.[0]}
          />
          <SelectField
            categories={categories}
            error={state.fieldErrors?.categoryId?.[0]}
            name="categoryId"
            currentCategoryId={product?.categoryId}
          />
        </div>

        <div className="mt-5">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0e568f] focus:bg-white"
              name="description"
              defaultValue={product?.description}
              minLength={16}
              onInput={(event) => setDescriptionWordCount(countWords(event.currentTarget.value))}
              placeholder="Short, useful product summary with marine-specific details and compatibility notes."
              required
            />
            <WordCount current={descriptionWordCount} />
            {state.fieldErrors?.description?.[0] ? (
              <p className="text-sm text-rose-600">{state.fieldErrors.description[0]}</p>
            ) : null}
          </label>
        </div>
        <div className="mt-5">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Description (Arabic)</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0e568f] focus:bg-white"
              defaultValue={product?.descriptionAr ?? undefined}
              dir="rtl"
              name="descriptionAr"
              onInput={(event) =>
                setArabicDescriptionWordCount(countWords(event.currentTarget.value))
              }
              placeholder="وصف مختصر ومفيد للمنتج باللغة العربية"
            />
            <WordCount current={arabicDescriptionWordCount} />
            {state.fieldErrors?.descriptionAr?.[0] ? (
              <p className="text-sm text-rose-600">{state.fieldErrors.descriptionAr[0]}</p>
            ) : null}
          </label>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-[#102846]">2. Pricing and presentation</h3>
          <p className="mt-1 text-sm text-slate-500">
            Set the regular price, optional sale price, and image override.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Field
            error={state.fieldErrors?.regularPriceAed?.[0]}
            inputMode="decimal"
            label="Regular price (AED)"
            name="regularPriceAed"
            placeholder="895.00"
            defaultValue={product ? (product.regularPriceAedCents / 100).toFixed(2) : undefined}
            required
          />
          <Field
            error={state.fieldErrors?.salePriceAed?.[0]}
            inputMode="decimal"
            label="Sale price (AED)"
            name="salePriceAed"
            placeholder="820.00"
            defaultValue={
              product?.salePriceAedCents ? (product.salePriceAedCents / 100).toFixed(2) : undefined
            }
          />
          <ProductImageFields product={product} state={state} />
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <h3 className="text-lg font-bold text-[#102846]">Storefront placement</h3>
        <p className="mt-1 text-sm text-slate-500">
          Choose where this product should be highlighted on the storefront.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["isFeatured", "Featured product"],
            ["isNewArrival", "New arrival"],
            ["isTopSelling", "Top selling"],
            ["isBestDeal", "Best deal"],
            ["isBannerProduct", "Banner product"],
          ].map(([name, label]) => (
            <label
              className="flex min-h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-700"
              key={name}
            >
              <input
                className="size-4 accent-[#f05a28]"
                defaultChecked={Boolean(product?.[name as keyof Product])}
                name={name}
                type="checkbox"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      {state.message ? (
        <section
          className={`rounded-2xl border px-4 py-4 text-sm ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {state.message}
        </section>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          className="min-h-12 rounded-2xl bg-[#f05a28] px-6 text-sm font-extrabold text-white transition hover:bg-[#d94d20] disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving product..." : product ? "Save changes" : "Save product"}
        </button>
      </div>
    </form>
  );
}

function countWords(value: string): number {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue.split(/\s+/).length : 0;
}

function WordCount({ current }: { current: number }): ReactElement {
  const isOverLimit = current > PRODUCT_DESCRIPTION_MAX_WORDS;

  return (
    <p
      aria-live="polite"
      className={`text-xs ${isOverLimit ? "font-semibold text-rose-600" : "text-slate-500"}`}
    >
      {current} / {PRODUCT_DESCRIPTION_MAX_WORDS} words
    </p>
  );
}

function BrandSelect({
  brands,
  currentBrand,
  error,
}: {
  brands: Brand[];
  currentBrand?: string;
  error?: string;
}): ReactElement {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">
        Brand <span className="text-rose-600">*</span>
      </span>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0e568f] focus:bg-white"
        defaultValue={currentBrand ?? ""}
        name="brand"
        required
      >
        <option disabled value="">
          Select a managed brand
        </option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.name}>
            {brand.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500">
        Need another brand? Add it from the Brands page first.
      </p>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

interface FieldProps {
  defaultValue?: number | string;
  error?: string;
  inputMode?: "decimal" | "numeric" | "text";
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}

function Field({
  defaultValue,
  error,
  inputMode = "text",
  label,
  name,
  placeholder,
  required = false,
}: FieldProps): ReactElement {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0e568f] focus:bg-white"
        defaultValue={defaultValue}
        inputMode={inputMode}
        name={name}
        placeholder={placeholder}
        required={required}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

type ProductImageFieldName = "imageFile" | "secondaryImageFile" | "tertiaryImageFile";
type RemovableProductImageFieldName = Exclude<ProductImageFieldName, "imageFile">;
type ProductImageRemovalFieldName = "removeSecondaryImage" | "removeTertiaryImage";

function ProductImageFields({
  product,
  state,
}: {
  product?: Product;
  state: CreateProductActionState;
}): ReactElement {
  const originalPreviews: Record<ProductImageFieldName, string | null> = {
    imageFile: product?.imageUrl ?? null,
    secondaryImageFile: product?.secondaryImageUrl ?? null,
    tertiaryImageFile: product?.tertiaryImageUrl ?? null,
  };
  const [previews, setPreviews] = useState(originalPreviews);
  const [removedImages, setRemovedImages] = useState<
    Record<RemovableProductImageFieldName, boolean>
  >({
    secondaryImageFile: false,
    tertiaryImageFile: false,
  });
  const [replacementImages, setReplacementImages] = useState<
    Record<RemovableProductImageFieldName, boolean>
  >({
    secondaryImageFile: false,
    tertiaryImageFile: false,
  });
  const [inputVersions, setInputVersions] = useState<Record<ProductImageFieldName, number>>({
    imageFile: 0,
    secondaryImageFile: 0,
    tertiaryImageFile: 0,
  });

  function updatePreview(name: ProductImageFieldName, event: ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (name !== "imageFile") {
      setRemovedImages((current) => ({ ...current, [name]: false }));
      setReplacementImages((current) => ({ ...current, [name]: true }));
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string")
        setPreviews((current) => ({ ...current, [name]: reader.result }));
    });
    reader.readAsDataURL(file);
  }

  function updateRemoval(name: RemovableProductImageFieldName, removed: boolean): void {
    setRemovedImages((current) => ({ ...current, [name]: removed }));
    setPreviews((current) => ({ ...current, [name]: removed ? null : originalPreviews[name] }));
  }

  function discardReplacement(name: RemovableProductImageFieldName): void {
    setReplacementImages((current) => ({ ...current, [name]: false }));
    setRemovedImages((current) => ({ ...current, [name]: false }));
    setPreviews((current) => ({ ...current, [name]: originalPreviews[name] }));
    setInputVersions((current) => ({ ...current, [name]: current[name] + 1 }));
  }

  const fields: Array<{
    error?: string;
    label: string;
    name: ProductImageFieldName;
    removeName?: ProductImageRemovalFieldName;
    required: boolean;
  }> = [
    {
      error: state.fieldErrors?.imageFile?.[0],
      label: "Primary image",
      name: "imageFile",
      required: !product,
    },
    {
      error: state.fieldErrors?.secondaryImageFile?.[0],
      label: "Image 2",
      name: "secondaryImageFile",
      removeName: "removeSecondaryImage",
      required: false,
    },
    {
      error: state.fieldErrors?.tertiaryImageFile?.[0],
      label: "Image 3",
      name: "tertiaryImageFile",
      removeName: "removeTertiaryImage",
      required: false,
    },
  ];

  return (
    <div className="lg:col-span-2">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-slate-700">Product gallery</h4>
        <p className="text-xs leading-5 text-slate-500">
          Add up to three JPG, PNG, or WebP images (5 MB each). The first image is the storefront
          cover.
        </p>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {fields.map((field) => {
          const canRemove =
            field.name !== "imageFile" &&
            field.removeName &&
            Boolean(originalPreviews[field.name]) &&
            !replacementImages[field.name];
          const canDiscardReplacement = field.name !== "imageFile" && replacementImages[field.name];
          const isMarkedForRemoval = field.name !== "imageFile" && removedImages[field.name];

          return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3" key={field.name}>
              <span className="text-sm font-semibold text-slate-700">
                {field.label} {field.required ? <span className="text-rose-600">*</span> : null}
              </span>
              <span className="mt-3 flex aspect-square overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
                {isMarkedForRemoval ? (
                  <span className="m-auto px-3 text-center text-xs font-semibold leading-5 text-rose-600">
                    This image will be removed when you save.
                  </span>
                ) : previews[field.name] ? (
                  <Image
                    alt={`${field.label} preview`}
                    className="h-full w-full object-cover"
                    height={320}
                    src={previews[field.name] ?? ""}
                    unoptimized
                    width={320}
                  />
                ) : (
                  <span className="m-auto px-3 text-center text-xs leading-5 text-slate-400">
                    Choose an image to preview it here.
                  </span>
                )}
              </span>
              <input
                accept="image/jpeg,image/png,image/webp"
                aria-label={`Upload ${field.label.toLowerCase()}`}
                className="mt-3 block w-full text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-[#e8f1fa] file:px-2.5 file:py-2 file:text-xs file:font-bold file:text-[#0e568f] hover:file:bg-[#dcecf8]"
                key={`${field.name}-${inputVersions[field.name]}`}
                name={field.name}
                onChange={(event) => updatePreview(field.name, event)}
                required={field.required}
                type="file"
              />
              {product ? (
                <span className="mt-2 block text-xs leading-5 text-slate-500">
                  Leave empty to keep the current image, or upload a replacement.
                </span>
              ) : null}
              {canRemove ? (
                <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700">
                  <input
                    checked={isMarkedForRemoval}
                    className="size-4 accent-rose-600"
                    name={field.removeName}
                    onChange={(event) => {
                      if (field.name !== "imageFile")
                        updateRemoval(field.name, event.currentTarget.checked);
                    }}
                    type="checkbox"
                  />
                  Remove this image
                </label>
              ) : null}
              {canDiscardReplacement ? (
                <button
                  className="mt-3 min-h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                  onClick={() => {
                    if (field.name !== "imageFile") discardReplacement(field.name);
                  }}
                  type="button"
                >
                  Remove selected image
                </button>
              ) : null}
              {field.error ? (
                <span className="mt-2 block text-sm text-rose-600">{field.error}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SelectField({
  categories,
  currentCategoryId,
  error,
  name,
}: {
  categories: Category[];
  currentCategoryId?: number;
  error?: string;
  name: string;
}): ReactElement {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">
        Category <span className="text-rose-600">*</span>
      </span>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0e568f] focus:bg-white"
        defaultValue={currentCategoryId?.toString() ?? ""}
        name={name}
        required
      >
        <option disabled value="">
          Select a category
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.parentCategoryId ? `- ${category.name}` : category.name}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}
