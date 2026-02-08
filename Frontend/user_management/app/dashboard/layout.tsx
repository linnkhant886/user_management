import DashboardLayoutClient from "@/components/layoutcomponents/DashboardLayoutClient";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <Toaster
      position="top-right"
      richColors
      closeButton
    />
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  </>
  );
}
