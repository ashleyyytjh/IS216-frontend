import { CheckCircle2 } from "lucide-react";
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

export function PaymentSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center p-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold">
            Payment Successful
          </CardTitle>
          <CardDescription className="text-lg pt-2">
            Thank you for your purchase!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Separator className="mb-6" />
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-medium text-foreground">$99.99</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-medium text-foreground">
                Visa ending in 1234
              </span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-medium text-foreground">
                #12345-67890
              </span>
            </div>
          </div>
          <Separator className="mt-6" />
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 p-6">
          <Button className="w-full" asChild>
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            A receipt has been sent to your email. If you have any questions,
            please contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
