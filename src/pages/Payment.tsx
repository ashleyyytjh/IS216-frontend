
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { createOrder } from "@/services/OrdersService";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getNotesById } from "@/services/NotesService";
import { toast } from "sonner";
import CheckoutForm from "@/components/Checkout";
import getStripe from "@/utils/stripe";
import { getUser } from "@/services/UserService";
import { Progress } from "@/components/ui/progress";
import { CardDescription } from "@/components/ui/card";
import { GetNotesRes } from "@/types/requests/notes";

const Payment = () => {
    const stripePromise = getStripe()
    const [clientSecret, setClientSecret] = useState<string>("");
    const [note, setNote]=useState<GetNotesRes|null>(null);
    const [searchParams] = useSearchParams();
    const noteId = searchParams.get('id'); // "68b98faba389fd1819c78c17"
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

// http://localhost:5173/payment?id=68b98faba389fd1819c78c17
    useEffect(() => {
        const fetchData = async () => {
            try {
                const note = await getNotesById(noteId || "");
                console.log('note collected' , note);
                const timer = setTimeout(() => {
                    setProgress(40);
                }, 500)
                const user = await getUser();
                // console.log(user)
                const orderDTO = {
                    note_id: noteId,
                    buyer_id: user.sub,
                    price: note?.price,
                }
                const timer3 = setTimeout(() => {
                }, 800)
                const timer2 = setTimeout(() => {
                    setProgress(100);

                }, 1200)
                const cs = await createOrder(orderDTO);
                setNote(note ?? null);
                setClientSecret(cs);
                // console.log('clientSecret'+ cs)

                return () => {
                    clearTimeout(timer);
                    clearTimeout(timer2);
                    clearTimeout(timer3);
                };
            } catch (error) {
                toast.error('Error ordering notes, please try again');
                navigate('/home');
            }
       
        }

        fetchData();
    },[])

    const appearance = {
        theme: 'stripe',
    };
    
    const options = {
        clientSecret,
        appearance,
    };
    return (
    <>
        {clientSecret && note ? (
        /* @ts-ignore */
        <Elements options={options} stripe={stripePromise}>
            <CheckoutForm notes={note} />
        </Elements>
        ) : (
        // If not, show the loading indicator
        <div className="flex flex-col justify-center items-center w-3/4 h-screen mx-auto">
            <Progress className="w-3/4" value={progress} />
            <CardDescription>Loading Payment Details...</CardDescription>
        </div>
        )}
    </>
    );
}


export default Payment

