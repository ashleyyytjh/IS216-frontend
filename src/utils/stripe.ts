import { Stripe, loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

const getStripe = () => {
    const key = import.meta.env.VITE_STRIPE_PROMISE
    if (!key) {
        throw new Error(
            'Stripe Publishable Key not defined in environment variables.'
        )
    }
    if (!stripePromise) {
        stripePromise = loadStripe(key)
    }
    return stripePromise
}

export default getStripe