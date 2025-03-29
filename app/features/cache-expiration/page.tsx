import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CacheExpirationDemo } from "@/components/CacheExpirationDemo";

export default function CacheExpirationPage() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Cache Expiration</CardTitle>
          <CardDescription>
            Test cache expiration with a 1-minute lifetime for API responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CacheExpirationDemo />
        </CardContent>
      </Card>
    </div>
  );
}
