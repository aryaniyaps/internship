import { Separator } from "@/components/ui/separator";
import { SignOut } from "./signout";

export default async function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">user account</h3>
        <p className="text-sm text-muted-foreground">
          manage your user account
        </p>
      </div>
      <Separator />
      <SignOut />
    </div>
  );
}
