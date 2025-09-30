import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "./ui/card";
import { LinkAuthenticationElement } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import sampleImage from '../assets/sampleimg.jpeg';

import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const formatPrice = (priceInCents) => {
  return (priceInCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "SGD",
  });
};

const CheckoutForm = ({notes: note}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paymentSuccess`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
        
    } else {
      toast.success('Successful')
    }
    setIsLoading(false);

  };
    const paymentElementOptions: StripePaymentElementOptions = {
        layout: 'tabs'
    };

    return (
    
        <div className="m-12 w-full flex md:flex-row flex-col justify-center space-y-10 md:space-x-10">
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
          {note.tags.map((tag:any, index:any) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
          <Separator/>
        {/* Action Button and Price */}
        <div className="w-full flex justify-between items-center">
          <span className="text-xl font-bold">
            Price {formatPrice(note.price)}
          </span>
        </div>
      </CardFooter>
    </Card>
            <form id="payment-form" onSubmit={handleSubmit} className=" pl-2 w-full md:pt-2 md:w-1/2">
                <div className="flex flex-row w-3/4">
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
                                className={`px-4 py-2 text-white font-bold rounded`}
                            >
                                Pay
                            </Button>

                            <Button
                                disabled={isLoading || !stripe || !elements}
                                variant="destructive"
                                className={`px-4 py-2 text-white font-bold rounded  hover:bg-red-600 ${
                                    isLoading || !stripe || !elements ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                                onClick={()=>{}}
                            >
                                Cancel
                            </Button>
                        </div>

                        {/* Show any error or success messages */}
                        {message && <div id="payment-message" className="mt-2 text-red-500">{message}</div>}
                    </div>
                </div>
            </form>
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
          {note.tags.map((tag:any, index:any) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
          <Separator/>
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