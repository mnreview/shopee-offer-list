import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import FilterToolbar, { FilterState } from "@/components/FilterToolbar";
import ProductTable, { Product } from "@/components/ProductTable";
import ProductTableMobile from "@/components/ProductTableMobile";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Noise Cancelling Headphones Pro",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    category: "Electronics",
    price: 2500,
    commissionRate: 10,
    commission: 250,
    updated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    salesVolume: 5200,
    reviewRating: 4.7,
    saved: false,
  },
  {
    id: "2",
    name: "Premium Wireless Keyboard & Mouse Combo",
    image: "https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=200&h=200&fit=crop",
    category: "Electronics",
    price: 1800,
    commissionRate: 12,
    commission: 216,
    updated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    salesVolume: 8900,
    reviewRating: 4.5,
    saved: false,
  },
  {
    id: "3",
    name: "4K Webcam with Auto Focus",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=200&fit=crop",
    category: "Electronics",
    price: 3200,
    commissionRate: 8.5,
    commission: 272,
    updated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    salesVolume: 3400,
    reviewRating: 4.8,
    saved: false,
  },
  {
    id: "4",
    name: "Portable USB-C Charger 65W",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop",
    category: "Electronics",
    price: 890,
    commissionRate: 15,
    commission: 133.5,
    updated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    salesVolume: 12500,
    reviewRating: 4.6,
    saved: false,
  },
  {
    id: "5",
    name: "Ergonomic Office Chair with Lumbar Support",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&h=200&fit=crop",
    category: "Home & Living",
    price: 4500,
    commissionRate: 7,
    commission: 315,
    updated: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    salesVolume: 2100,
    reviewRating: 4.9,
    saved: false,
  },
  {
    id: "6",
    name: "Smart LED Desk Lamp with USB Charging",
    image: "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=200&h=200&fit=crop",
    category: "Home & Living",
    price: 1200,
    commissionRate: 18,
    commission: 216,
    updated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    salesVolume: 6800,
    reviewRating: 4.4,
    saved: false,
  },
  {
    id: "7",
    name: "Premium Cotton T-Shirt Collection (Pack of 3)",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
    category: "Fashion",
    price: 599,
    commissionRate: 20,
    commission: 119.8,
    updated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    salesVolume: 45000,
    reviewRating: 4.3,
    saved: false,
  },
  {
    id: "8",
    name: "Professional Yoga Mat with Carrying Strap",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&h=200&fit=crop",
    category: "Sports",
    price: 1450,
    commissionRate: 11,
    commission: 159.5,
    updated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    salesVolume: 7200,
    reviewRating: 4.7,
    saved: false,
  },
  {
    id: "9",
    name: "Stainless Steel Water Bottle 1L",
    image: "https://images.unsplash.com/photo-1602143407151-7e36dd5f5914?w=200&h=200&fit=crop",
    category: "Sports",
    price: 450,
    commissionRate: 16,
    commission: 72,
    updated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    salesVolume: 28000,
    reviewRating: 4.6,
    saved: false,
  },
  {
    id: "10",
    name: "Organic Skincare Set (5 Products)",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop",
    category: "Beauty",
    price: 2200,
    commissionRate: 13,
    commission: 286,
    updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    salesVolume: 3800,
    reviewRating: 4.8,
    saved: false,
  },
];

const ITEMS_PER_PAGE = 10;

export default function OfferExplorer() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All Categories",
    priceMin: 0,
    priceMax: 100000,
    commissionMin: 0,
    commissionMax: 20,
    sortBy: "commission-high",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === "All Categories" ||
        product.category === filters.category;

      const matchesPrice =
        product.price >= filters.priceMin &&
        product.price <= filters.priceMax;

      const matchesCommission =
        product.commissionRate >= filters.commissionMin &&
        product.commissionRate <= filters.commissionMax;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesCommission
      );
    });

    // Sort
    switch (filters.sortBy) {
      case "commission-high":
        result.sort((a, b) => b.commissionRate - a.commissionRate);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
        break;
      case "popular":
        // In a real app, this would be based on actual popularity data
        result.sort((a, b) => b.commission - a.commission);
        break;
    }

    return result;
  }, [filters]);

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Add saved status to products
  const productsWithSavedStatus = paginatedProducts.map((product) => ({
    ...product,
    saved: savedItems.has(product.id),
  }));

  const handleSave = (productId: string) => {
    const newSavedItems = new Set(savedItems);
    if (newSavedItems.has(productId)) {
      newSavedItems.delete(productId);
      toast.success("Removed from saved items");
    } else {
      newSavedItems.add(productId);
      toast.success("Added to saved items");
    }
    setSavedItems(newSavedItems);
  };

  const handleGetLink = (productId: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (product) {
      toast.success(`Affiliate link copied: https://shopee.co.th/affiliate/${productId}`);
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Offer Explorer" },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Offer Explorer</h1>
          <p className="text-muted-foreground mt-1">
            Search and compare high-commission products
          </p>
        </div>

        {/* Filter Toolbar */}
        <FilterToolbar onFiltersChange={handleFiltersChange} />

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
            <span className="font-semibold text-foreground">
              {filteredProducts.length}
            </span>{" "}
            products
          </div>
          {savedItems.size > 0 && (
            <div className="text-sm font-medium text-primary">
              {savedItems.size} saved item{savedItems.size !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Product Table - Desktop */}
        <div className="hidden md:block">
          <ProductTable
            products={productsWithSavedStatus}
            onSave={handleSave}
            onGetLink={handleGetLink}
          />
        </div>

        {/* Product Table - Mobile */}
        <div className="md:hidden">
          <ProductTableMobile
            products={productsWithSavedStatus}
            onSave={handleSave}
            onGetLink={handleGetLink}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
