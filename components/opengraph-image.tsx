import { ImageResponse } from 'next/og';
import LogoSquare from './logo-square';

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
      <div tw="flex h-full w-full items-center justify-center bg-white">
        <LogoSquare />
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
