import { redirect } from "next/navigation";


// maintained Manage Events page, so forward any old links there.
export default function ManageEventPage() {
  redirect("/manage-events");
}
