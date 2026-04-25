import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { SoonButton } from "@/components/soon-button";

const plans = [
  {
    name: "Free",
    price: "0 ₽",
    accent: "bg-white/[0.04]",
    features: ["20 AI-сцен в месяц", "3 активные истории", "Базовая память сцены"]
  },
  {
    name: "Creator",
    price: "399 ₽",
    accent: "bg-violet-500/18",
    features: ["300 AI-сцен в месяц", "Неограниченные черновики", "Расширенная память персонажей"]
  },
  {
    name: "Pro",
    price: "799 ₽",
    accent: "bg-amber-300/12",
    features: ["1000 AI-сцен в месяц", "Приоритетные генерации", "Публичные шаблоны и расширенный лор"]
  }
];

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="reveal-up mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Подписка</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">Тарифы Rolea</h1>
        <p className="mt-4 max-w-2xl text-white/62">
          Stripe уже заложен в архитектуру, а кнопки оплаты сейчас показывают понятное `Soon`-состояние.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`glass hover-lift reveal-up rounded-3xl p-6 ${plan.accent} reveal-delay-${Math.min(index + 1, 3)}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-4xl">{plan.name}</h2>
              {plan.name === "Creator" && (
                <span className="rounded-full bg-violet-500/30 px-3 py-1 text-xs text-violet-100">Лучший старт</span>
              )}
            </div>
            <p className="mt-5 font-serif text-5xl">{plan.price}</p>
            <p className="mt-1 text-sm text-white/45">в месяц</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <p key={feature} className="flex items-center gap-3 text-sm text-white/68">
                  <Check className="text-violet-300" size={17} /> {feature}
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
          <Zap className="icon-breathe text-violet-300" />
          <p className="mt-4 font-serif text-3xl">64%</p>
          <p className="mt-1 text-sm text-white/58">использовано лимита demo-истории</p>
        </div>
        <div className="glass hover-lift rounded-2xl p-5">
          <Sparkles className="icon-breathe text-violet-300" />
          <p className="mt-4 font-serif text-3xl">Gemini Flash</p>
          <p className="mt-1 text-sm text-white/58">модель берется из `GEMINI_MODEL`</p>
        </div>
        <div className="glass hover-lift rounded-2xl p-5">
          <CreditCard className="icon-breathe text-violet-300" />
          <p className="mt-4 font-serif text-3xl">Stripe</p>
          <p className="mt-1 text-sm text-white/58">webhook готов для будущей оплаты</p>
        </div>
      </section>
    </div>
  );
}
