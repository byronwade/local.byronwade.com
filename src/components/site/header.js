"use client";

import React from "react";
import { usePathname } from "next/navigation";
import UnifiedHeader from "@components/shared/unified-header";

export default function Header() {
  const pathname = usePathname();
  
  // Hide header on slideshow route
  if (pathname === "/slideshow") {
    return null;
  }

  // Determine if we're on store pages to show cart
  const isStorePage = pathname.startsWith("/store");
  
  return (
    <UnifiedHeader
      dashboardType="site"
      showCompanySelector={false}
      showSearch={true}
      showCart={isStorePage}
      customTitle="Thorbis"
      customSubtitle="Local Business Directory"
    />
  );
}