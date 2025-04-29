"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Shield, ShieldCheck, ShieldX } from "lucide-react";

const WebAuthnPage = () => {
  const [credential, setCredential] = useState<PublicKeyCredential | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerCredential = async () => {
    setIsLoading(true);
    setError(null);

    const publicKey = {
      challenge: new Uint8Array(32), // Replace with a secure random challenge
      rp: { name: "Your App Name" },
      user: {
        id: new Uint8Array(32), // Replace with user ID
        name: "user@example.com",
        displayName: "User Name",
      },
      pubKeyCredParams: [
        {
          type: "public-key" as const,
          alg: -7, // ECDSA with SHA-256
        },
      ],
      timeout: 60000,
      attestation: "direct" as AttestationConveyancePreference,
    };

    try {
      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential;
      setCredential(credential);
      console.log("Credential registered:", credential);
    } catch (error) {
      console.error("Error registering credential:", error);
      setError(
        error instanceof Error ? error.message : "Failed to register credential"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    if (!credential) return;

    setIsLoading(true);
    setError(null);

    const publicKey = {
      challenge: new Uint8Array(32), // Replace with a secure random challenge
      allowCredentials: [
        {
          id: credential.rawId as ArrayBuffer,
          type: "public-key" as const,
        },
      ],
      timeout: 60000,
    };

    try {
      const assertion = await navigator.credentials.get({ publicKey });
      console.log("Authenticated:", assertion);
    } catch (error) {
      console.error("Error during authentication:", error);
      setError(
        error instanceof Error ? error.message : "Failed to authenticate"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeCredential = () => {
    setCredential(null);
    setError(null);
  };

  const arrayBufferToHex = (buffer: ArrayBuffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Web Authentication
        </h1>
        <p className="text-muted-foreground">
          Register a credential using the button below and choose if you would
          like to authenticate using FaceID, your fingerprint or USB Security
          Key.
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>WebAuth Demo</CardTitle>
          <CardDescription>
            Try registering and authenticating with WebAuthn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 ">
          {error && (
            <Alert variant="destructive">
              <ShieldX className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!credential ? (
            <Button
              onClick={registerCredential}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Register Credential
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Credential Registered</AlertTitle>
                <AlertDescription>
                  Your credential has been successfully registered.
                </AlertDescription>
              </Alert>

              <div className="space-y-2 text-sm">
                <p className="font-medium">Credential Details:</p>
                <div className="rounded-md bg-muted p-3 space-y-1">
                  <p>ID: {credential.id}</p>
                  <p>Type: {credential.type}</p>
                  <p>Raw ID: {arrayBufferToHex(credential.rawId)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={authenticate}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Authenticate
                    </>
                  )}
                </Button>
                <Button
                  onClick={removeCredential}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-min"
                >
                  <ShieldX className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebAuthnPage;
