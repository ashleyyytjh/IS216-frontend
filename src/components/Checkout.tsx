import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { LinkAuthenticationElement } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import sampleImage from '../assets/sampleimg.jpeg';

import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formatPrice = (priceInCents) => {
  return (priceInCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "SGD",
  });
};

const CheckoutForm = ({ notes: note }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
    console.log(note)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paymentSuccess?note_id=${note.id}&note_name=${encodeURIComponent(note.originalName)}&price=${note.price}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      navigate('/paymentUnsuccessful');
      toast.error("Payment failed. Please try again.");
    } else {
      toast.success('Payment successful! Enjoy your notes!');
    }
    setIsLoading(false);

  };
  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs'
  };

  return (

<div
  className="
    w-full 
    flex flex-col
    justify-center items-center
    gap-8
    px-4
    max-w-3xl mx-auto
    mt-8 mb-12
  "
>
  {/* --- Note Card --- */}
  <div className="w-full flex justify-center px-4">
    <Card className="w-full flex flex-col border h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{note.module}</Badge>
          <span className="text-xs text-muted-foreground">
            PDF • {(note.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
        <CardTitle className="text-lg font-bold">{note.originalName}</CardTitle>
        <img
          src={sampleImage}
          alt="Preview Of Notes"
          className="w-3/4 md:w-1/2 rounded-lg shadow-lg mx-auto md:mx-0"
        />
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {note.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag: any, index: any) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <Separator />
        <div className="w-full flex justify-between items-center">
          <span className="text-xl font-bold">
            Price {formatPrice(note.price)}
          </span>
        </div>
      </CardFooter>
    </Card>
  </div>

  {/* --- Payment Form --- */}
  <div className="w-full flex justify-center px-4">
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="w-full flex flex-col h-full overflow-hidden transition-all"
    >
      <div className="w-full">
        <div className="pb-2">
          <LinkAuthenticationElement id="link-authentication-element" />
        </div>

        <PaymentElement id="payment-element" options={paymentElementOptions} />

        <div className="mt-5 flex justify-between">
          <Button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            type="submit"
            className="px-4 py-2 text-white font-bold rounded !text-sm"
          >
            Pay
          </Button>

          <Button
            disabled={isLoading || !stripe || !elements}
            variant="destructive"
            className={`px-4 py-2 text-white font-bold !text-sm rounded hover:bg-red-600 ${
              isLoading || !stripe || !elements
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={() => {}}
          >
            Cancel
          </Button>
        </div>

        {message && (
          <div id="payment-message" className="mt-2 text-red-500">
            {message}
          </div>
        )}
      </div>
    </form>
  </div>
</div>
  );
};


const NoteCard = ({ note }) => {
  return (
    <Card className="w-full max-w-sm flex flex-col border h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Card Header with Module Badge and Title */}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{note.module}</Badge>
          <span className="text-xs text-muted-foreground">PDF &bull; {(note.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <CardTitle className="text-lg font-bold ">
          {note.originalName}
        </CardTitle>
        <img
          src={sampleImage}
          alt="Preview Of Notes"
          className="w-1/2 rounded-lg shadow-lg"
        />
      </CardHeader>

      {/* Card Content with Description */}
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {note.description}
        </p>
      </CardContent>

      {/* Card Footer with Tags and Purchase Action */}
      <CardFooter className="flex flex-col items-start gap-4 pt-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag: any, index: any) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <Separator />
        {/* Action Button and Price */}
        <div className="w-full flex justify-between items-center">
          <span className="text-xl font-bold">
            Price {formatPrice(note.price)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CheckoutForm