import Stripe from 'stripe';
import config from '.';
export const stripe = new Stripe(String(config.STRIPE_SECRET_KEY));
