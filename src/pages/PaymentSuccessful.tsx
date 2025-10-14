import { CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";
import { format } from "path";

// Dummy data to illustrate the new information displayed.
// In a real application, you would pass this data as props.
const orderDetails = {
  orderNumber: "ORD123456789",
  purchaseDate: "October 8, 2025",
  items: [
    { name: "Advanced Web Development Notes", price: "$15.00" },
    { name: "Data Structures & Algorithms Cheatsheet", price: "$10.00" },
  ],
  total: "$25.00",
  paymentMethod: "Visa ending in 4242",
};


export function PaymentSuccess() {

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const noteName = params.get("note_name");
  const price = params.get("price");

  const formattedPrice = (Number(price) / 100).toFixed(2);

  const today = new Date();

  let day = String(today.getDate()).padStart(2, '0');
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let year = today.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  console.log(formattedDate);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg rounded-xl shadow-2xl">
        <CardHeader className="text-center p-8 bg-gray-50/50 dark:bg-gray-800/20 rounded-t-xl">
          {/* Animated Checkmark for better user feedback */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400 animate-pulse" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold">
            Payment Successful
          </CardTitle>
          <CardDescription className="mt-2 text-md text-muted-foreground">
            Thank you! Your order is confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purchase Date</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{noteName}</span>
              <span className="text-muted-foreground">${formattedPrice}</span>
            </div>

            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${formattedPrice}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-2">
              <span>Paid with Stripe.</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-8 bg-gray-50/50 dark:bg-gray-800/20 rounded-b-xl">
          <Button className="w-full" asChild>
            <a href="/profile">
              View Purchased Notes <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Go to profile to download your notes!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
