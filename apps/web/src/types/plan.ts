export interface ManageBillingProps {
  plan: {
    planName: string;
    planPrice: string;
    stripeSubscriptionId: string;
    cancelAtCurrentPeriodEnd: boolean;
    stripeCurrentPeriodEnd: Date;
    stripeCustomerId: string;
  };
  loading: boolean;
  handleCancelSubscription: () => void;
  handleResumeSubscription: () => void;
}

export interface SelectedPlan {
  value: string;
  planPrice: string;
  videoQuality: string;
  priceId: string;
}

export interface PlanDetail {
  title: string;
  content: string;
}

export interface Plan {
  value: string;
  title: string;
  subtitle: string;
  priceId: string;
  details: PlanDetail[];
}

export interface UserSubscription {
  planName: string;
  stripeSubscriptionId: string;
}

export interface PlanSelectorProps {
  activePlan?: UserSubscription;
  setIsChangingPlan?: (value: boolean) => void;
  handleRefetch?: () => void;
}
