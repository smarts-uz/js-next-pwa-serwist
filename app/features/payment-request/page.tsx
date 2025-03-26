"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CreditCard, Apple, Info, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Test card numbers for different scenarios
const TEST_CARDS = {
  SUCCESS: "4242 4242 4242 4242",
  DECLINED: "4000 0000 0000 0002",
  INSUFFICIENT: "4000 0000 0000 9995",
  AUTH_REQUIRED: "4000 0000 0000 3220",
  NETWORK_ERROR: "4000 0000 0000 9999"
};

// Payment method definitions
const PAYMENT_METHODS = {
  CARD: {
    supportedMethods: "basic-card",
    data: {
      supportedNetworks: ["visa", "mastercard", "amex", "discover"],
      supportedTypes: ["credit", "debit"]
    }
  },
  APPLE_PAY: {
    supportedMethods: "https://apple.com/apple-pay",
    data: {
      version: 3,
      merchantIdentifier: "merchant.example.com",
      merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
      supportedNetworks: ["amex", "discover", "masterCard", "visa"],
      countryCode: "US",
    }
  }
};

const PaymentRequestPage = () => {
  const [paymentSupported, setPaymentSupported] = useState(false);
  const [applePaySupported, setApplePaySupported] = useState(false);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>("SUCCESS");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.PaymentRequest) {
        setPaymentSupported(true);
        checkPaymentMethod(PAYMENT_METHODS.APPLE_PAY).then(setApplePaySupported);
      }
    }
  }, []);

  const checkPaymentMethod = async (method: any) => {
    try {
      const request = new PaymentRequest([method], {
        total: { label: "Test", amount: { currency: "USD", value: "0.00" } }
      });
      const result = await request.canMakePayment();
      return !!result;
    } catch (error) {
      console.log(`Payment method check error:`, error);
      return false;
    }
  };

  const handlePayment = async (method: any) => {
    if (!window.PaymentRequest) {
      setStatus("Payment Request API is not supported in this browser");
      return;
    }

    try {
      setIsProcessing(true);
      setStatus("");

      const paymentDetails = {
        total: {
          label: "Example Store",
          amount: { currency: "USD", value: "10.00" }
        },
        displayItems: [
          {
            label: "Premium Product",
            amount: { currency: "USD", value: "10.00" }
          }
        ]
      };

      const options = {
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true
      };

      // Create payment request with the method
      const paymentRequest = new PaymentRequest([method], paymentDetails, options);
      
      // Check if payment can be made
      const canMakePayment = await paymentRequest.canMakePayment();
      if (!canMakePayment) {
        throw new Error("This payment method is not supported in your browser");
      }

      // Show payment sheet
      const paymentResponse = await paymentRequest.show();
      
      // Process payment based on selected test card
      console.log("Payment response:", paymentResponse);
      setStatus("Payment successful! Processing...");
      
      // Simulate different payment scenarios
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (selectedCard) {
        case "DECLINED":
          await paymentResponse.complete("fail");
          setStatus("Payment declined. Please try a different card.");
          break;
        case "INSUFFICIENT":
          await paymentResponse.complete("fail");
          setStatus("Insufficient funds. Please try a different card.");
          break;
        case "AUTH_REQUIRED":
          await paymentResponse.complete("fail");
          setStatus("3D Secure authentication required. Please try again.");
          break;
        case "NETWORK_ERROR":
          await paymentResponse.complete("fail");
          setStatus("Network error. Please try again later.");
          break;
        default:
          await paymentResponse.complete("success");
          setStatus("Payment completed successfully!");
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      setStatus(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Payment Request API Demo</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Test different payment scenarios with the Payment Request API
        </p>
      </div>
      
      {!paymentSupported && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Supported</AlertTitle>
          <AlertDescription>
            Your browser doesn't support the Payment Request API. Please try Chrome, Edge, or Safari.
          </AlertDescription>
        </Alert>
      )}
      
      {status && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Cards</CardTitle>
          <CardDescription>Select a test card to simulate different payment scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(TEST_CARDS).map(([key, number]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedCard === key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedCard(key)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-muted-foreground">{number}</p>
                  </div>
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handlePayment(PAYMENT_METHODS.CARD)}
            disabled={!paymentSupported || isProcessing}
            className="w-full"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Test Payment
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Apple Pay</CardTitle>
          <CardDescription>Test Apple Pay integration (Safari only)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Apple Pay is only available in Safari on macOS and iOS devices.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handlePayment(PAYMENT_METHODS.APPLE_PAY)}
            disabled={!applePaySupported || isProcessing}
            className="w-full"
          >
            <Apple className="mr-2 h-4 w-4" />
            Test Apple Pay
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Test Card Information</CardTitle>
          <CardDescription>Details about the test cards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Success Card (4242 4242 4242 4242)</h3>
              <p className="text-sm text-muted-foreground">
                This card will always succeed. Use it to test successful payments.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Declined Card (4000 0000 0000 0002)</h3>
              <p className="text-sm text-muted-foreground">
                This card will always be declined. Use it to test error handling.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Insufficient Funds (4000 0000 0000 9995)</h3>
              <p className="text-sm text-muted-foreground">
                This card will fail due to insufficient funds.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">3D Secure Required (4000 0000 0000 3220)</h3>
              <p className="text-sm text-muted-foreground">
                This card requires 3D Secure authentication.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Network Error (4000 0000 0000 9999)</h3>
              <p className="text-sm text-muted-foreground">
                This card will simulate a network error.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRequestPage;
