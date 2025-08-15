import { Suspense } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Monitor, 
  Printer, 
  Wifi, 
  Shield, 
  Star,
  ArrowRight,
  Package,
  Users,
  Heart,
  Camera,
  Scan,
  Headphones,
  Video,
  Lightbulb,
  TabletSmartphone,
  Building,
  QrCode,
  CalendarClock,
  Utensils,
  Stethoscope,
  GraduationCap,
  Warehouse
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering for real-time inventory
export const dynamic = "force-dynamic";

// Store categories with comprehensive product data based on the 20 categories you specified
const storeCategories = [
  {
    id: "pos-systems",
    name: "POS Systems",
    description: "Complete point-of-sale solutions for modern businesses",
    icon: CreditCard,
    products: [
      {
        id: "thorbis-pos-pro",
        name: "Thorbis POS Pro",
        description: "Advanced point-of-sale system with integrated payment processing",
        price: 1299,
        originalPrice: 1599,
        image: "/placeholder-business.svg",
        features: ["Contactless payments", "Inventory management", "Employee tracking", "Analytics dashboard"],
        rating: 4.8,
        reviewCount: 127,
        inStock: true,
        badge: "Best Seller"
      },
      {
        id: "thorbis-pos-lite",
        name: "Thorbis POS Lite",
        description: "Essential POS system for small businesses",
        price: 799,
        originalPrice: 999,
        image: "/placeholder-business.svg",
        features: ["Basic payments", "Simple inventory", "Receipt printing", "Cloud backup"],
        rating: 4.6,
        reviewCount: 89,
        inStock: true,
        badge: "Popular"
      },
      {
        id: "thorbis-pos-enterprise",
        name: "Thorbis POS Enterprise",
        description: "Enterprise-grade POS for multi-location businesses",
        price: 2499,
        originalPrice: 2999,
        image: "/placeholder-business.svg",
        features: ["Multi-location sync", "Advanced analytics", "API integration", "24/7 support"],
        rating: 4.9,
        reviewCount: 45,
        inStock: true,
        badge: "Enterprise"
      }
    ]
  },
  {
    id: "media-equipment",
    name: "Media Equipment",
    description: "Professional cameras and media production gear",
    icon: Camera,
    products: [
      {
        id: "professional-camera-kit",
        name: "Professional 4K Business Camera Kit",
        description: "Complete 4K camera setup for business video production",
        price: 899,
        originalPrice: 1299,
        image: "/placeholder-camera.svg",
        features: ["4K recording", "Professional lens", "Wireless mic", "Tripod included"],
        rating: 4.7,
        reviewCount: 156,
        inStock: true,
        badge: "Pro"
      },
      {
        id: "live-streaming-kit",
        name: "Live Streaming Kit Pro",
        description: "Professional live streaming setup for businesses",
        price: 699,
        originalPrice: 899,
        image: "/placeholder-camera.svg",
        features: ["HD streaming", "Multiple angles", "Audio mixer", "Lighting kit"],
        rating: 4.5,
        reviewCount: 89,
        inStock: true,
        badge: "Streaming"
      }
    ]
  },
  {
    id: "inventory",
    name: "Inventory",
    description: "Inventory management and tracking solutions",
    icon: Scan,
    products: [
      {
        id: "smart-inventory-scanner",
        name: "AI-Powered Smart Inventory Scanner",
        description: "Intelligent inventory tracking with AI automation",
        price: 249,
        originalPrice: 349,
        image: "/placeholder-scanner.svg",
        features: ["AI-powered scanning", "Real-time sync", "Mobile app", "Cloud storage"],
        rating: 4.8,
        reviewCount: 203,
        inStock: true,
        badge: "AI-Powered"
      },
      {
        id: "inventory-management-system",
        name: "Complete Inventory Management System",
        description: "End-to-end inventory management solution",
        price: 599,
        originalPrice: 799,
        image: "/placeholder-scanner.svg",
        features: ["Multi-location", "Low stock alerts", "Automated ordering", "Analytics"],
        rating: 4.6,
        reviewCount: 134,
        inStock: true,
        badge: "Complete"
      }
    ]
  },
  {
    id: "payments",
    name: "Payments",
    description: "Secure payment processing terminals and solutions",
    icon: CreditCard,
    products: [
      {
        id: "wireless-payment-terminal",
        name: "Wireless Payment Terminal with NFC",
        description: "Secure payment terminal with contactless support",
        price: 149,
        originalPrice: 199,
        image: "/placeholder-terminal.svg",
        features: ["NFC support", "Chip & PIN", "Wireless", "Long battery"],
        rating: 4.5,
        reviewCount: 298,
        inStock: true,
        badge: "Secure"
      },
      {
        id: "mobile-payment-reader",
        name: "Mobile Payment Reader",
        description: "Portable card reader for mobile businesses",
        price: 89,
        originalPrice: 129,
        image: "/placeholder-terminal.svg",
        features: ["Bluetooth", "All card types", "Mobile app", "Same-day funding"],
        rating: 4.4,
        reviewCount: 187,
        inStock: true,
        badge: "Mobile"
      }
    ]
  },
  {
    id: "office",
    name: "Office",
    description: "Office equipment and business productivity tools",
    icon: Printer,
    products: [
      {
        id: "premium-label-printer",
        name: "Premium Thermal Label Printer Pro",
        description: "High-speed thermal label printer for businesses",
        price: 179,
        originalPrice: 249,
        image: "/placeholder-printer.svg",
        features: ["Thermal printing", "High speed", "Multiple sizes", "Easy setup"],
        rating: 4.6,
        reviewCount: 432,
        inStock: true,
        badge: "Fast"
      },
      {
        id: "multifunction-printer",
        name: "Business Multifunction Printer",
        description: "All-in-one printer, scanner, and copier",
        price: 399,
        originalPrice: 499,
        image: "/placeholder-printer.svg",
        features: ["Print, scan, copy", "Wireless", "Duplex printing", "Mobile printing"],
        rating: 4.3,
        reviewCount: 267,
        inStock: true,
        badge: "All-in-One"
      }
    ]
  },
  {
    id: "communication",
    name: "Communication",
    description: "Business communication and audio equipment",
    icon: Headphones,
    products: [
      {
        id: "professional-headset",
        name: "Professional Wireless Business Headset",
        description: "Premium wireless headset for business calls",
        price: 89,
        originalPrice: 129,
        image: "/placeholder-headset.svg",
        features: ["Noise cancelling", "All-day battery", "Multi-device", "HD audio"],
        rating: 4.7,
        reviewCount: 567,
        inStock: true,
        badge: "Premium"
      },
      {
        id: "conference-speaker",
        name: "Business Conference Speaker",
        description: "360-degree conference room speaker system",
        price: 299,
        originalPrice: 399,
        image: "/placeholder-speaker.svg",
        features: ["360° audio", "Echo cancellation", "USB-C", "Touch controls"],
        rating: 4.5,
        reviewCount: 234,
        inStock: true,
        badge: "Conference"
      }
    ]
  },
  {
    id: "displays",
    name: "Displays",
    description: "Digital signage and display solutions",
    icon: Monitor,
    products: [
      {
        id: "digital-signage-display",
        name: "4K Digital Signage Display 43\"",
        description: "Professional 4K display for digital signage",
        price: 599,
        originalPrice: 799,
        image: "/placeholder-display.svg",
        features: ["4K resolution", "24/7 operation", "Remote management", "Built-in media player"],
        rating: 4.4,
        reviewCount: 189,
        inStock: true,
        badge: "4K"
      },
      {
        id: "interactive-display",
        name: "Interactive Touch Display 55\"",
        description: "Large interactive touchscreen for presentations",
        price: 1299,
        originalPrice: 1599,
        image: "/placeholder-display.svg",
        features: ["Multi-touch", "4K display", "Wireless casting", "Collaboration tools"],
        rating: 4.6,
        reviewCount: 124,
        inStock: true,
        badge: "Interactive"
      }
    ]
  },
  {
    id: "fleet",
    name: "Fleet",
    description: "GPS tracking and fleet management solutions",
    icon: Truck,
    products: [
      {
        id: "thorbis-fleet-tracker",
        name: "Thorbis Fleet Tracker",
        description: "Real-time GPS tracking for fleet vehicles",
        price: 299,
        originalPrice: 399,
        image: "/placeholder-business.svg",
        features: ["Real-time GPS", "Route optimization", "Fuel monitoring", "Driver safety"],
        rating: 4.7,
        reviewCount: 156,
        inStock: true,
        badge: "Top Rated"
      },
      {
        id: "fleet-dashcam",
        name: "Fleet Management Dashcam",
        description: "AI-powered dashcam for fleet monitoring",
        price: 199,
        originalPrice: 279,
        image: "/placeholder-camera.svg",
        features: ["AI detection", "Live streaming", "Cloud storage", "Driver alerts"],
        rating: 4.5,
        reviewCount: 178,
        inStock: true,
        badge: "AI-Powered"
      }
    ]
  },
  {
    id: "security",
    name: "Security",
    description: "Security and surveillance systems",
    icon: Shield,
    products: [
      {
        id: "security-camera-system",
        name: "Professional Security Camera System",
        description: "Complete 8-camera security surveillance system",
        price: 899,
        originalPrice: 1199,
        image: "/placeholder-camera.svg",
        features: ["8 cameras", "Night vision", "Motion detection", "Mobile app"],
        rating: 4.6,
        reviewCount: 267,
        inStock: true,
        badge: "Complete System"
      },
      {
        id: "access-control-system",
        name: "Smart Access Control System",
        description: "Keyless entry system with mobile app control",
        price: 399,
        originalPrice: 549,
        image: "/placeholder-scanner.svg",
        features: ["Keyless entry", "Mobile control", "User management", "Audit logs"],
        rating: 4.4,
        reviewCount: 156,
        inStock: true,
        badge: "Smart"
      }
    ]
  },
  {
    id: "networking",
    name: "Networking",
    description: "Network equipment and connectivity solutions",
    icon: Wifi,
    products: [
      {
        id: "business-wifi-router",
        name: "Enterprise WiFi Router System",
        description: "High-performance WiFi 6 router for businesses",
        price: 299,
        originalPrice: 399,
        image: "/placeholder-router.svg",
        features: ["WiFi 6", "Multi-gigabit", "Enterprise security", "Mesh support"],
        rating: 4.5,
        reviewCount: 234,
        inStock: true,
        badge: "WiFi 6"
      },
      {
        id: "network-switch",
        name: "Managed Network Switch 24-Port",
        description: "Professional managed switch for business networks",
        price: 199,
        originalPrice: 279,
        image: "/placeholder-router.svg",
        features: ["24 ports", "Managed", "VLAN support", "PoE+"],
        rating: 4.3,
        reviewCount: 189,
        inStock: true,
        badge: "Managed"
      }
    ]
  },
  {
    id: "audio-visual",
    name: "Audio/Visual",
    description: "Professional audio and video equipment",
    icon: Video,
    products: [
      {
        id: "conference-room-camera",
        name: "4K Conference Room Camera",
        description: "Professional 4K camera for video conferencing",
        price: 599,
        originalPrice: 799,
        image: "/placeholder-camera.svg",
        features: ["4K video", "Auto-tracking", "Wide angle", "USB-C"],
        rating: 4.6,
        reviewCount: 178,
        inStock: true,
        badge: "4K"
      },
      {
        id: "presentation-system",
        name: "Wireless Presentation System",
        description: "Wireless screen sharing and presentation system",
        price: 399,
        originalPrice: 529,
        image: "/placeholder-display.svg",
        features: ["Wireless sharing", "Multi-device", "4K support", "Easy setup"],
        rating: 4.4,
        reviewCount: 145,
        inStock: true,
        badge: "Wireless"
      }
    ]
  },
  {
    id: "lighting",
    name: "Lighting",
    description: "Smart lighting and LED solutions for businesses",
    icon: Lightbulb,
    products: [
      {
        id: "smart-led-panels",
        name: "Smart LED Panel Lighting System",
        description: "Energy-efficient LED panels with smart controls",
        price: 199,
        originalPrice: 279,
        image: "/placeholder-light.svg",
        features: ["Smart controls", "Energy efficient", "Dimming", "Color temperature"],
        rating: 4.5,
        reviewCount: 267,
        inStock: true,
        badge: "Smart"
      },
      {
        id: "track-lighting-system",
        name: "Professional Track Lighting System",
        description: "Adjustable track lighting for retail and offices",
        price: 149,
        originalPrice: 199,
        image: "/placeholder-light.svg",
        features: ["Adjustable", "LED bulbs", "Track system", "Easy installation"],
        rating: 4.3,
        reviewCount: 156,
        inStock: true,
        badge: "Professional"
      }
    ]
  },
  {
    id: "mobile-tablets",
    name: "Mobile & Tablets",
    description: "Business mobile devices and tablets",
    icon: TabletSmartphone,
    products: [
      {
        id: "business-tablet",
        name: "Business Tablet Pro 12\"",
        description: "Professional tablet for business applications",
        price: 699,
        originalPrice: 899,
        image: "/placeholder-tablet.svg",
        features: ["12-inch display", "Business apps", "Long battery", "Rugged design"],
        rating: 4.4,
        reviewCount: 234,
        inStock: true,
        badge: "Professional"
      },
      {
        id: "rugged-smartphone",
        name: "Rugged Business Smartphone",
        description: "Durable smartphone for field workers",
        price: 399,
        originalPrice: 529,
        image: "/placeholder-phone.svg",
        features: ["Rugged design", "Long battery", "PTT button", "Enterprise security"],
        rating: 4.3,
        reviewCount: 178,
        inStock: true,
        badge: "Rugged"
      }
    ]
  },
  {
    id: "kiosks",
    name: "Kiosks",
    description: "Self-service kiosks and interactive terminals",
    icon: Building,
    products: [
      {
        id: "self-service-kiosk",
        name: "Self-Service Payment Kiosk",
        description: "Interactive kiosk for self-service payments",
        price: 2299,
        originalPrice: 2899,
        image: "/placeholder-kiosk.svg",
        features: ["Touch screen", "Payment processing", "Receipt printing", "ADA compliant"],
        rating: 4.5,
        reviewCount: 89,
        inStock: true,
        badge: "Self-Service"
      },
      {
        id: "information-kiosk",
        name: "Digital Information Kiosk",
        description: "Interactive information and wayfinding kiosk",
        price: 1599,
        originalPrice: 1999,
        image: "/placeholder-kiosk.svg",
        features: ["Large display", "Touch interface", "CMS software", "Weather resistant"],
        rating: 4.3,
        reviewCount: 67,
        inStock: true,
        badge: "Interactive"
      }
    ]
  },
  {
    id: "barcode-rfid",
    name: "Barcode/RFID",
    description: "Barcode scanners and RFID tracking solutions",
    icon: QrCode,
    products: [
      {
        id: "thorbis-barcode-scanner",
        name: "Thorbis Barcode Scanner",
        description: "High-performance barcode scanner",
        price: 89,
        originalPrice: 119,
        image: "/placeholder-business.svg",
        features: ["1D/2D scanning", "Wireless connectivity", "Long battery life", "Drop resistant"],
        rating: 4.7,
        reviewCount: 198,
        inStock: true,
        badge: "Fast"
      },
      {
        id: "rfid-tracking-system",
        name: "RFID Asset Tracking System",
        description: "Complete RFID system for asset tracking",
        price: 599,
        originalPrice: 799,
        image: "/placeholder-scanner.svg",
        features: ["RFID tags", "Reader system", "Software included", "Real-time tracking"],
        rating: 4.4,
        reviewCount: 134,
        inStock: true,
        badge: "Complete"
      }
    ]
  },
  {
    id: "time-attendance",
    name: "Time & Attendance",
    description: "Employee time tracking and attendance systems",
    icon: CalendarClock,
    products: [
      {
        id: "biometric-time-clock",
        name: "Biometric Time Clock System",
        description: "Fingerprint-based employee time tracking",
        price: 299,
        originalPrice: 399,
        image: "/placeholder-scanner.svg",
        features: ["Fingerprint scanner", "Cloud sync", "Payroll integration", "Mobile app"],
        rating: 4.5,
        reviewCount: 267,
        inStock: true,
        badge: "Biometric"
      },
      {
        id: "facial-recognition-clock",
        name: "Facial Recognition Time Clock",
        description: "AI-powered facial recognition attendance system",
        price: 499,
        originalPrice: 649,
        image: "/placeholder-camera.svg",
        features: ["Face recognition", "No contact", "Temperature check", "Mask detection"],
        rating: 4.6,
        reviewCount: 189,
        inStock: true,
        badge: "AI-Powered"
      }
    ]
  },
  {
    id: "hospitality",
    name: "Hospitality",
    description: "Restaurant and hotel technology solutions",
    icon: Utensils,
    products: [
      {
        id: "restaurant-pos-system",
        name: "Restaurant POS System",
        description: "Complete POS system designed for restaurants",
        price: 899,
        originalPrice: 1199,
        image: "/placeholder-business.svg",
        features: ["Kitchen display", "Order management", "Table service", "Inventory tracking"],
        rating: 4.7,
        reviewCount: 234,
        inStock: true,
        badge: "Restaurant"
      },
      {
        id: "hotel-management-system",
        name: "Hotel Management Software",
        description: "Comprehensive hotel management platform",
        price: 1299,
        originalPrice: 1699,
        image: "/placeholder-business.svg",
        features: ["Booking system", "Room management", "Guest services", "Reporting"],
        rating: 4.5,
        reviewCount: 156,
        inStock: true,
        badge: "Hotel"
      }
    ]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical technology and healthcare equipment",
    icon: Stethoscope,
    products: [
      {
        id: "medical-tablet",
        name: "Medical Grade Tablet",
        description: "HIPAA-compliant tablet for healthcare professionals",
        price: 799,
        originalPrice: 999,
        image: "/placeholder-tablet.svg",
        features: ["HIPAA compliant", "Antimicrobial coating", "Long battery", "Medical apps"],
        rating: 4.6,
        reviewCount: 178,
        inStock: true,
        badge: "Medical Grade"
      },
      {
        id: "patient-monitoring-system",
        name: "Patient Monitoring System",
        description: "Wireless patient monitoring solution",
        price: 1599,
        originalPrice: 2099,
        image: "/placeholder-medical.svg",
        features: ["Wireless monitoring", "Real-time alerts", "EMR integration", "FDA approved"],
        rating: 4.4,
        reviewCount: 89,
        inStock: true,
        badge: "FDA Approved"
      }
    ]
  },
  {
    id: "education",
    name: "Education",
    description: "Educational technology and classroom equipment",
    icon: GraduationCap,
    products: [
      {
        id: "interactive-whiteboard",
        name: "Interactive Smart Whiteboard",
        description: "Large interactive whiteboard for classrooms",
        price: 1299,
        originalPrice: 1699,
        image: "/placeholder-display.svg",
        features: ["Multi-touch", "Educational software", "Wireless sharing", "Easy installation"],
        rating: 4.5,
        reviewCount: 234,
        inStock: true,
        badge: "Educational"
      },
      {
        id: "student-response-system",
        name: "Student Response System",
        description: "Interactive student polling and response system",
        price: 399,
        originalPrice: 529,
        image: "/placeholder-device.svg",
        features: ["Instant polling", "Real-time feedback", "Quiz creation", "Analytics"],
        rating: 4.3,
        reviewCount: 167,
        inStock: true,
        badge: "Interactive"
      }
    ]
  },
  {
    id: "warehousing",
    name: "Warehousing",
    description: "Warehouse management and logistics equipment",
    icon: Warehouse,
    products: [
      {
        id: "warehouse-scanner",
        name: "Industrial Warehouse Scanner",
        description: "Rugged scanner for warehouse operations",
        price: 399,
        originalPrice: 529,
        image: "/placeholder-scanner.svg",
        features: ["Rugged design", "Long range", "Batch scanning", "Wi-Fi connectivity"],
        rating: 4.6,
        reviewCount: 189,
        inStock: true,
        badge: "Industrial"
      },
      {
        id: "inventory-management-wms",
        name: "Warehouse Management System",
        description: "Complete WMS software solution",
        price: 1299,
        originalPrice: 1699,
        image: "/placeholder-business.svg",
        features: ["Inventory control", "Order management", "Picking optimization", "Reporting"],
        rating: 4.4,
        reviewCount: 134,
        inStock: true,
        badge: "WMS"
      }
    ]
  }
];

