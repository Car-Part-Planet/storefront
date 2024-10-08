import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Banner from 'components/banner';
import Divider from 'components/divider';
import Navbar from 'components/layout/navbar';
import ActivateWarranty from 'components/orders/activate-warranty';
import CoreReturn from 'components/orders/core-return';
import MobileOrderActions from 'components/orders/mobile-order-actions';
import OrderConfirmation from 'components/orders/order-confirmation';
import OrderStatuses from 'components/orders/order-statuses';
import OrdersHeader from 'components/orders/orders-header';
import PhoneButton from 'components/phone-button';
import Price from 'components/price';
import { Button } from 'components/ui';
import { getCustomerOrders } from 'lib/shopify';
import { toPrintDate } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default async function AccountPage() {
  const orders = await getCustomerOrders();

  return (
    <>
      <header>
        <Banner />
        <Navbar />
      </header>
      <main className="max-h-full overflow-auto">
        <div className="py-5 sm:py-10">
          <OrdersHeader />
          <div className="mt-10">
            <h2 className="sr-only">Recent orders</h2>
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
              <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                {orders.map((order) => (
                  <div
                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                    key={order.normalizedId}
                  >
                    <h3 className="sr-only">
                      Order placed on <time dateTime={order.createdAt}>{order.createdAt}</time>
                    </h3>
                    <div className="flex items-center p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                      <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                        <div>
                          <dt className="font-medium text-gray-900">Order</dt>
                          <dd className="mt-1 text-gray-500">{order.name}</dd>
                        </div>
                        <div className="hidden sm:block">
                          <dt className="font-medium text-gray-900">Date placed</dt>
                          <dd className="mt-1 text-gray-500">
                            <time dateTime={order.createdAt}>{toPrintDate(order.createdAt)}</time>
                          </dd>
                        </div>
                        {order.totalPrice && (
                          <div>
                            <dt className="font-medium text-gray-900">Total amount</dt>
                            <Price
                              as="dd"
                              className="mt-1 font-medium text-gray-900"
                              amount={order.totalPrice.amount}
                              currencyCode={order.totalPrice.currencyCode}
                            />
                          </div>
                        )}
                      </dl>

                      <MobileOrderActions order={order} />

                      <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                        <Link
                          href={`/account/orders/${order.normalizedId}`}
                          passHref
                          legacyBehavior
                        >
                          <Button as="a">
                            View Order
                            <span className="sr-only">{order.normalizedId}</span>
                          </Button>
                        </Link>
                        <ActivateWarranty order={order} />
                        <OrderConfirmation order={order} />
                        <CoreReturn order={order} />
                      </div>
                    </div>
                    <div className="p-4 pt-0 sm:p-6 sm:pt-0">
                      <OrderStatuses order={order} className="flex flex-wrap gap-4" />
                    </div>
                    <Divider hasSpacing={false} />

                    <h4 className="sr-only">Items</h4>
                    <ul role="list" className="divide-y divide-gray-200">
                      {order.lineItems.map((item) => (
                        <li key={item.id} className="p-4 sm:p-6">
                          <div className="flex items-center sm:items-start">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {item.image ? (
                                <Image
                                  src={item.image.url}
                                  width={item.image.width}
                                  height={item.image.height}
                                  alt={item.image.altText || item.title || 'Product Image'}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div
                                  className="flex h-full w-full items-center justify-center"
                                  title="Missing Product Image"
                                >
                                  <InformationCircleIcon className="size-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-6 flex-1 text-sm">
                              <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                <h5>{item.title}</h5>
                                {item.price && <Price {...item.price} className="mt-2 sm:mt-0" />}
                              </div>
                              <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                {item.variantTitle}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <PhoneButton />
      </main>
    </>
  );
}
