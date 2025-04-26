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
  );
}
