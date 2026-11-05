import { redirect } from "next/navigation";

// Legacy duplicate route. The navbar links to /manage-events, which is the
// maintained Manage Events page, so forward any old links there.
export default function ManageEventPage() {
  redirect("/manage-events");
}
