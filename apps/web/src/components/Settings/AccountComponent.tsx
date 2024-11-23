'use client';

import { useMutation, useQuery } from '@apollo/client';
import { ArrowLeftIcon, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FadeLoader } from 'react-spinners';
import { UPDATE_SUBSCRIPTION } from '../../graphql/mutations';
import { GET_USER_BY_ID, GET_USER_SUBSCRIPTION } from '../../graphql/queries';
import { useToast } from '../../hooks/use-toast';
import useUser from '../../hooks/useGetUser';
import ChangeAuthDetails from '../ChangeAuthDetails/ChangeAuthDetails';
import PlanSelector from '../Plans/PlanSelector';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import BillingDetails from './ManageBilling';

const AccountComponent = () => {
  const { getUserId } = useUser();
  const userId = getUserId();

  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    refetch,
  } = useQuery(GET_USER_SUBSCRIPTION, {
    variables: { userId: userId },
    onCompleted: (data) => {
      setPlan(data.getUserSubscription);
    },
  });

  const handleRefetch = async () => {
    const result = await refetch();
    setPlan(result.data.getUserSubscription);
  };

  const { data: userData, loading: userLoading } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const subscriptionId =
    subscriptionData?.getUserSubscription?.stripeSubscriptionId;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [plan, setPlan] = useState(subscriptionData?.getUserSubscription);

  const { toast } = useToast();

  const planCancelled = plan?.cancelAtCurrentPeriodEnd === true;

  const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION, {
    onCompleted: () => {
      handleRefetch();
      router.refresh();
      setLoading(false);
      toast({
        description: `${plan?.planName} Plan ${!planCancelled ? 'Cancelled' : 'Resumed'} successfully.`,
      });
    },
  });

  if (subscriptionLoading || userLoading) {
    return (
      <div className="mb-20 flex items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-28">
        <FadeLoader color="#d51b1b" height={25} />
      </div>
    );
  }

  const email = userData?.getUserById?.email;

  const getDisplayQuality = (planName: string) => {
    switch (planName) {
      case 'Premium':
        return (
          <p>
            ULTRA <span className="font-semibold"> HD</span>
          </p>
        );
      case 'Standard':
        return (
          <p>
            FULL <span className="font-semibold"> HD</span>{' '}
          </p>
        );
      case 'Basic':
        return <p className="font-semibold">HD</p>;
      case 'Mobile':
        return <p className="font-semibold">SD</p>;
      default:
        return <p>{planName}</p>;
    }
  };

  const handleSubscriptionAction = async (action: 'cancel' | 'resume') => {
    if (subscriptionId) {
      setLoading(true);
      const requestData = {
        action: action,
        stripeSubscriptionId: subscriptionId,
        userId: userId,
        stripePriceId: plan?.stripePriceId || '',
        priceId: plan?.priceId || '',
        stripeCurrentPeriodEnd: plan?.stripeCurrentPeriodEnd || new Date(),
        videoQuality: plan?.videoQuality || '',
        planPrice: plan?.planPrice || '',
        planName: plan?.planName || '',
        status: plan?.status || '',
        cancelAtCurrentPeriodEnd: plan?.cancelAtCurrentPeriodEnd || false,
      };

      updateSubscription({
        variables: { updateUserSubscriptionInput: requestData },
      });
    }
  };

  const handleCancelSubscription = () => handleSubscriptionAction('cancel');
  const handleResumeSubscription = () => handleSubscriptionAction('resume');

  if (isChangingPlan) {
    return (
      <div className="flex flex-col items-center justify-center bg-transparent pt-20 sm:pt-28">
        <div className="flex w-full pl-2 sm:pl-16">
          <Button
            onClick={() => {
              setIsChangingPlan(false);
            }}
            className="my-5  flex h-10 w-10 justify-center rounded-full p-0"
          >
            <ArrowLeftIcon />
          </Button>
        </div>
        <PlanSelector
          activePlan={plan}
          setIsChangingPlan={setIsChangingPlan}
          handleRefetch={handleRefetch}
        />
      </div>
    );
  }

  if (isChangingEmail || isChangingPassword) {
    return (
      <div className="flex items-center justify-center bg-transparent pt-24 sm:pt-36">
        <ChangeAuthDetails
          isChangingEmail={isChangingEmail}
          isChangingPassword={isChangingPassword}
          setIsChangingEmail={setIsChangingEmail}
          setIsChangingPassword={setIsChangingPassword}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24">
      <p className="my-5 w-full pl-6 text-left text-2xl font-medium sm:mb-7 sm:text-3xl md:pl-12 md:text-4xl xl:mb-10 xl:pl-40">
        Account
      </p>
      <Card className="mb-5 flex w-[95vw] flex-col items-start justify-center border border-neutral-500 sm:w-[90vw] xl:w-[75vw] dark:border-neutral-300">
        <CardContent className="w-full text-lg">
          <h1 className="pb-3 pt-5 font-semibold text-neutral-600 dark:text-neutral-400">
            MEMBERSHIP & BILLING
          </h1>
          <p className="pb-2 font-bold">{email}</p>
          <p className="border-b border-neutral-400 pb-3 text-neutral-600 dark:text-neutral-400">
            Password: *********
          </p>
          <button
            className="flex w-full items-center justify-between border-b border-neutral-400 py-3 "
            onClick={() => setIsChangingEmail(true)}
          >
            <span>Change account email</span>
            <ChevronRight />
          </button>
          <button
            className="flex w-full items-center justify-between border-b border-neutral-400 py-3"
            onClick={() => setIsChangingPassword(true)}
          >
            <span>Change password</span>
            <ChevronRight />
          </button>
          <div className=" pb-5 pt-3">
            <h1 className="pb-4 font-semibold text-neutral-600 dark:text-neutral-400">
              PLAN DETAILS
            </h1>
            <div className="flex flex-col justify-start sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-row items-center justify-between sm:justify-start">
                <div className="flex flex-row justify-start">
                  <p>{plan?.planName} </p>
                  <div className="mx-2 rounded-md border-2 border-black px-1 py-0 dark:border-white">
                    {getDisplayQuality(plan?.planName)}
                  </div>
                </div>
                <p>
                  {' '}
                  @ <span className="font-bold italic">${plan?.planPrice}</span>
                </p>
              </div>
              <Button
                className="mt-4 w-full text-lg sm:mt-0 sm:w-auto"
                onClick={() => {
                  setIsChangingPlan(true);
                }}
              >
                Change Plan
              </Button>
            </div>
          </div>

          <BillingDetails
            plan={plan}
            loading={loading}
            handleCancelSubscription={handleCancelSubscription}
            handleResumeSubscription={handleResumeSubscription}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountComponent;
