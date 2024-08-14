'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
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
    <form className="flex flex-col gap-2 md:flex-row-reverse xl:flex-col">
      <div className="relative aspect-1 h-full max-h-[300px] w-full overflow-hidden xl:max-h-[550px]">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}
        {images.length > 1 ? (
          <>
            <div className="absolute bottom-[10%] flex w-full justify-center xl:bottom-[5%]">
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
            <p className="absolute bottom-[1%] flex w-full justify-center text-xs text-neutral-500 xl:bottom-0">
              Representative Image
            </p>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-0 mb-4 flex flex-row justify-center gap-3 overflow-auto p-2 md:my-20 md:flex-col md:items-center md:justify-start md:gap-0 lg:mb-0 xl:my-5 xl:flex-row xl:justify-center xl:gap-3">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            return (
              <li key={image.src}>
                <button
                  aria-label="Enlarge product image"
                  className={clsx('h-2 w-2 rounded-full', {
                    'bg-black ring-1 ring-black ring-offset-2': isActive,
                    'bg-gray-300': !isActive
                  })}
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateUrl(newState);
                  }}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
