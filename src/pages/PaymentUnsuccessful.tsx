import { XCircle, RotateCcw, MessageCircle } from "lucide-react";
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

export function PaymentUnsuccessful() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-lg border-red-200">
        <CardHeader className="items-center text-center p-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/50">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400 animate-shake" />
          </div>
          <CardTitle className="text-3xl font-bold text-red-700 dark:text-red-400 mt-4">
            Payment Failed
          </CardTitle>
          <CardDescription className="text-lg pt-2">
            We couldn't process your payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground text-center">
            Please check your card details or try a different payment method. If the issue persists, contact support.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 p-6">
            <Button className="w-full" asChild>
            <a href="/home">
              Home
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
