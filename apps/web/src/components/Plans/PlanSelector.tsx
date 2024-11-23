import { useMutation } from '@apollo/client';
import { CheckCircle2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  CREATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION,
} from '../../graphql/mutations';
import { useToast } from '../../hooks/use-toast';
import {
  Plan,
  PlanSelectorProps,
  SelectedPlan,
  UserSubscription,
} from '../../types/plan';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getSession } from './../../lib/session';
import { planData } from './planData';

const PlanSelector = ({
  activePlan,
  setIsChangingPlan,
  handleRefetch,
}: PlanSelectorProps) => {
  const plansData = useMemo(() => planData, []);
  const [clickedCard, setClickedCard] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>();
  const router = useRouter();
  const { toast } = useToast();

  const filteredPlansData = useMemo(() => {
    if (activePlan) {
      return plansData.filter((plan) => plan.value !== activePlan.planName);
    }
    return plansData;
  }, [activePlan, plansData]);

  useEffect(() => {
    if (filteredPlansData.length > 0) {
      const firstPlan = filteredPlansData[0];
      setClickedCard(firstPlan.value);
      updateSelectedPlan(firstPlan);
    }
  }, [filteredPlansData]);

  useEffect(() => {
    const selectedPlanData = filteredPlansData.find(
      (plan) => plan.value === clickedCard,
    );
    if (selectedPlanData) {
      updateSelectedPlan(selectedPlanData);
    }
  }, [clickedCard, filteredPlansData]);

  const updateSelectedPlan = (plan: Plan) => {
    const monthlyPriceDetail = plan.details.find(
      (detail) => detail.title === 'Monthly prices',
    );
    setSelectedPlan({
      ...plan,
      planPrice: monthlyPriceDetail ? monthlyPriceDetail.content : '',
      videoQuality:
        plan.details.find((detail) => detail.title === 'Video quality')
          ?.content || '',
      priceId: plan.priceId,
    });
  };

  const [createSubscription, { loading }] = useMutation(CREATE_SUBSCRIPTION, {
    onCompleted: (data) => {
      window.location.href = data.createSubscription;
    },
    onError: (error) => {
      console.error('STRIPE_CLIENT_ERROR', error);
    },
  });

  const [updateSubscription, { loading: updateLoading }] = useMutation(
    UPDATE_SUBSCRIPTION,
    {
      onCompleted: () => {
        if (setIsChangingPlan && handleRefetch) {
          handleRefetch();
          setIsChangingPlan(false);
          toast({
            description: (
              <span>
                Plan changed to{' '}
                <span className="text-lg font-bold sm:text-xl">
                  {selectedPlan?.value}
                </span>{' '}
                successfully.
              </span>
            ),
          });
        }
        router.refresh();
      },
      onError: (error) => {
        console.error('STRIPE_CLIENT_ERROR', error);
      },
    },
  );

  const onSubscribe = async ({
    selectedPlan,
  }: {
    selectedPlan: SelectedPlan;
  }) => {
    const session = await getSession();
    const userId = session?.user?.id;

    const requestData = {
      planName: selectedPlan.value,
      price: selectedPlan.planPrice,
      videoQuality: selectedPlan.videoQuality,
      priceId: selectedPlan.priceId,
      userId: userId,
    };

    createSubscription({ variables: { createSubscriptionInput: requestData } });
  };

  const UpgradePlan = async ({
    selectedPlan,
    activePlan,
  }: {
    selectedPlan: SelectedPlan;
    activePlan: UserSubscription;
  }) => {
    const session = await getSession();
    const userId = session?.user?.id;

    const requestData = {
      planName: selectedPlan.value,
      planPrice: selectedPlan.planPrice,
      videoQuality: selectedPlan.videoQuality,
      priceId: selectedPlan.priceId,
      action: 'upgrade',
      stripeSubscriptionId: activePlan?.stripeSubscriptionId,
      userId: userId,
      stripePriceId: selectedPlan.priceId,
      stripeCurrentPeriodEnd: new Date(),
      status: 'active',
      cancelAtCurrentPeriodEnd: false,
    };

    updateSubscription({
      variables: { updateUserSubscriptionInput: requestData },
    });
  };

  const onSubmit = async () => {
    if (selectedPlan) {
      if (activePlan) {
        await UpgradePlan({ selectedPlan, activePlan });
      } else {
        await onSubscribe({ selectedPlan });
      }
    }
  };

  const content = ({ plan }: { plan: Plan }) => (
    <CardContent className="h-auto gap-2 p-4">
      {plan.details.map((detail, index) => (
        <div
          key={index}
          className={`flex flex-row items-center justify-between text-stone-600 xl:flex-col xl:items-start xl:justify-center ${
            index !== plan.details.length - 1 &&
            'h-[70px] border-b border-stone-400'
          } ${detail.title === 'Supported devices' ? 'xl:h-[90px]' : ' xl:h-[84px]'} py-2`}
        >
          <p className="text-left">{detail.title}</p>
          <p className="text-right font-bold xl:text-start">
            {detail.title === 'Monthly prices'
              ? `$${detail.content}`
              : detail.content}
          </p>
        </div>
      ))}
    </CardContent>
  );

  const pathname = usePathname();
  const accountPath = pathname === '/MyAccount';

  return (
    <div className="flex h-auto flex-col items-center justify-center ">
      {!accountPath && (
        <div className="relative my-4 w-[95vw] items-start justify-center px-4 py-4 text-left sm:w-[80vw] md:px-1 lg:w-[60vw] xl:w-[90vw] xl:px-10">
          <p className="text-sm">
            STEP <span className="font-bold">2</span> OF{' '}
            <span className="font-bold">3</span>
          </p>
          <h1 className="text-2xl font-medium text-zinc-800 sm:text-4xl">
            Choose the plan that&apos;s right for you
          </h1>
        </div>
      )}

      <Tabs
        defaultValue="Premium"
        className="flex w-[95vw] flex-col items-start justify-center sm:w-[80vw] lg:w-[60vw] xl:hidden"
      >
        <TabsList className="grid h-auto w-full grid-cols-4 gap-2 bg-inherit text-white md:gap-4">
          {filteredPlansData.map((plan) => (
            <TabsTrigger
              key={plan.value}
              onClick={() => setClickedCard(plan.value)}
              value={plan.value}
              className="flex h-32 max-w-36 items-start justify-start rounded-xl border border-stone-300 from-blue-900 via-indigo-700 via-30% to-red-800 px-1 py-3  text-black data-[state=active]:bg-gradient-to-br data-[state=active]:text-white md:p-4 dark:text-white "
            >
              <p className="relative h-full w-full text-left text-sm font-medium md:text-base ">
                {plan.title} <br />
                <span className="text-[12px] font-medium">{plan.subtitle}</span>
                <CheckCircle2
                  className={`absolute bottom-0 right-0 ${
                    clickedCard === plan.value ? 'block' : 'hidden'
                  }`}
                />
              </p>
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredPlansData.map((plan) => (
          <TabsContent key={plan.value} value={plan.value}>
            <Card className="sm mt-5 h-full w-[95vw] rounded-none border-none sm:w-[80vw] lg:w-[60vw]">
              {content({ plan })}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mb-10 hidden max-w-[90vw] flex-grow flex-row items-center justify-center xl:flex">
        {filteredPlansData.map((plan) => (
          <Card
            key={plan.value}
            className={`mx-2 mt-4 flex h-[740px] flex-col rounded-2xl bg-white p-2 ${
              clickedCard === plan.value ? 'shadow-primary shadow-lg' : ''
            }`}
            onClick={() => setClickedCard(plan.value)}
          >
            <CardHeader
              className={`relative flex h-24 w-full rounded-xl border border-stone-300 bg-gradient-to-br from-blue-900  via-indigo-700 via-30%  px-4 py-2 text-white ${
                clickedCard === plan.value ? 'to-red-800' : 'to-blue-500'
              }`}
            >
              <CardTitle className="relative flex h-full items-start justify-start">
                <p className="relative h-full w-full text-left text-2xl font-medium">
                  {plan.title} <br />
                  <span className="text-base font-medium">{plan.subtitle}</span>
                  <CheckCircle2
                    className={`absolute bottom-0 right-0 ${
                      clickedCard === plan.value ? 'block' : 'hidden'
                    }`}
                  />
                </p>
              </CardTitle>
            </CardHeader>

            {content({ plan })}
          </Card>
        ))}
      </div>

      <div className="relative my-5 w-[95vw] px-4 text-left sm:w-[80vw] md:px-1 lg:w-[60vw] xl:w-[90vw] xl:px-10">
        {!accountPath && (
          <p>
            HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability
            subject to your internet service and device capabilities. Not all
            content is available in all resolutions. See our Terms of Use for
            more details. Only people who live with you may use your account.
            Watch on 4 different devices at the same time with Premium, 2 with
            Standard, and 1 with Basic and Mobile.
          </p>
        )}

        <div className="mb-2 flex items-center justify-center">
          <Button
            onClick={onSubmit}
            disabled={loading || updateLoading}
            className="mt-2 h-14 w-full rounded-none bg-[#CC0000] text-lg font-bold text-white hover:bg-[#990000] md:w-[80%] xl:w-[40%]"
          >
            {accountPath ? 'Change Plan' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelector;
