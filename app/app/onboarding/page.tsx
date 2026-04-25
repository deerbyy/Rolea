import { OnboardingWizard } from "@/components/onboarding-wizard";
import { Suspense } from "react";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Suspense fallback={<div className="glass rounded-3xl p-6">Загружаем мастер истории...</div>}>
        <OnboardingWizard />
      </Suspense>
    </div>
  );
}
