import Table from 'components/page/table';
import { getMetaobjectsByIds } from 'lib/shopify';
import { Product } from 'lib/shopify/types';
import groupBy from 'lodash.groupby';

const VehicleCombatibility = async ({ product }: { product: Product }) => {
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

  const colums = [
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
    <div className="mt-10 flex flex-col gap-y-4 border-t pt-5 content-visibility-auto contain-intrinsic-size-[auto_500px]">
      <h3 className="text-lg font-semibold leading-6 text-content-dark">Vehicle Compatibility</h3>
      <Table columns={colums} data={data} />
    </div>
  );
};

export default VehicleCombatibility;
