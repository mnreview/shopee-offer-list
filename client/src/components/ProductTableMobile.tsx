import { Link, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Product } from "./ProductTable";

interface ProductTableMobileProps {
  products: Product[];
  isLoading?: boolean;
  onSave?: (productId: string) => void;
  onGetLink?: (productId: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString("th-TH");
};

const formatSalesVolume = (volume: number) => {
  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + "M";
  }
  if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + "K";
  }
  return volume.toString();
};

export default function ProductTableMobile({
  products,
  isLoading = false,
  onSave,
  onGetLink,
}: ProductTableMobileProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <Card key={product.id} className="p-4 border border-border">
          <div className="space-y-3">
            {/* Image & Title */}
            <div className="flex gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <a
                  href="#"
                  className="font-medium text-primary hover:underline line-clamp-2 block"
                  title={product.name}
                >
                  {product.name}
                </a>
                <Badge variant="outline" className="text-xs mt-1">
                  {product.category}
                </Badge>
              </div>
            </div>

            {/* Price & Commission */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Price</div>
                <div className="font-semibold">
                  {formatCurrency(product.price)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Commission</div>
                <div className="flex items-center gap-1">
                  <Badge
                    className="bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                    variant="secondary"
                  >
                    {product.commissionRate.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Est. Earn & Sales Volume */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Est. Earn</div>
                <div className="font-bold text-green-600">
                  {formatCurrency(product.commission)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Sales</div>
                <div className="font-semibold text-blue-600">
                  {formatSalesVolume(product.salesVolume)}
                </div>
              </div>
            </div>

            {/* Review Rating & Updated */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Rating</div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">
                    {product.reviewRating.toFixed(1)}
                  </span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Updated</div>
                <div className="text-muted-foreground">
                  {getRelativeTime(product.updated)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGetLink?.(product.id)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Link className="w-4 h-4" />
                Get Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave?.(product.id)}
                className={`flex-1 flex items-center justify-center gap-2 ${
                  product.saved ? "text-primary" : ""
                }`}
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={product.saved ? "currentColor" : "none"}
                />
                Save
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
