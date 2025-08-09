import { isEnabled } from "@lib/flags/server";
import Header from "@components/business/header";

export default async function BusinessLayout({ children }) {
  const on = await isEnabled("dashboardCore");
  if (!on) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Dashboard is not available</h1>
        <p className="text-muted-foreground mt-2">Please check back soon.</p>
      </div>
    );
  }

  return (
    <div id="business-root" className="dashboard-fullwidth bg-white dark:bg-neutral-900 min-h-screen">
      <Header />
      <main className="flex flex-col min-h-screen w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
