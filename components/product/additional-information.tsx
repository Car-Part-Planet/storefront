import PageContent from 'components/page/page-content';
import { getMetaobject, getMetaobjectsByIds } from 'lib/shopify';
import { Product } from 'lib/shopify/types';
import { SearchParams } from 'lib/types';
import { getSelectedProductVariant } from 'lib/utils';
import kebabCase from 'lodash.kebabcase';

const AdditionalInformation = async ({
  product,
  searchParams
}: {
  product: Product;
  searchParams?: SearchParams;
}) => {
  const selectedVariant = getSelectedProductVariant({ product, searchParams });

  if (!selectedVariant) return null;

  const pdpContent = await getMetaobject({
    handle: {
      handle: `${selectedVariant.condition}-${kebabCase(product.productType)}`.toLowerCase(),
      type: 'pdp_content'
    }
  });

  if (!pdpContent) return null;

  const contentIds = pdpContent.content ? JSON.parse(pdpContent.content) : [];
  const pageContent = await getMetaobjectsByIds(contentIds);

  return (
    <div className="w-full divide-y border-t px-2">
      {pageContent.map((block) => (
        <div key={block.id} className="py-6">
          <PageContent block={block} />
        </div>
      ))}
    </div>
  );
};

export default AdditionalInformation;
