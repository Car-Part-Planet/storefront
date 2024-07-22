import { ImageResponse } from 'next/og';
import LogoSquare from './logo-square';

export default async function OpengraphImage(): Promise<ImageResponse> {
  return new ImageResponse(<LogoSquare />, {
    width: 1200,
    height: 630
  });
}