// Loading skeleton for store sections
function StoreSectionSkeleton() {
  return (
    <div className="space-y-16">
      {Array.from({ length: 6 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-8">
          {/* Section header skeleton */}
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-48 animate-pulse"></div>
              </div>
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-80 animate-pulse"></div>
            </div>
          </div>

          {/* Products grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div key={cardIndex} className="animate-pulse">
                <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-700 rounded-2xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Product card component
function ProductCard({ product }) {
  return (
    <div className="group relative">
      <div className="group relative h-full flex flex-col border border-foreground/10 hover:border-foreground/20 transition-colors duration-200 rounded-lg my-0.5">
        
        {/* Wishlist Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute z-[1] right-2 top-2 h-9 w-9"
        >
          <Heart className="h-5 w-5 transition-colors duration-200 fill-secondary stroke-foreground/60 group-hover:stroke-foreground/80" />
        </Button>

        {/* Product Image */}
        <Link href={`/store/product/${product.id}`} className="block shrink-0 w-full">
          <div className="relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-foreground/10 hover:border-foreground/20 transition-colors border-0 aspect-square w-full rounded-t-lg">
            <Image
              alt={product.name}
              loading="eager"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={product.image}
            />
            {/* Badge Overlay */}
            {product.badge && (
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs font-medium">
                  {product.badge}
                </Badge>
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-red-600 text-white">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex flex-col mt-3 flex-1 p-3">
          <Link href={`/store/product/${product.id}`} className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Thorbis</p>
            <h2 className="font-medium text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h2>
            
            {/* Rating */}
            <div className="mt-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-2">
              {product.originalPrice > product.price && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground line-through">
                    List Price: ${product.originalPrice}
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-medium text-blue-600 dark:text-blue-400" aria-label={`Price: $${product.price}`}>
                  <span className="text-sm">$</span>
                  <span>{Math.floor(product.price)}</span>
                  <span className="text-sm">.{(product.price % 1).toFixed(2).slice(2)}</span>
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-red-600 font-medium">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% 
                    (${(product.originalPrice - product.price).toFixed(2)})
                  </span>
                )}
              </div>
            </div>

            {/* Availability & Shipping */}
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'Available' : 'Out of Stock'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {product.inStock ? 'In Stock' : 'Unavailable'}
                </span>
              </div>
              {product.inStock && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">FREE Shipping</span>
                  <span className="text-xs text-muted-foreground">Ships within 1-2 business days</span>
                </div>
              )}
            </div>
          </Link>

          {/* Add to Cart Button */}
          <div className="flex items-stretch gap-2 mt-3">
            <Button 
              className="h-9 w-full bg-blue-600 hover:bg-blue-700 text-white border border-foreground/10 hover:border-foreground/20"
              disabled={!product.inStock}
            >
              <div className="flex items-center justify-center w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span>Add to Cart</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category section component
function CategorySection({ category }) {
  const IconComponent = category.icon;
  
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            {category.description}
          </p>
        </div>
        
        <Button variant="outline" asChild>
          <Link href={`/store/category/${category.id}`}>
            View All
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// Hero section component for categories page
function CategoriesHero() {
  return (
    <section className="relative bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative">
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            
            {/* Header Badge */}
            <div className="flex justify-center">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium">
                <Package className="mr-2 w-4 h-4" />
                Browse All Categories
              </Badge>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                Product Categories
                <span className="block text-blue-600 dark:text-blue-400 mt-2">
                  Find What You Need
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Explore our comprehensive range of business technology products organized by category. 
                From POS systems to warehouse management, we have everything your business needs.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg font-semibold">
                <Link href="/store">
                  <ShoppingCart className="mr-3 w-5 h-5" />
                  View All Products
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-10 py-4 text-lg font-semibold border-2">
                <Link href="/help">
                  <Users className="mr-3 w-5 h-5" />
                  Get Expert Help
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main categories page component
export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <CategoriesHero />
      
      {/* Product Categories */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          <Suspense fallback={<StoreSectionSkeleton />}>
            {storeCategories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </Suspense>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help Finding the Right Product?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our product experts are here to help you choose the perfect solution for your business needs. 
            Get personalized recommendations and expert advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              <Users className="mr-2 w-5 h-5" />
              Contact an Expert
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              <ShoppingCart className="mr-2 w-5 h-5" />
              Browse All Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: "Product Categories - Business Technology Solutions | Thorbis",
  description: "Browse our complete range of business technology products organized by category. Find POS systems, payment solutions, security equipment, and more.",
  keywords: ["business technology", "product categories", "POS systems", "payment solutions", "security equipment", "office equipment"],
  openGraph: {
    title: "Product Categories - Business Technology Solutions",
    description: "Browse our complete range of business technology products organized by category.",
    url: "https://thorbis.com/store/categories",
    siteName: "Thorbis",
    images: [
      {
        url: `https://thorbis.com/opengraph-image?title=${encodeURIComponent("Product Categories")}&description=${encodeURIComponent("Complete range of business technology solutions")}`,
        width: 1200,
        height: 630,
        alt: "Thorbis Product Categories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Categories - Thorbis",
    description: "Browse the complete range of business technology products.",
    images: [`https://thorbis.com/twitter-image?title=${encodeURIComponent("Product Categories")}`],
  },
  alternates: {
    canonical: "https://thorbis.com/store/categories",
  },
};
