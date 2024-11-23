import {
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Controller('stripe-webhook')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') stripeSignature: string,
    @Res() res: Response,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      // Verify the webhook signature
      const event = this.stripeService.verifyWebhookSignature(
        stripeSignature,
        req.rawBody.toString(),
        endpointSecret,
      );

      // Route the event to the correct handler
      switch (event.type) {
        case 'checkout.session.completed':
          await this.stripeService.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;
        case 'customer.subscription.updated':
          await this.stripeService.handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription,
          );
          break;
        case 'invoice.paid':
          await this.stripeService.handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice,
          );
          break;
        case 'invoice.payment_failed':
          await this.stripeService.handleInvoicePaymentFailed(
            event.data.object as Stripe.Invoice,
          );
          break;
        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }

      return res.status(HttpStatus.OK).json({ received: true });
    } catch (err) {
      console.error('Error processing webhook:', err.message);
      throw new HttpException(
        { error: 'Webhook processing failed', details: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
