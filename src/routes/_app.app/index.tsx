import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import FinancialChart from "~/components/FinancialChart";
import FinancialChartPie from "~/components/FinancialChartPie";
import FinancialLineChart from "~/components/FinancialLineChart";
import { useDatabase } from "~/context/databaseContext";
import IcBaselineCurrencyRuble from "~icons/ic/baseline-currency-ruble";

export const Route = createFileRoute("/_app/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const db = useDatabase();
  const queryOperations = useQuery({
    queryKey: ["operations"],
    queryFn: async () => await db.financialOperations.select(),
  });
  const queryEmployee = useQuery({
    queryKey: ["employee"],
    queryFn: async () => await db.employees.select(),
  });
  const queryProducts = useQuery({
    queryKey: ["products"],
    queryFn: async () => await db.products.select(),
  });
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Панель инструментов</h1>
      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Всего сотрудников</div>
            <div className="stat-value text-primary">
              {queryEmployee.data?.length}
            </div>
            {/* <div className="stat-desc">За последний год +3</div> */}
            <IcBaselineCurrencyRuble className="stat-figure size-8" />
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Всего продуктов</div>
            <div className="stat-value text-secondary">
              {queryProducts.data?.length}
            </div>
            {/* <div className="stat-desc">↗︎ 5 (10%)</div> */}
            <IcBaselineCurrencyRuble className="stat-figure size-8" />
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Общая стоимость</div>
            <div className="stat-value">
              {queryProducts.data
                ?.map((v) => v.price)
                .reduce((perv, cur) => perv + cur)}
              ₽
            </div>
            {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
            <IcBaselineCurrencyRuble className="stat-figure size-8" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {!queryOperations.isLoading && queryOperations.data && (
          <>
            <FinancialChart data={queryOperations.data} />
            <FinancialChartPie data={queryOperations.data} />
          </>
        )}
      </div>

      <div className="flex w-full items-center justify-center">
        {!queryOperations.isLoading && queryOperations.data && (
          <FinancialLineChart data={queryOperations.data} />
        )}
      </div>
    </>
  );
}
