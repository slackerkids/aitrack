export default function NavbarClient() {
  return (
    <div className="navbar bg-base-100 fixed z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Diagnosis</a>
            </li>
            <li>
              <a>Appointment</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-3xl font-bold bg-gradient-to-tr from-green-400 via-green-300 to-green-500 text-transparent bg-clip-text">
          HealHunter Patient
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/client">Home</a>
          </li>
          <li>
            <a href="/client/diagnosis">Diagnosis</a>
          </li>
          <li>
            <a href="/client/appointment">Appointment</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>
  );
}
