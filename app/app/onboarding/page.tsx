import { Suspense } from "react";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { PageContainer } from "@/components/ui/page-container";

export default function OnboardingPage() {
  return (
    <PageContainer>
      <Suspense
        fallback={
          <div className="glass rounded-3xl p-6 text-muted">Загружаем мастер истории…</div>
        }
      >
        <OnboardingWizard />
      </Suspense>
    </PageContainer>
  );
}
