import { redirect } from "next/navigation";

export default function SecureControlIndex() {
  redirect("/secure-control/dashboard");
}
