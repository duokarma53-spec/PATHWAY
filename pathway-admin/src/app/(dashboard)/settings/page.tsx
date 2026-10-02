import { SettingsClientView } from "./settings-client";

export const metadata = {
  title: "Account Settings | Pathway CRM",
  description: "Manage admin profile details, contact email, and system credentials.",
};

export default function SettingsPage() {
  return <SettingsClientView />;
}
