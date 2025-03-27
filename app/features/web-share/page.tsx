import React from 'react';
import WebShareExample from '@/components/WebShareExample';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const WebSharePage: React.FC = () => {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Web Share API</h1>
                <p className="text-muted-foreground">
                    The Web Share API allows web apps to share content with other apps installed on the user's device.
                </p>
            </div>

            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Browser Support</AlertTitle>
                <AlertDescription>
                    The Web Share API is supported in most modern browsers, particularly on mobile devices. 
                    It requires HTTPS and is most commonly used on mobile platforms.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle>Interactive Demo</CardTitle>
                    <CardDescription>Try sharing content with different options</CardDescription>
                </CardHeader>
                <CardContent>
                    <WebShareExample />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>Reference guide for the Web Share API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Methods</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><code>navigator.share(data)</code> - Share content with other apps</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Parameters</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><code>title</code> - Title of the shared content</li>
                            <li><code>text</code> - Description or text to share</li>
                            <li><code>url</code> - URL to share</li>
                            <li><code>files</code> - Array of files to share (optional)</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>HTTPS connection</li>
                            <li>User interaction (click, tap)</li>
                            <li>Browser support</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WebSharePage;
