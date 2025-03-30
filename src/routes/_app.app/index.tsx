import { createFileRoute } from "@tanstack/react-router";
import FinancialChart from "~/components/FinancialChart";
import IcBaselineCurrencyRuble from "~icons/ic/baseline-currency-ruble";

export const Route = createFileRoute("/_app/app/")({
  component: RouteComponent,
});
const data = [
  {
    id: "",
    date: "",
    amount: 100.5,
    operationType: "Purchase",
    productId: 101,
  },
  {
    id: "",
    date: "",
    amount: 200.75,
    operationType: "Sale",
    productId: 102,
  },
  {
    id: "",
    date: "",
    amount: 150.0,
    operationType: "Refund",
    productId: 103,
  },
];

function RouteComponent() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Панель инструментов</h1>
      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Всего сотрудников</div>
            <div className="stat-value text-primary">{23}</div>
            <div className="stat-desc">За последний год +3</div>
            <IcBaselineCurrencyRuble className="stat-figure size-8" />
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Всего продуктов</div>
            <div className="stat-value text-secondary">{32}</div>
            <div className="stat-desc">↗︎ 5 (10%)</div>
            <IcBaselineCurrencyRuble className="stat-figure size-8" />
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Общая стоимость</div>
            <div className="stat-value">{32423} ₽</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
            <IcBaselineCurrencyRuble className="stat-figure size-8" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <FinancialChart data={data} />
        <FinancialChart data={data} />
      </div>
    </>
  );
}
