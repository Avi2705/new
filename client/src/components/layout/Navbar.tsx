import { useAuth } from "../../hooks/useAuth";
import CustomerNavbar from "./CustomerNavbar";
import VendorNavbar from "./VendorNavbar";

export default function Navbar() {
  const { role } = useAuth();

  if (role === "vendor") {
    return <VendorNavbar />;
  }

  return <CustomerNavbar />;
}
