import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key');

export class PaymentService {
  // Create payment intent for reservation
  static async createPaymentIntent(reservationData) {
    try {
      const { amount, currency = 'mad', customer, reservation } = reservationData;

      // Convert amount to cents (Stripe uses smallest currency unit)
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        customer: customer?.stripe_customer_id || null,
        description: `KIRASTAY Reservation: ${reservation.number}`,
        metadata: {
          reservation_id: reservation.id.toString(),
          reservation_number: reservation.number,
          agency_id: reservation.agency_id.toString(),
          client_id: reservation.client_id.toString(),
          platform: 'KIRASTAY'
        },
        payment_method_types: ['card'],
        capture_method: 'automatic'
      });

      return {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: amount,
        currency: currency.toUpperCase()
      };

    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw new Error(`Payment setup failed: ${error.message}`);
    }
  }

  // Confirm payment intent
  static async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });

      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        payment_intent: paymentIntent
      };

    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw error;
    }
  }

  // Create customer for future payments
  static async createCustomer(userData) {
    try {
      const customer = await stripe.customers.create({
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        phone: userData.phone_number,
        description: `KIRASTAY Customer - ${userData.user_type}`,
        metadata: {
          user_id: userData.id.toString(),
          platform: 'KIRASTAY'
        }
      });

      return customer;
    } catch (error) {
      console.error('Failed to create Stripe customer:', error);
      throw error;
    }
  }

  // Retrieve payment intent
  static async getPaymentIntent(paymentIntentId) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Failed to retrieve payment intent:', error);
      throw error;
    }
  }

  // Create partial payment (20% minimum)
  static async createPartialPaymentIntent(reservationData, percentage = 20) {
    const partialAmount = (reservationData.amount * percentage) / 100;
    
    return this.createPaymentIntent({
      ...reservationData,
      amount: partialAmount
    });
  }

  // Process refund for cancellation
  static async processRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
        reason: reason,
        metadata: {
          platform: 'KIRASTAY',
          refund_reason: reason
        }
      });

      return {
        success: refund.status === 'succeeded',
        refund_id: refund.id,
        amount: refund.amount / 100, // Convert back to main currency unit
        status: refund.status
      };

    } catch (error) {
      console.error('Refund processing failed:', error);
      throw error;
    }
  }

  // Validate webhook signature
  static verifyWebhookSignature(payload, signature) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw error;
    }
  }

  // Calculate fees and splits for multi-vendor platform
  static calculatePlatformFee(amount, feePercentage = 5) {
    const platformFee = (amount * feePercentage) / 100;
    const agencyAmount = amount - platformFee;
    
    return {
      total_amount: amount,
      platform_fee: platformFee,
      agency_amount: agencyAmount,
      fee_percentage: feePercentage
    };
  }

  // Create connected account for agency (for future platform fee distribution)
  static async createConnectedAccount(agencyData) {
    try {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'MA', // Morocco
        email: agencyData.email,
        business_type: 'company',
        company: {
          name: agencyData.name,
          phone: agencyData.phone,
          address: {
            line1: `${agencyData.address_number} ${agencyData.address_street}`,
            city: agencyData.address_city,
            postal_code: agencyData.address_postal_code,
            state: agencyData.address_state,
            country: 'MA'
          }
        },
        metadata: {
          agency_id: agencyData.id.toString(),
          platform: 'KIRASTAY'
        }
      });

      return account;
    } catch (error) {
      console.error('Failed to create connected account:', error);
      throw error;
    }
  }

  // Generate account link for agency onboarding
  static async createAccountLink(accountId, returnUrl, refreshUrl) {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding'
      });

      return accountLink;
    } catch (error) {
      console.error('Failed to create account link:', error);
      throw error;
    }
  }

  // Simulate VISA payment processing (for demo purposes)
  static simulateVisaPayment(cardData) {
    // This is a simulation - in real implementation, this would interface with actual payment processor
    const { card_number, expiry_month, expiry_year, cvv, cardholder_name } = cardData;
    
    // Basic validation
    if (!card_number || !expiry_month || !expiry_year || !cvv || !cardholder_name) {
      throw new Error('All card details are required');
    }

    // Simulate different card scenarios
    const lastFour = card_number.slice(-4);
    
    // Test card numbers for different scenarios
    const testCards = {
      '4242': { status: 'succeeded', message: 'Payment successful' },
      '4000': { status: 'requires_payment_method', message: 'Card declined' },
      '4100': { status: 'processing', message: 'Payment processing' },
      '4200': { status: 'failed', message: 'Insufficient funds' }
    };

    const result = testCards[lastFour] || testCards['4242'];
    
    return {
      ...result,
      transaction_id: `sim_${Date.now()}`,
      card_last_four: lastFour,
      processed_at: new Date().toISOString()
    };
  }

  // Format amount for display
  static formatAmount(amount, currency = 'MAD') {
    return new Intl.NumberFormat('en-MA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Validate card data
  static validateCardData(cardData) {
    const { card_number, expiry_month, expiry_year, cvv, cardholder_name } = cardData;
    const errors = [];

    if (!card_number || card_number.replace(/\s/g, '').length < 13) {
      errors.push('Valid card number is required');
    }

    if (!expiry_month || expiry_month < 1 || expiry_month > 12) {
      errors.push('Valid expiry month is required');
    }

    if (!expiry_year || expiry_year < new Date().getFullYear()) {
      errors.push('Valid expiry year is required');
    }

    if (!cvv || cvv.length < 3) {
      errors.push('Valid CVV is required');
    }

    if (!cardholder_name || cardholder_name.trim().length < 2) {
      errors.push('Cardholder name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
