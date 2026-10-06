"use client";

import Link from "next/link";
import { useEffect, useState, type ReactElement } from "react";
import type { Product } from "@/domain/catalog/product";
import { useLocale } from "@/features/i18n/locale-provider";
import {
  CartDrawer,
  Footer,
  type CartLine,
} from "@/features/storefront/components/storefront-experience";
import { ProductImageGallery } from "@/features/storefront/components/product-image-gallery";
import { ProductImage } from "@/features/storefront/components/product-image";
import { formatAedFromCents } from "@/shared/utils/currency";

export function ProductDetailPage({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}): ReactElement {
  const { locale } = useLocale();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const galleryImages = [
    product.imageUrl,
    product.secondaryImageUrl,
    product.tertiaryImageUrl,
  ].filter((image): image is string => Boolean(image));
  const hasSale = product.salePriceAedCents !== null && product.salePriceAedCents !== undefined;
  const name = localizedProductName(product, locale);
  const description = localizedProductDescription(product, locale);
  const cartQuantity = cart.find((line) => line.id === product.id)?.quantity ?? 0;
  const cartTotal = cart.reduce((total, line) => total + line.priceAedCents * line.quantity, 0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const storedCart = JSON.parse(
          window.sessionStorage.getItem("thashreef-cart") ?? "[]",
        ) as CartLine[];
        setCart(Array.isArray(storedCart) ? storedCart : []);
      } catch {
        setCart([]);
      } finally {
        setCartHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [product.id]);

  useEffect(() => {
    if (!cartHydrated) return;
    window.sessionStorage.setItem("thashreef-cart", JSON.stringify(cart));
  }, [cart, cartHydrated]);

  function addToCart(): void {
    setCart((lines) => {
      if (lines.some((line) => line.id === product.id)) return lines;
      return [...lines, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, change: number): void {
    setCart((lines) =>
      lines
        .map((line) =>
          line.id === productId ? { ...line, quantity: Math.max(0, line.quantity + change) } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  return (
    <main className="min-h-screen bg-[#eef5fa] text-[#0a2540]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1280px] items-center gap-3 px-4 sm:px-6">
          <Link
            className="truncate text-sm font-black text-[#0a2540] transition hover:text-[#0e7490]"
            href="/"
          >
            MARSA EDGE MARINE
          </Link>
          <Link
            className="hidden min-h-11 content-center text-sm font-bold text-slate-600 underline-offset-4 hover:text-[#0e7490] hover:underline sm:block"
            href="/shop"
          >
            Browse shop
          </Link>
          <button
            aria-label={`Open cart with ${cart.reduce((total, line) => total + line.quantity, 0)} items`}
            className="relative ml-auto grid size-12 place-items-center rounded-full bg-[#0a2540] text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#0e7490]"
            onClick={() => setCartOpen(true)}
            type="button"
          >
            <ProductCartIcon />
            {cart.length > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#f97316] text-[10px] font-black">
                {cart.reduce((total, line) => total + line.quantity, 0)}
              </span>
            ) : null}
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-6 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link className="hover:text-[#0e7490] hover:underline" href="/">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link className="hover:text-[#0e7490] hover:underline" href="/shop">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span>{product.category}</span>
        </nav>
        <article className="mt-6 grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[360px] bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100 p-7 sm:p-12">
            <span className="absolute left-6 top-6 rounded-full bg-[#0a2540] px-3 py-1.5 text-xs font-black text-white">
              {product.category}
            </span>
            <ProductImageGallery alt={name} images={galleryImages} />
          </div>
          <div className="p-6 sm:p-10">
            <p className="text-xs font-black tracking-[0.18em] text-[#0e7490] uppercase">
              {product.brand}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#0a2540] sm:text-4xl">
              {name}
            </h1>
            <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
              <p className="text-3xl font-black text-[#0e7490]">
                {formatAedFromCents(product.priceAedCents)}
              </p>
              {hasSale ? (
                <p className="pb-1 text-base text-slate-400 line-through">
                  {formatAedFromCents(product.regularPriceAedCents)}
                </p>
              ) : null}
            </div>
            <p className="mt-6 text-base leading-7 text-slate-600">{description}</p>
            <button
              className="mt-5 min-h-12 w-full rounded-full bg-[#f97316] px-6 text-sm font-black text-white transition hover:bg-[#c2410c] disabled:cursor-not-allowed disabled:bg-emerald-700 disabled:opacity-90 disabled:hover:bg-emerald-700"
              disabled={cartQuantity > 0}
              onClick={addToCart}
              type="button"
            >
              {cartQuantity > 0 ? "Added to cart" : "Add to cart"}
            </button>
            {cartQuantity > 0 ? (
              <div
                aria-live="polite"
                className="mt-3 rounded-xl bg-sky-50 px-4 py-3 text-sm font-bold text-[#0e568f]"
              >
                This item is already in your cart. Update its quantity from the cart.
              </div>
            ) : null}
            <div className="mt-7 grid grid-cols-3 gap-2 border-t border-slate-100 pt-6 text-center text-xs font-bold text-slate-600">
              <span>UAE delivery</span>
              <span>Secure checkout</span>
              <span>Technical support</span>
            </div>
          </div>
        </article>
        {relatedProducts.length > 0 ? (
          <section className="mt-12" aria-labelledby="related-products-heading">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-[#0e7490] uppercase">
                  More in this category
                </p>
                <h2
                  className="mt-2 text-2xl font-black tracking-tight text-[#0a2540]"
                  id="related-products-heading"
                >
                  Related {product.category} products
                </h2>
              </div>
              <Link className="text-sm font-bold text-[#0e568f] hover:underline" href="/shop">
                Browse all products
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <RelatedProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <Footer />
      {cartOpen ? (
        <CartDrawer
          cart={cart}
          close={() => setCartOpen(false)}
          total={cartTotal}
          updateQuantity={updateQuantity}
        />
      ) : null}
    </main>
  );
}

function ProductCartIcon(): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height="21" viewBox="0 0 24 24" width="21">
      <path
        d="M3 4h2l1.7 9.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L20 7H6.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M9 20h.01M17 20h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

function RelatedProductCard({ product }: { product: Product }): ReactElement {
  const { locale } = useLocale();
  const name = localizedProductName(product, locale);
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link aria-label={`View ${name}`} className="block" href={`/products/${product.slug}`}>
        <div className="aspect-square bg-gradient-to-br from-sky-50 to-slate-100 p-5">
          <ProductImage
            alt={name}
            className="h-full w-full object-contain"
            height={420}
            imageUrl={product.imageUrl}
            width={420}
          />
        </div>
        <div className="p-4">
          <p className="text-xs font-black tracking-[0.14em] text-slate-400 uppercase">
            {product.brand}
          </p>
          <h3 className="mt-2 text-sm font-black leading-5 text-[#0a2540]">{name}</h3>
          <p className="mt-3 text-base font-black text-[#0e7490]">
            {formatAedFromCents(product.priceAedCents)}
          </p>
        </div>
      </Link>
    </article>
  );
}

function localizedProductName(product: Product, locale: "ar" | "en"): string {
  return locale === "ar" && product.nameAr ? product.nameAr : product.name;
}
function localizedProductDescription(product: Product, locale: "ar" | "en"): string {
  return locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description;
}
