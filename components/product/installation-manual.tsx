import FileDownloader from 'components/file-downloader';
import { getFile } from 'lib/shopify';
import { Product } from 'lib/shopify/types';
import { SearchParams } from 'lib/types';
import { getSelectedProductVariant } from 'lib/utils';

const InstallationManual = async ({
  product,
  searchParams
}: {
  product: Product;
  searchParams?: SearchParams;
}) => {
  const variant = getSelectedProductVariant({ product, searchParams });
  if (!variant || !variant.installationManual) return null;

  const file = await getFile(variant.installationManual);
  const fileUrl = new URL(file.url);
  const fileName = fileUrl.pathname.split('/').pop() || 'Install Guide';

  return (
    <div className="mt-6 space-y-2 border-t px-2 py-4">
      <h3 className="text-lg font-semibold leading-6 text-content-dark">Installation Manual</h3>
      <FileDownloader displayName={fileName} fileUrl={file.url} />
    </div>
  );
};

export default InstallationManual;
