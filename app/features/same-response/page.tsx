import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResponsesAreSameExample from "./components/ResponsesAreSameExample";

const SameResponsePage = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Compare Responses</CardTitle>
          <CardDescription>
            Test how service workers can compare responses using
            responsesAreSame
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsesAreSameExample />
        </CardContent>
      </Card>
    </>
  );
};

export default SameResponsePage;
