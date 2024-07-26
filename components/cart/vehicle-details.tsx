import { Description, Field, Input, Label } from '@headlessui/react';
import { Control, Controller } from 'react-hook-form';
import * as zod from 'zod';

export const vehicleFormSchema = zod.object({
  customer_vin: zod.string({ required_error: 'Vin number is required' }),
  customer_mileage: zod.coerce.number({ required_error: 'Mileage is required' }).int()
});

export type VehicleFormSchema = zod.infer<typeof vehicleFormSchema>;

type VehicleDetailsProps = {
  control: Control<VehicleFormSchema>;
};

const VehicleDetails = ({ control }: VehicleDetailsProps) => {
  return (
    <div className="pb-8">
      <h2 className="text-lg font-medium text-gray-900">Vehicle Details</h2>
      <Controller
        name="customer_vin"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field className="mt-4">
            <Label className="block text-sm font-medium text-gray-700">Vin Number</Label>
            <Input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 text-dark shadow-sm focus:outline-none data-[focus]:border-primary/80 data-[focus]:ring-primary/80 sm:text-sm"
              autoFocus
              {...field}
            />
            {error && (
              <Description className="mt-1 text-sm text-red-500">{error.message}</Description>
            )}
          </Field>
        )}
      />

      <Controller
        name="customer_mileage"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field className="mt-4">
            <Label className="block text-sm font-medium text-gray-700">Current Mileage</Label>
            <Input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 text-dark shadow-sm focus:outline-none data-[focus]:border-primary/80 data-[focus]:ring-primary/80 sm:text-sm"
              {...field}
            />
            {error && (
              <Description className="mt-1 text-sm text-red-500">{error.message}</Description>
            )}
          </Field>
        )}
      />
    </div>
  );
};

export default VehicleDetails;
