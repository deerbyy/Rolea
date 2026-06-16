import { AppShell } from "@/components/app-shell";
import { StoriesProvider } from "@/lib/stories-store";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoriesProvider>
      <AppShell>{children}</AppShell>
    </StoriesProvider>
  );
}
