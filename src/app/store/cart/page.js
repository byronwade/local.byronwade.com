import { Suspense } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  Shield,
  Truck,
  CreditCard,
  CheckCircle,
  Package,
  Clock,
  Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

// Mock cart data
const cartItems = [
  {
    id: "thorbis-pos-pro",
    name: "Thorbis POS Pro",
    description: "Advanced point-of-sale system with integrated payment processing",
    price: 1299,
    originalPrice: 1599,
    image: "/placeholder-business.svg",
    quantity: 1,
    inStock: true,
    features: ["Contactless payments", "Inventory management"],
    rating: 4.8,
    reviewCount: 127,
    badge: "Best Seller"
  },
  {
    id: "thorbis-payment-terminal",
    name: "Thorbis Payment Terminal",
    description: "Secure payment processing terminal",
    price: 199,
    originalPrice: 249,
    image: "/placeholder-business.svg",
    quantity: 2,
    inStock: true,
    features: ["EMV compliant", "Contactless support"],
    rating: 4.6,
    reviewCount: 234,
    badge: "Secure"
  }
];

function CartSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg border">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CartItem({ item }) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
            />
            {item.badge && (
              <Badge className="absolute -top-2 -left-2 bg-blue-600 hover:bg-blue-700 text-white text-xs">
                {item.badge}
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.rating}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({item.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${item.price}
                </div>
                {item.originalPrice > item.price && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    ${item.originalPrice}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Label htmlFor={`quantity-${item.id}`} className="text-sm font-medium">
                  Quantity:
                </Label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="w-16 h-8 text-center border-0 focus:ring-0"
                    readOnly
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderSummary({ items }) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = items.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 29.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal ({items.length} items)</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          
          {savings > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">Savings</span>
              <span className="text-green-600 dark:text-green-400 font-medium">-${savings.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {shipping > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Truck className="w-4 h-4" />
              <span>Add ${(500 - subtotal).toFixed(2)} more for free shipping</span>
            </div>
          </div>
        )}

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <Shield className="w-4 h-4" />
            <span>Secure checkout with SSL encryption</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
          <CreditCard className="mr-2 w-5 h-5" />
          Proceed to Checkout
        </Button>
        
        <Button variant="outline" className="w-full" asChild>
          <Link href="/store">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Continue Shopping
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/store">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Store
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review your items and proceed to checkout
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<CartSkeleton />}>
              {cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                  <CardContent className="p-12 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Looks like you haven&apos;t added any items to your cart yet.
                    </p>
                    <Button asChild>
                      <Link href="/store">
                        <Package className="mr-2 w-4 h-4" />
                        Start Shopping
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Suspense>
          </div>

          <div className="space-y-6">
            <OrderSummary items={cartItems} />
            
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">30-Day Money Back</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Risk-free returns</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Secure Checkout</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">SSL encrypted</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Fast Shipping</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2-3 business days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
