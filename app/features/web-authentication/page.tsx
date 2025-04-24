"use client";
import { useState } from "react";

const WebAuthnPage = () => {
  const [credential, setCredential] = useState<PublicKeyCredential | null>(
    null
  );

  const registerCredential = async () => {
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
    }
  };

  const authenticate = async () => {
    const publicKey = {
      challenge: new Uint8Array(32), // Replace with a secure random challenge
      allowCredentials: [
        {
          id: credential?.rawId as ArrayBuffer,
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
    }
  };

  const removeCredential = () => {
    setCredential(null);
  };

  const arrayBufferToHex = (buffer: ArrayBuffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Web Authentication</h1>
      <p className="text-muted-foreground">
        Register a credential using the button below and choose if you would
        like to authenticate using FaceID, your fingerprint or USB Security Key.
      </p>
      <button onClick={registerCredential} className="btn">
        Register Credential
      </button>
      {credential && (
        <div>
          <p>Current Credential ID: {credential.id}</p>
          <p>Current Credential Type: {credential.type}</p>
          <p>Current Credential Raw ID: {arrayBufferToHex(credential.rawId)}</p>
          <button onClick={removeCredential} className="btn">
            Remove Credential
          </button>
          <button onClick={authenticate} className="btn">
            Authenticate
          </button>
        </div>
      )}
    </div>
  );
};

export default WebAuthnPage;
