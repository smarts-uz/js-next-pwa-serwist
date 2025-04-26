import { Suspense } from "react";
import FeatureCard from "@/components/FeatureCard";
import NetworkStatus from "@/components/NetworkStatus";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featureCategories, benefits } from "./features";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Next.js Serwist PWA</h1>
        <p className="text-muted-foreground mb-4">
          A comprehensive Progressive Web App with advanced features
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <PWAInstallPrompt />
        </Suspense>
      </div>

      <NetworkStatus className="mb-8" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Features</CardTitle>
          <CardDescription>Complete list of PWA capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {featureCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-lg font-semibold mb-4">{category.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.features.map((feature) => (
                    <FeatureCard
                      key={feature.title}
                      title={feature.title}
                      description={feature.description}
                      icon={<feature.icon className="h-6 w-6" />}
                      href={feature.href}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PWA Benefits</CardTitle>
          <CardDescription>
            Why Progressive Web Apps are the future
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start space-x-4">
              <benefit.icon className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
