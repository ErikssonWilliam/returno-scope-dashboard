import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className="w-full">
      <CardHeader className="pb-2">
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
          <ScrollArea className="w-full" orientation="horizontal">
            <div className="flex min-w-max">
              {displayedSecurities.map((security) => (
                <div key={security.id} className="p-4 min-w-[220px] border-r border-slate-100 last:border-r-0 hover:bg-slate-50">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium">{security.symbol}</span>
                        <button
                          onClick={() => toggleFavorite(security.id)}
                          className="ml-2 text-amber-400 hover:text-amber-500 focus:outline-none"
                        >
                          <Star
                            className="h-4 w-4"
                            fill={favorites.includes(security.id) ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                      <div className={`flex items-center text-xs ${
                        security.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {security.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {security.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">{security.name}</div>
                    <div className="font-medium mt-1">${security.price.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{security.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
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
