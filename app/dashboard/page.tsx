import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${APP_NAME} dashboard`,
  description: "dashboard page",
};

export default async function DashboardPage() {
  return (
    <div className="w-full min-h-full flex items-center justify-center">
      dashboard page
    </div>
  );
}
