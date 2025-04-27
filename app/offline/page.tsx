import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <Card className="mx-auto bg-neutral-950 shadow-sm shadow-neutral-100/50 max-w-md flex items-center justify-center min-h-[50vh]">
      <CardHeader className="text-center">
        <WifiOff className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
        <CardTitle className="text-2xl">You're Offline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 mx-auto text-center">
        <p>
          You appear to be offline. Don't worry - you can still access cached
          content and use many features of the app.
        </p>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
