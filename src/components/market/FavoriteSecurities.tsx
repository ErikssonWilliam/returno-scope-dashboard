
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { toast } from "sonner";

type Security = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
};

// Mock data for demonstration
const mockSecurities: Security[] = [
  { id: "1", symbol: "AAPL", name: "Apple Inc.", price: 172.43, change: 2.51, changePercent: 1.48, lastUpdated: "2 mins ago" },
  { id: "2", symbol: "MSFT", name: "Microsoft Corp.", price: 332.18, change: -4.23, changePercent: -1.26, lastUpdated: "4 mins ago" },
  { id: "3", symbol: "AMZN", name: "Amazon.com Inc.", price: 129.65, change: 1.85, changePercent: 1.45, lastUpdated: "6 mins ago" },
  { id: "4", symbol: "GOOGL", name: "Alphabet Inc.", price: 146.90, change: 0.35, changePercent: 0.24, lastUpdated: "10 mins ago" },
  { id: "5", symbol: "TSLA", name: "Tesla Inc.", price: 203.89, change: -6.47, changePercent: -3.08, lastUpdated: "12 mins ago" },
  { id: "6", symbol: "BRK.A", name: "Berkshire Hathaway", price: 536148.00, change: 3241.00, changePercent: 0.61, lastUpdated: "15 mins ago" },
  { id: "7", symbol: "JPM", name: "JPMorgan Chase", price: 182.56, change: 0.75, changePercent: 0.41, lastUpdated: "18 mins ago" },
  { id: "8", symbol: "JNJ", name: "Johnson & Johnson", price: 153.12, change: -0.48, changePercent: -0.31, lastUpdated: "20 mins ago" },
];

export const FavoriteSecurities = () => {
  const [securities, setSecurities] = useState<Security[]>(mockSecurities);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteSecurities");
    return saved ? JSON.parse(saved) : [];
  });

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("favoriteSecurities", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        toast.info("Removed from tracked securities");
        return prev.filter((secId) => secId !== id);
      } else {
        toast.success("Added to tracked securities");
        return [...prev, id];
      }
    });
  };

  // Filter securities to show only favorites or all if no favorites
  const displayedSecurities = favorites.length > 0 
    ? securities.filter(sec => favorites.includes(sec.id))
    : securities.slice(0, 3); // Show top 3 if no favorites

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Star className="h-5 w-5 mr-2 text-amber-500" />
          Tracked Securities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {displayedSecurities.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <p>No securities tracked yet</p>
            <p className="text-sm mt-1">Star your favorite securities to track them here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedSecurities.map((security) => (
              <div key={security.id} className="flex justify-between items-center p-4 hover:bg-slate-50">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleFavorite(security.id)}
                    className="mr-3 text-amber-400 hover:text-amber-500 focus:outline-none"
                  >
                    <Star
                      className="h-5 w-5"
                      fill={favorites.includes(security.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{security.symbol}</span>
                      <span className="text-xs text-slate-500 ml-2">{security.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{security.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${security.price.toLocaleString()}</div>
                  <div className={`flex items-center text-xs ${
                    security.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {security.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {security.change >= 0 ? "+" : ""}
                    {security.change.toFixed(2)} ({security.change >= 0 ? "+" : ""}
                    {security.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {favorites.length > 0 && (
          <div className="p-3 bg-slate-50 text-center">
            <button 
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => setFavorites([])}
            >
              Clear all tracked securities
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
