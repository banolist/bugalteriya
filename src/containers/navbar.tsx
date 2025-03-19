import IcBaselineMenu from "~icons/ic/baseline-menu?width=24px&height=24px";

const Navbar = () => {
  return (
    <div className="navbar sticky bg-base-500 z-10 shadow-md">
      <div className="flex-1 ">
        <label
          htmlFor="my-drawer"
          className="btn lg:hidden btn-primary drawer-button"
        >
          <IcBaselineMenu className="size-6" />
        </label>
      </div>
    </div>
  );
};

export default Navbar;
