'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { TileImage } from 'components/grid/tile';
import { useProduct, useUpdateURL } from 'context/product-context';
import Image from 'next/image';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const { state, updateImage } = useProduct();
  const updateUrl = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  return (
    <form>
      <div className="relative hidden aspect-1 h-full max-h-[550px] w-full overflow-hidden md:block">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}
        {images.length > 1 ? (
          <>
            <div className="absolute bottom-[15%] flex w-full justify-center">
              <div className="mx-auto mb-3 flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
                <button
                  aria-label="Previous product image"
                  formAction={() => {
                    const newState = updateImage(previousImageIndex.toString());
                    updateUrl(newState);
                  }}
                  className={buttonClassName}
                >
                  <ArrowLeftIcon className="h-5" />
                </button>
                <div className="mx-1 h-6 w-px bg-neutral-500"></div>
                <button
                  aria-label="Next product image"
                  formAction={() => {
                    const newState = updateImage(nextImageIndex.toString());
                    updateUrl(newState);
                  }}
                  className={buttonClassName}
                >
                  <ArrowRightIcon className="h-5" />
                </button>
              </div>
            </div>
            <p className="absolute bottom-[5%] flex w-full justify-center text-xs text-neutral-500">
              Representative Image
            </p>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="mb-4 flex gap-2 overflow-auto py-1 sm:justify-start md:my-12 md:items-center md:justify-center lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            return (
              <li key={image.src} className="h-16 w-16 md:h-20 md:w-20">
                <button
                  aria-label="Enlarge product image"
                  className="h-full w-full"
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateUrl(newState);
                  }}
                >
                  <TileImage alt={image.altText} src={image.src} active={isActive} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
