import Table from 'components/page/table';
import { getMetaobjectsByIds } from 'lib/shopify';
import { Product } from 'lib/shopify/types';
import groupBy from 'lodash.groupby';
import AccordionDetails from './accordion-details';

const VehicleCompatibility = async ({ product }: { product: Product }) => {
  const [makesData, modelsData, yearsData] = await Promise.all([
    getMetaobjectsByIds(product.makes || []),
    getMetaobjectsByIds(product.models || []),
    getMetaobjectsByIds(product.years || [])
  ]);

  if (!yearsData.length) {
    return null;
  }

  const makesById = groupBy(makesData, (item) => item.id);
  const modelsById = groupBy(modelsData, (item) => item.id);

  const data: Array<{ make?: string; model?: string; year?: string }> = [];

  yearsData.forEach((year) => {
    const model = year.make_model ? modelsById[year.make_model]?.[0] : undefined;
    const make = model?.make ? makesById[model.make]?.[0] : undefined;
    if (make && model) {
      data.push({
        make: make.display_name,
        model: model.name,
        year: year.name
      });
    }
  });

  const columns = [
    {
      key: 'make',
      title: 'Make'
    },
    {
      key: 'model',
      title: 'Model'
    },
    {
      key: 'year',
      title: 'Year'
    }
  ];

  return (
    <div className="mt-10 flex flex-col border-t content-visibility-auto contain-intrinsic-size-[auto_500px]">
      <AccordionDetails title="Vehicle Compatibility">
        <Table columns={columns} data={data} />
      </AccordionDetails>
    </div>
  );
};

export default VehicleCompatibility;
