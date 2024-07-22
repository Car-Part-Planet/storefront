import { ImageResponse } from 'next/og';
import LogoIcon from './icons/logo';

export type Props = {
  title?: string;
};

export default async function OpengraphImage(props?: Props): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: process.env.SITE_NAME
    },
    ...props
  };

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-white">
        <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
          <LogoIcon />
        </div>
        <p tw="mt-12 text-6xl font-bold text-black">{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
