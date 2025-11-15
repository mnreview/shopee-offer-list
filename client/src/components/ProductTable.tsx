import { Link, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  commissionRate: number;
  commission: number;
  updated: string;
  salesVolume: number;
  reviewRating: number;
  saved?: boolean;
}

interface ProductTableProps {
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

export default function ProductTable({
  products,
  isLoading = false,
  onSave,
  onGetLink,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
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
    <div className="overflow-x-auto border border-border rounded-lg">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="w-20">Category</TableHead>
            <TableHead className="w-20 text-right">Price</TableHead>
            <TableHead className="w-20 text-right">Commission</TableHead>
            <TableHead className="w-20 text-right">Est. Earn</TableHead>
            <TableHead className="w-20 text-right">Sales</TableHead>
            <TableHead className="w-16 text-center">Rating</TableHead>
            <TableHead className="w-16">Updated</TableHead>
            <TableHead className="w-20 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/50">
              {/* Image */}
              <TableCell>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
              </TableCell>

              {/* Product Name */}
              <TableCell>
                <a
                  href="#"
                  className="font-medium text-primary hover:underline truncate block max-w-xs"
                  title={product.name}
                >
                  {product.name}
                </a>
              </TableCell>

              {/* Category */}
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              </TableCell>

              {/* Price */}
              <TableCell className="text-right font-medium">
                {formatCurrency(product.price)}
              </TableCell>

              {/* Commission Rate */}
              <TableCell className="text-right">
                <Badge
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                  variant="secondary"
                >
                  {product.commissionRate.toFixed(1)}%
                </Badge>
              </TableCell>

              {/* Est. Earn */}
              <TableCell className="text-right font-bold text-green-600">
                {formatCurrency(product.commission)}
              </TableCell>

              {/* Sales Volume */}
              <TableCell className="text-right font-medium text-blue-600">
                {formatSalesVolume(product.salesVolume)}
              </TableCell>

              {/* Review Rating */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-semibold">
                    {product.reviewRating.toFixed(1)}
                  </span>
                  <span className="text-yellow-500">★</span>
                </div>
              </TableCell>

              {/* Updated */}
              <TableCell className="text-sm text-muted-foreground">
                {getRelativeTime(product.updated)}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGetLink?.(product.id)}
                    title="Get affiliate link"
                    className="h-8 w-8 p-0"
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSave?.(product.id)}
                    title="Save product"
                    className={`h-8 w-8 p-0 ${
                      product.saved ? "text-primary" : ""
                    }`}
                  >
                    <Bookmark
                      className="w-4 h-4"
                      fill={product.saved ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
