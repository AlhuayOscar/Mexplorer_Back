import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Logo from "@/components/Logo";
import { withSwal } from "react-sweetalert2";
import TourIcon from "@mui/icons-material/Tour";
import BookIcon from "@mui/icons-material/Book";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LinkIcon from "@mui/icons-material/Link";
import ReviewsIcon from "@mui/icons-material/Reviews";
function Nav({ show, swal }) {
  const inactiveLink = "flex gap-1 p-1";
  const activeLink = inactiveLink + " bg-highlight text-black rounded-lg";
  const inactiveIcon = "w-6 h-6";
  const activeIcon = inactiveIcon + " text-primary";
  const router = useRouter();
  const { pathname } = router;
  async function logout() {
    swal
      .fire({
        title: "¿Estás seguro?",
        text: `¿Querés cerrar sesión?`,
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Sí, salir",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await router.push("/");
          await signOut();
        }
      });
  }
  const showNavFromLocalStorage = localStorage.getItem("showNav");
  const showNav = showNavFromLocalStorage === "true"; // Convertimos el valor a booleano

  return (
    <aside
      className={
        (showNav ? "left-0" : "-left-full") +
        " top-0 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all"
      }
    >
      <div className="mb-4 mr-4">
        <Logo />
      </div>
      <nav className="flex flex-col gap-2">
        <Link
          href={"/"}
          className={`${
            pathname === "/" ? activeLink : inactiveLink
          } transform transition-transform duration-100`}
          onMouseEnter={(e) => {
            e.target.classList.add("scale-110");
          }}
          onMouseLeave={(e) => {
            e.target.classList.remove("scale-110");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={pathname === "/" ? activeIcon : inactiveIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Panel Principal
        </Link>
        <Link
          href={"/tours"}
          className={`${
            pathname.includes("/tours") ? activeLink : inactiveLink
          } transform transition-transform duration-100`}
          onMouseEnter={(e) => {
            e.target.classList.add("scale-110");
          }}
          onMouseLeave={(e) => {
            e.target.classList.remove("scale-110");
          }}
        >
          <TourIcon />
          Tours
        </Link>
        <Link
          href={"/review"}
          className={`${
            pathname.includes("/review") ? activeLink : inactiveLink
          } transform transition-transform duration-100`}
          onMouseEnter={(e) => {
            e.target.classList.add("scale-110");
          }}
          onMouseLeave={(e) => {
            e.target.classList.remove("scale-110");
          }}
        >
          <ReviewsIcon />
          Review
        </Link>
        <Link
          href={"/blogs"}
          className={`${
            pathname.includes("/blogs") ? activeLink : inactiveLink
          } transform transition-transform duration-100`}
          onMouseEnter={(e) => {
            e.target.classList.add("scale-110");
          }}
          onMouseLeave={(e) => {
            e.target.classList.remove("scale-110");
          }}
        >
          <BookIcon />
          Blogs
        </Link>
        <Link
          href={"/orders"}
          className={`${
            pathname.includes("/orders") ? activeLink : inactiveLink
          } transform transition-transform duration-300`}
          onMouseEnter={(e) => {
            e.target.classList.add("scale-110");
          }}
          onMouseLeave={(e) => {
            e.target.classList.remove("scale-110");
          }}
        >
          <ReceiptLongIcon />
          Ordenes
        </Link>
        <Link
          href={"/reservation"}
          className={`${
            pathname.includes("/reservation") ? activeLink : inactiveLink
          } transform transition-transform duration-300`}
          onMouseEnter={(e) => {
            e.target.classList.add("scale-110");
          }}
          onMouseLeave={(e) => {
            e.target.classList.remove("scale-110");
          }}
        >
          <AutoStoriesIcon />
          Reservas
        </Link>
        <Link
          href={"/settings"}
          className={`${
            pathname.includes("/settings") ? activeLink : inactiveLink
          } transform transition-transform duration-300`}
          onMouseEnter={(e) => {
            e.target.classList.add("scale-110");
          }}
          onMouseLeave={(e) => {
            e.target.classList.remove("scale-110");
          }}
        >
          <LinkIcon />
          Enlaces
        </Link>
        <button
          onClick={logout}
          className={`${inactiveLink} transform transition-transform duration-300`}
          onMouseEnter={(e) => {
            e.target.classList.add("scale-110");
          }}
          onMouseLeave={(e) => {
            e.target.classList.remove("scale-110");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Salir
        </button>
      </nav>
    </aside>
  );
}

export default withSwal(({ swal }, ref) => <Nav swal={swal} />);
