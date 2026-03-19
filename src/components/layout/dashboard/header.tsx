"use client";
import { useAuthContext } from "@/components/auth/context";
import LogoutButton from "@/components/auth/logout-button";
import { NavbarWorkspaceSwitcher } from "./navbar-workspace";

function AppHeader() {
  const { user } = useAuthContext();
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <NavbarWorkspaceSwitcher />
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Workspace</a>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline btn-secondary "
          >
            <div className="text-sm font-semibold">{user?.nameDisplay}</div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
