import LeftDrawer from "./left-drawer";
import Navbar from "./navbar";
export const Layout = (props: { children: any }) => {
  return (
    <LeftDrawer>
      <Navbar />
      <main className="w-full h-full flex flex-col gap-2 p-2">
        {props.children}
      </main>
    </LeftDrawer>
  );
};
