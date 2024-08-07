'use server';

import { renderToBuffer } from '@react-pdf/renderer';
import OrderConfirmationPdf from 'components/orders/order-confirmation-pdf';
import { handleUploadFile } from 'components/form/file-input/actions';
import { CORE_RETURN_FIELDS, TAGS, WARRANTY_FIELDS } from 'lib/constants';
import { getOrderConfirmationContent, updateOrderMetafields } from 'lib/shopify';
import {
  CoreReturnStatus,
  Order,
  OrderConfirmationContent,
  ShopifyOrderMetafield,
  UpdateOrderMetafieldInput,
  WarrantyStatus
} from 'lib/shopify/types';
import { revalidateTag } from 'next/cache';
import { cache } from 'react';

const getMetafieldValue = (
  key: keyof ShopifyOrderMetafield,
  newValue: { value?: string | null; type: string; key: string },
  orderMetafields?: ShopifyOrderMetafield
): UpdateOrderMetafieldInput => {
  return orderMetafields?.[key]?.id
    ? {
        id: orderMetafields[key]?.id!,
        value: newValue.value,
        key: newValue.key
      }
    : { ...newValue, namespace: 'custom' };
};

export const activateWarranty = async (order: Order, formData: FormData) => {
  let odometerFileId = null;
  let installationFileId = null;
  const odometerFile = formData.get('warranty_activation_odometer');
  const installationFile = formData.get('warranty_activation_installation');
  if (odometerFile) {
    odometerFileId = await handleUploadFile({ file: odometerFile as File });
  }

  if (installationFile) {
    installationFileId = await handleUploadFile({ file: installationFile as File });
  }

  // https://shopify.dev/docs/api/admin-graphql/2024-01/mutations/orderUpdate
  const metafields = [
    getMetafieldValue(
      'warrantyActivationOdometer',
      {
        key: 'warranty_activation_odometer',
        value: odometerFileId,
        type: 'file_reference'
      },
      order
    ),
    getMetafieldValue(
      'warrantyActivationInstallation',
      {
        key: 'warranty_activation_installation',
        value: installationFileId,
        type: 'file_reference'
      },
      order
    ),
    getMetafieldValue(
      'warrantyActivationSelfInstall',
      {
        key: 'warranty_activation_self_install',
        value: formData.get('warranty_activation_self_install') === 'on' ? 'true' : 'false',
        type: 'boolean'
      },
      order
    ),
    getMetafieldValue(
      'warrantyActivationMileage',
      {
        key: 'warranty_activation_mileage',
        value: formData.get('warranty_activation_mileage') as string | null,
        type: 'number_integer'
      },
      order
    ),
    getMetafieldValue(
      'warrantyActivationVIN',
      {
        key: 'warranty_activation_vin',
        value: formData.get('warranty_activation_vin') as string | null,
        type: 'single_line_text_field'
      },
      order
    )
  ];

  const shouldSetWarrantyStatusToActivated = WARRANTY_FIELDS.every((field) =>
    metafields.find(({ key }) => (Array.isArray(field) ? field.includes(key) : key === field))
  );

  if (shouldSetWarrantyStatusToActivated) {
    metafields.push(
      getMetafieldValue(
        'warrantyStatus',
        {
          key: 'warranty_status',
          value: WarrantyStatus.Activated,
          type: 'single_line_text_field'
        },
        order
      )
    );
  }

  try {
    await updateOrderMetafields({
      orderId: order.id,
      metafields
    });

    revalidateTag(TAGS.orderMetafields);
  } catch (error) {
    console.log('activateWarranty action', error);
  }
};

async function generateOrderConfirmationPDF(
  order: Order,
  content: OrderConfirmationContent,
  signature1: string,
  signature2: string,
  signDate: string
) {
  return renderToBuffer(
    <OrderConfirmationPdf
      order={order}
      content={content}
      signature1={signature1}
      signature2={signature2}
      date={signDate}
    />
  );
}

export const fetchOrderConfirmationContent = cache(async () => {
  return getOrderConfirmationContent();
});

type ConfirmOrderOptions = {
  order: Order;
  content: OrderConfirmationContent;
  formData: FormData;
};

export const confirmOrder = async ({ order, content, formData }: ConfirmOrderOptions) => {
  const signature1 = formData.get('signature1') as string;
  const signature2 = formData.get('signature2') as string;
  const signDate = formData.get('date') as string;

  const pdfBuffer = await generateOrderConfirmationPDF(
    order,
    content,
    signature1,
    signature2,
    signDate
  );

  const fileName = `${new Date().getTime()}-${order.name}-signaturePdf.pdf`;
  const file = new File([pdfBuffer], fileName, { type: 'application/pdf' });

  const confirmationPDFId = await handleUploadFile({ file });

  const rawFormData = [
    {
      key: 'customer_confirmation',
      value: confirmationPDFId,
      type: 'file_reference',
      namespace: 'custom'
    }
  ];

  try {
    await updateOrderMetafields({
      orderId: order.id,
      metafields: rawFormData
    });

    revalidateTag(TAGS.orderMetafields);
  } catch (error) {
    console.log('activateWarranty action', error);
  }
};

export async function returnCore(order: Order, formData: FormData) {
  const metafields = [
    getMetafieldValue(
      'coreReturnName',
      {
        key: 'core_return_name',
        value: formData.get('name') as string | null,
        type: 'single_line_text_field'
      },
      order
    ),
    getMetafieldValue(
      'coreReturnEmail',
      {
        key: 'core_return_email',
        value: formData.get('email') as string | null,
        type: 'single_line_text_field'
      },
      order
    ),
    getMetafieldValue(
      'coreReturnPhone',
      {
        key: 'core_return_phone',
        value: formData.get('phone') as string | null,
        type: 'single_line_text_field'
      },
      order
    ),
    getMetafieldValue(
      'coreReturnAddress',
      {
        key: 'core_return_address',
        value: formData.get('address') as string | null,
        type: 'single_line_text_field'
      },
      order
    ),
    getMetafieldValue(
      'coreReturnCity',
      {
        key: 'core_return_city',
        value: formData.get('city') as string | null,
        type: 'single_line_text_field'
      },
      order
    ),
    getMetafieldValue(
      'coreReturnState',
      {
        key: 'core_return_state',
        value: formData.get('state[code]') as string | null,
        type: 'single_line_text_field'
      },
      order
    ),
    getMetafieldValue(
      'coreReturnZip',
      {
        key: 'core_return_zip',
        value: formData.get('zip') as string | null,
        type: 'single_line_text_field'
      },
      order
    )
  ];

  const shouldSetCoreStatusToReturned = CORE_RETURN_FIELDS.every((field) =>
    metafields.find(({ key }) => (Array.isArray(field) ? field.includes(key) : key === field))
  );

  if (shouldSetCoreStatusToReturned) {
    metafields.push(
      getMetafieldValue(
        'coreReturnStatus',
        {
          key: 'core_status',
          value: CoreReturnStatus.PickupRequested,
          type: 'single_line_text_field'
        },
        order
      )
    );
  }

  try {
    await updateOrderMetafields({
      orderId: order.id,
      metafields
    });

    revalidateTag(TAGS.orderMetafields);
  } catch (error) {
    console.log('activateWarranty action', error);
  }
}
