import { describe, expect, test } from 'vitest';
import { isSafeUrl, isValidShopifyCdnUrl } from '../utils';

describe('valid Image URL', () => {
  test('image with URL https://cdn.shopify.com/s/files/1/0001/0001/0001/files/image.jpg is valid', () => {
    const url = 'https://cdn.shopify.com/s/files/1/0001/0001/0001/files/image.jpg';
    expect(isSafeUrl(url)).toBe(true);
    expect(isValidShopifyCdnUrl(url)).toBe(true);
  });

  test('image with URL https://cdn.shopify.com/s/files/1/0736/4571/9586/files/T239218_BAC_P07.jpg?v=1719754569 is valid', () => {
    const url =
      'https://cdn.shopify.com/s/files/1/0736/4571/9586/files/T239218_BAC_P07.jpg?v=1719754569';
    expect(isSafeUrl(url)).toBe(true);
    expect(isValidShopifyCdnUrl(url)).toBe(true);
  });

  test(`image with URL https://cdn.shopify.com/s/files/1/0628/5924/7767/files/CPP_Background.webp?v=1719949101"'><qssmJEMdj9c> is invalid`, () => {
    const url = `https://cdn.shopify.com/s/files/1/0628/5924/7767/files/CPP_Background.webp?v=1719949101"'><qssmJEMdj9c>`;
    expect(isSafeUrl(url)).toBe(false);
    expect(isValidShopifyCdnUrl(url)).toBe(false);
  });

  test(`image with URL https://cdn.shopify.com/s/files/1/0628/5924/7767/files/CPP_Background.webp?v=1719949101%20<script>_q_q=random(wSW417P4)</script> is invalid`, () => {
    const url = `https://cdn.shopify.com/s/files/1/0628/5924/7767/files/CPP_Background.webp?v=1719949101%20<script>_q_q=random(wSW417P4)</script>`;
    expect(isSafeUrl(url)).toBe(false);
    expect(isValidShopifyCdnUrl(url)).toBe(false);
  });

  test(`image with URL https://cdn.shopify.com/s/files/1/0628/5924/7767/files/CPP_Background.webp?v=1719949101)(|(homeDirectory=*) is invalid`, () => {
    const url = `https://cdn.shopify.com/s/files/1/0628/5924/7767/files/CPP_Background.webp?v=1719949101)(|(homeDirectory=*)`;
    expect(isSafeUrl(url)).toBe(false);
    expect(isValidShopifyCdnUrl(url)).toBe(false);
  });

  test(`image with URL https://cdn.shopify.com/s/files/1/0628/5924/7767/files/M150307_FRO_P04.jpg?v=1719744482);WAITFOR%20DELAY%20'00:00:29'--%20 is invalid`, () => {
    const url = `https://cdn.shopify.com/s/files/1/0628/5924/7767/files/M150307_FRO_P04.jpg?v=1719744482);WAITFOR%20DELAY%20'00:00:29'--%20`;
    expect(isSafeUrl(url)).toBe(false);
    expect(isValidShopifyCdnUrl(url)).toBe(false);
  });
});
