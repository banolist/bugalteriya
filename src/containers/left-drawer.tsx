import { Link } from "@tanstack/react-router";
import IcBaselineClose from "~icons/ic/baseline-close?width=24px&height=24px";

interface Route {
  path: string;
  icon?: any;
  text: string;
}
const routes: Route[] = [
  {
    path: "/app",
    icon: null,
    text: "Панель инструментов",
  },
  {
    path: "/app/transactions",
    icon: null,
    text: "Учет операций",
  },
  {
    path: "/app/products",
    icon: null,
    text: "Продукты",
  },
  {
    path: "/app/salary",
    icon: null,
    text: "Зарплаты",
  },
  {
    path: "/app/employee",
    icon: null,
    text: "Сотрудники",
  },
];

const LeftDrawer = ({ children }: { children: any }) => {
  const close = () => {
    document.getElementById("my-drawer")?.click();
  };
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div id="content" className="drawer-content flex flex-col">
        {children}
      </div>
      <div className="drawer-side z-30">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="navbar text-xl font-semibold">
          Учет операций бугалтерии
        </div>
        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 overflow-y-auto">
          <button
            className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
            onClick={close}
          >
            <IcBaselineClose />
          </button>
          {routes.map((route) => (
            <li key={route.text}>
              <Link to={route.path}>
                {route.icon && <route.icon className="size-6" />}
                <span>{route.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftDrawer;
