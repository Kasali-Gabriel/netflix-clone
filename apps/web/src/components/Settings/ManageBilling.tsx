import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { useState } from 'react';
import { GET_PAYMENT_METHOD_DETAILS } from '../../graphql/queries';
import { ManageBillingProps } from '../../types/plan';
import { Button } from '../ui/button';

const ManageBilling = ({
  plan,
  loading,
  handleCancelSubscription,
  handleResumeSubscription,
}: ManageBillingProps) => {
  const brandLogos = {
    visa: '/visa-logo-800x450.jpg',
    mastercard: '/Mastercard_new_logo-1200x865.webp',
    'american express': '/public/American-Express-logo.png',
    discover: '/Discover-Card-logo-01.png',
    interac: '/1708016070_aaVYk.webp',
    verve: '/verve.jfif',
  };

  const [cardDetails, setCardDetails] = useState<any>();

  useQuery(GET_PAYMENT_METHOD_DETAILS, {
    variables: { customerId: plan?.stripeCustomerId },
    skip: !plan?.stripeCustomerId,
    onCompleted: (data) => {
      setCardDetails(data.getPaymentMethodDetails);
    },
  });

  const brandLogoUrl =
    brandLogos[cardDetails?.brand?.toLowerCase() as keyof typeof brandLogos];
  const planCancelled = plan?.cancelAtCurrentPeriodEnd === true;

  const formatDate = (date: any) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Invalid date';
  };

  return (
    <div className="border-t border-neutral-400 pb-5 pt-3">
      <h1 className="font-medium text-neutral-700 dark:text-neutral-400">
        Billing Details
      </h1>
      <div className="flex flex-col justify-between sm:flex-row">
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-start py-2 font-medium">
            <Image
              src={brandLogoUrl || '/logo.png'}
              alt={cardDetails?.brand || 'Card brand logo'}
              width={100}
              height={100}
              className="mr-2 h-9 w-16 rounded-md border border-neutral-400 dark:border-neutral-300"
            />
            <span className="-mt-0.5 mr-2 text-xl sm:-mt-1 lg:-mt-2 xl:-mt-1">
              •••• •••• ••••
            </span>
            {cardDetails?.last4}
          </div>
          {planCancelled ? (
            <p>
              Your plan is set to be cancelled on{' '}
              {formatDate(plan?.stripeCurrentPeriodEnd)}.
            </p>
          ) : (
            <p>
              Your next billing date is{' '}
              {formatDate(plan?.stripeCurrentPeriodEnd)}.
            </p>
          )}
        </div>
        <div>
          {!planCancelled ? (
            <Button
              variant="destructive"
              className="my-5 w-full text-lg sm:my-0 sm:w-auto"
              disabled={loading}
              onClick={handleCancelSubscription}
            >
              Cancel Membership
            </Button>
          ) : (
            <Button
              className="my-5 w-full bg-green-600 text-lg hover:bg-green-500 sm:my-0 sm:w-auto"
              disabled={loading}
              onClick={handleResumeSubscription}
            >
              Resume Membership
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBilling;
