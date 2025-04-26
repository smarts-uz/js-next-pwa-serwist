import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyResponseDemo } from "@/components/CopyResponseDemo";

export default function CopyResponsePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Copy Response</CardTitle>
        <CardDescription>
          Test how service workers can copy and modify responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CopyResponseDemo />
      </CardContent>
    </Card>
  );
}
