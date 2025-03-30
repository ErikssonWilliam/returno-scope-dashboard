import { useState, useEffect } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, X, ArrowRight, LineChart, BarChart3, PieChart, TrendingUp, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type SearchResult = {
  id: string;
  title: string;
  category: string;
  description: string;
  path: string;
  icon: React.ReactNode;
};

const searchItems: SearchResult[] = [
  // Features
  { 
    id: "dashboard", 
    title: "Dashboard", 
    category: "Features", 
    description: "Main portfolio dashboard",
    path: "/",
    icon: <PieChart className="h-4 w-4" />
  },
  { 
    id: "market", 
    title: "Market", 
    category: "Features", 
    description: "Market overview and trading",
    path: "/market",
    icon: <TrendingUp className="h-4 w-4" />
  },
  { 
    id: "analysis", 
    title: "Analysis", 
    category: "Features", 
    description: "Portfolio analysis tools",
    path: "/analysis",
    icon: <BarChart3 className="h-4 w-4" />
  },
  { 
    id: "forecasting", 
    title: "Forecasting", 
    category: "Features", 
    description: "Return forecasting models",
    path: "/forecasting",
    icon: <LineChart className="h-4 w-4" />
  },
  { 
    id: "valuation", 
    title: "Valuation", 
    category: "Features", 
    description: "Option pricing models",
    path: "/valuation",
    icon: <Calculator className="h-4 w-4" />
  },
  
  // Securities
  { 
    id: "aapl", 
    title: "AAPL", 
    category: "Securities", 
    description: "Apple Inc.",
    path: "/market?security=AAPL",
    icon: <span className="font-mono text-xs bg-slate-100 p-1 rounded">AAPL</span>
  },
  { 
    id: "msft", 
    title: "MSFT", 
    category: "Securities", 
    description: "Microsoft Corporation",
    path: "/market?security=MSFT",
    icon: <span className="font-mono text-xs bg-slate-100 p-1 rounded">MSFT</span>
  },
  { 
    id: "amzn", 
    title: "AMZN", 
    category: "Securities", 
    description: "Amazon.com Inc.",
    path: "/market?security=AMZN",
    icon: <span className="font-mono text-xs bg-slate-100 p-1 rounded">AMZN</span>
  },
  
  // Valuation Models
  { 
    id: "monte-carlo", 
    title: "Monte Carlo", 
    category: "Valuation", 
    description: "Monte Carlo simulation for option pricing",
    path: "/valuation?model=monte-carlo",
    icon: <Calculator className="h-4 w-4" />
  },
  { 
    id: "black-scholes", 
    title: "Black-Scholes", 
    category: "Valuation", 
    description: "Black-Scholes option pricing model",
    path: "/valuation?model=black-scholes",
    icon: <Calculator className="h-4 w-4" />
  },
];

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    navigate(result.path);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full md:w-[260px] flex items-center justify-between text-sm text-slate-500 font-normal h-9 px-3 border border-slate-200"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center">
          <Search className="h-3.5 w-3.5 mr-2" />
          <span>Search securities or features...</span>
        </div>
        <kbd className="hidden md:flex pointer-events-none items-center gap-1 rounded border bg-slate-100 px-1.5 text-[10px] font-medium text-slate-600">
          {isMac ? <span className="text-xs">⌘</span> : <span className="text-xs">Ctrl</span>}/
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput placeholder="Search securities, features, or valuation models..." className="flex-1" />
          <button onClick={() => setOpen(false)} className="flex items-center justify-center h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Features">
            {searchItems
              .filter(item => item.category === "Features")
              .map(item => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-2 text-slate-600">{item.icon}</div>
                    <div>
                      <div>{item.title}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Securities">
            {searchItems
              .filter(item => item.category === "Securities")
              .map(item => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-2">{item.icon}</div>
                    <div>
                      <div>{item.title}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Valuation Models">
            {searchItems
              .filter(item => item.category === "Valuation")
              .map(item => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-2 text-slate-600">{item.icon}</div>
                    <div>
                      <div>{item.title}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
