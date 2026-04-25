import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SoonButton } from "@/components/soon-button";

const plans = [
  {
    name: "Free",
    price: "0 ₽",
    badge: null,
    accent: "bg-surface-2/40",
    features: ["20 AI-сцен в месяц", "3 активные истории", "Базовая память сцены"]
  },
  {
    name: "Creator",
    price: "399 ₽",
    badge: "Лучший старт",
    accent: "bg-accent/18",
    features: [
      "300 AI-сцен в месяц",
      "Неограниченные черновики",
      "Расширенная память персонажей"
    ]
  },
  {
    name: "Pro",
    price: "799 ₽",
    badge: null,
    accent: "bg-ember/15",
    features: [
      "1000 AI-сцен в месяц",
      "Приоритетные генерации",
      "Публичные шаблоны и расширенный лор"
    ]
  }
];

export default function BillingPage() {
  return (
    <PageContainer>
      <header className="reveal-up mb-8">
        <p className="inline-block bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-sm font-semibold uppercase tracking-[0.18em] text-transparent">Подписка</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Тарифы Rolea</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Stripe уже заложен в архитектуру, а кнопки оплаты сейчас показывают понятное Soon-состояние.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`glass hover-lift reveal-up rounded-3xl p-6 ${plan.accent} reveal-delay-${Math.min(index + 1, 3)}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl md:text-4xl">{plan.name}</h2>
              {plan.badge && (
                <span className="rounded-full bg-accent/30 px-3 py-1 text-xs text-accent-ring">
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="mt-5 font-serif text-4xl md:text-5xl">{plan.price}</p>
            <p className="mt-1 text-sm text-subtle">в месяц</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <p key={feature} className="flex items-center gap-3 text-sm text-muted">
                  <Check className="text-accent-ring" size={17} /> {feature}
                </p>
              ))}
            </div>
            <SoonButton className="mt-7 w-full">
              <CreditCard size={16} /> Выбрать тариф
            </SoonButton>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="glass hover-lift rounded-2xl p-5">
          <Zap className="icon-breathe text-accent-ring" />
          <p className="mt-4 font-serif text-3xl">64%</p>
          <p className="mt-1 text-sm text-muted">использовано лимита demo-истории</p>
        </div>
        <div className="glass hover-lift rounded-2xl p-5">
          <Sparkles className="icon-breathe text-accent-ring" />
          <p className="mt-4 font-serif text-3xl">Gemini Flash</p>
          <p className="mt-1 text-sm text-muted">модель берётся из GEMINI_MODEL</p>
        </div>
        <div className="glass hover-lift rounded-2xl p-5">
          <CreditCard className="icon-breathe text-accent-ring" />
          <p className="mt-4 font-serif text-3xl">Stripe</p>
          <p className="mt-1 text-sm text-muted">webhook готов для будущей оплаты</p>
        </div>
      </section>
    </PageContainer>
  );
}
