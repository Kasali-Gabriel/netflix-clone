import { Inject, Injectable } from '@nestjs/common';
import { CreateUserSubscriptionInput } from 'src/user-subscription/dto/create-subscription.input';
import { UpdateUserSubscriptionInput } from 'src/user-subscription/dto/update-subscription.input';
import { UserSubscriptionService } from 'src/user-subscription/user-subscription.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import { CreateSubscriptionInput } from './dto/create-stripe.input';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    @Inject(UserSubscriptionService)
    private readonly subscriptionService: UserSubscriptionService,
    private readonly userService: UserService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
      apiVersion: '2024-10-28.acacia',
      typescript: true,
    });
  }

  verifyWebhookSignature(
    stripeSignature: string,
    payload: string,
    endpointSecret: string,
  ): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        stripeSignature,
        endpointSecret,
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
  }

  private absoluteUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
    }
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async createSubscription(createSubscriptionInput: CreateSubscriptionInput) {
    const { userId, planName, price, videoQuality, priceId } =
      createSubscriptionInput;
    const userSubscription =
      await this.subscriptionService.getUserSubscription(userId);

    const user = await this.userService.getUserById(userId);
    const email = user.email;

    if (userSubscription?.stripeCustomerId) {
      const stripeSession = await this.stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: this.absoluteUrl('/profiles'),
      });
      return { url: stripeSession.url };
    }

    const stripeSession = await this.stripe.checkout.sessions.create({
      success_url: this.absoluteUrl('/profiles'),
      cancel_url: this.absoluteUrl('/SignUp/planform'),
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      billing_address_collection: 'auto',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, videoQuality, planName, price },
    });

    return { url: stripeSession.url };
  }

  async getPaymentMethodDetails(customerId: string) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      if (paymentMethods.data.length > 0) {
        const { card } = paymentMethods.data[0];
        return {
          brand: card?.brand ?? 'Unknown',
          last4: card?.last4 ?? 'Unknown',
          exp_month: card?.exp_month ?? 0,
          exp_year: card?.exp_year ?? 0,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('[STRIPE_ERROR]', error);
      throw new Error('Unable to retrieve payment method details');
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    const createUserSubscriptionInput: CreateUserSubscriptionInput = {
      userId: session.metadata.userId,
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      videoQuality: session.metadata.videoQuality,
      planPrice: session.metadata.price,
      planName: session.metadata.planName,
      cancelAtCurrentPeriodEnd: subscription.cancel_at_period_end,
    };

    await this.subscriptionService.createUserSubscription(
      createUserSubscriptionInput,
    );
  }

  async updateSubscription(
    updateUserSubscriptionInput: UpdateUserSubscriptionInput,
  ) {
    const {
      action,
      videoQuality,
      planPrice,
      planName,
      userId,
      priceId,
      stripeSubscriptionId,
    } = updateUserSubscriptionInput;

    const subscription =
      await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    let updatedSubscription: Stripe.Subscription;
    switch (action) {
      case 'upgrade':
        updatedSubscription = await this.stripe.subscriptions.update(
          stripeSubscriptionId,
          {
            items: [{ id: subscription.items.data[0].id, price: priceId }],
            metadata: { action, planPrice, planName, videoQuality, userId },
            proration_behavior: 'always_invoice',
            cancel_at_period_end: false,
          },
        );
        break;

      case 'cancel':
        updatedSubscription = await this.stripe.subscriptions.update(
          stripeSubscriptionId,
          {
            cancel_at_period_end: true,
            metadata: { action, userId },
          },
        );
        break;

      case 'resume':
        updatedSubscription = await this.stripe.subscriptions.update(
          stripeSubscriptionId,
          {
            cancel_at_period_end: false,
            metadata: { action, userId },
          },
        );
        break;

      default:
        throw new Error('Invalid action');
    }

    await this.handleSubscriptionUpdated(updatedSubscription);
    return updatedSubscription;
  }

  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const updateData: UpdateUserSubscriptionInput = {
      userId: subscription.metadata.userId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      cancelAtCurrentPeriodEnd: subscription.cancel_at_period_end,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };

    if (subscription.metadata.action === 'upgrade') {
      updateData.videoQuality = subscription.metadata.videoQuality;
      updateData.planPrice = subscription.metadata.planPrice;
      updateData.planName = subscription.metadata.planName;
      updateData.stripePriceId = subscription.items.data[0].price.id;
    }

    await this.subscriptionService.updateUserSubscription(updateData);
  }

  async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscription = await this.stripe.subscriptions.retrieve(
      invoice.subscription as string,
    );

    await this.subscriptionService.updateUserSubscription({
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      status: subscription.status,
      cancelAtCurrentPeriodEnd: subscription.cancel_at_period_end,
    });
  }

  async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await this.stripe.subscriptions.retrieve(
      invoice.subscription as string,
    );

    await this.subscriptionService.updateUserSubscription({
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      cancelAtCurrentPeriodEnd: true,
    });
  }
}
