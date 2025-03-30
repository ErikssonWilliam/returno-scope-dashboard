import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the props interface
interface TradeFormProps {
  selectedSecurity: string;
}

// Market data
const marketData = {
  AAPL: { lastPrice: 182.52, bid: 182.48, ask: 182.55 },
  MSFT: { lastPrice: 334.12, bid: 334.05, ask: 334.20 },
  GOOGL: { lastPrice: 131.86, bid: 131.75, ask: 131.90 },
  AMZN: { lastPrice: 127.74, bid: 127.70, ask: 127.80 },
  TSLA: { lastPrice: 217.25, bid: 217.15, ask: 217.35 },
  NVDA: { lastPrice: 432.38, bid: 432.25, ask: 432.50 },
  META: { lastPrice: 326.72, bid: 326.65, ask: 326.85 },
};

// Form schema
const formSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  orderType: z.enum(["market", "limit"]),
  direction: z.enum(["buy", "sell"]),
  quantity: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Quantity must be a positive number" }
  ),
  limitPrice: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function TradeForm({ selectedSecurity }: TradeFormProps) {
  const [localSelectedSymbol, setLocalSelectedSymbol] = useState<string | null>(
    selectedSecurity && Object.keys(marketData).includes(selectedSecurity) ? selectedSecurity : null
  );
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: localSelectedSymbol || "",
      orderType: "market",
      direction: "buy",
      quantity: "",
      limitPrice: "",
    },
  });

  // Update the form when selectedSecurity prop changes
  useEffect(() => {
    if (selectedSecurity && Object.keys(marketData).includes(selectedSecurity)) {
      setLocalSelectedSymbol(selectedSecurity);
      form.setValue("symbol", selectedSecurity);
    }
  }, [selectedSecurity, form]);

  const orderType = form.watch("orderType");
  const direction = form.watch("direction");

  const handleSymbolSelect = (symbol: string) => {
    setLocalSelectedSymbol(symbol);
    form.setValue("symbol", symbol);
  };

  const onSubmit = (data: FormValues) => {
    // Calculate the estimated cost
    const symbol = data.symbol;
    const quantity = parseFloat(data.quantity);
    const priceToUse = data.orderType === "market" 
      ? (data.direction === "buy" ? marketData[symbol as keyof typeof marketData].ask : marketData[symbol as keyof typeof marketData].bid)
      : parseFloat(data.limitPrice || "0");
    
    const totalCost = priceToUse * quantity;
    const fee = totalCost * 0.001; // 0.1% fee
    const totalWithFee = data.direction === "buy" ? totalCost + fee : totalCost - fee;
    
    toast.success(
      `Order placed: ${data.direction} ${quantity} ${symbol} at ${data.orderType === "market" ? "market price" : `$${priceToUse}`}`,
      { 
        description: `Estimated ${data.direction === "buy" ? "cost" : "proceeds"}: $${totalWithFee.toFixed(2)} (including $${fee.toFixed(2)} fee)`
      }
    );
    
    // Reset form
    form.reset({
      symbol: "",
      orderType: "market",
      direction: "buy",
      quantity: "",
      limitPrice: "",
    });
    setLocalSelectedSymbol(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
          <CardDescription>
            Execute trades at market price or set limit orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Symbol</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(marketData).map((symbol) => (
                        <Button
                          key={symbol}
                          type="button"
                          variant={localSelectedSymbol === symbol ? "default" : "outline"}
                          className="flex-1 min-w-[4rem]"
                          onClick={() => handleSymbolSelect(symbol)}
                        >
                          {symbol}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Order Direction</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="buy" id="buy" />
                          </FormControl>
                          <FormLabel className="font-normal" htmlFor="buy">
                            Buy
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="sell" id="sell" />
                          </FormControl>
                          <FormLabel className="font-normal" htmlFor="sell">
                            Sell
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Order Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="market" id="market" />
                          </FormControl>
                          <FormLabel className="font-normal" htmlFor="market">
                            Market
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="limit" id="limit" />
                          </FormControl>
                          <FormLabel className="font-normal" htmlFor="limit">
                            Limit
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Market orders execute immediately at the current price. Limit orders execute only at your specified price or better.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {orderType === "limit" && (
                <FormField
                  control={form.control}
                  name="limitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limit Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter limit price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full">
                Place {direction === "buy" ? "Buy" : "Sell"} Order
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Information</CardTitle>
        </CardHeader>
        <CardContent>
          {localSelectedSymbol ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{localSelectedSymbol}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-100 p-4 rounded-lg">
                    <p className="text-sm text-slate-500">Last Price</p>
                    <p className="text-2xl font-bold">
                      ${marketData[localSelectedSymbol as keyof typeof marketData].lastPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500">Bid</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${marketData[localSelectedSymbol as keyof typeof marketData].bid.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500">Ask</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${marketData[localSelectedSymbol as keyof typeof marketData].ask.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Order Preview</h3>
                <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                  {form.watch("quantity") && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Symbol</span>
                        <span className="font-medium">{localSelectedSymbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Action</span>
                        <span className={`font-medium ${direction === "buy" ? "text-green-600" : "text-red-600"}`}>
                          {direction === "buy" ? "Buy" : "Sell"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Quantity</span>
                        <span className="font-medium">{form.watch("quantity") || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Order Type</span>
                        <span className="font-medium capitalize">{orderType}</span>
                      </div>
                      {orderType === "limit" && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Limit Price</span>
                          <span className="font-medium">
                            ${form.watch("limitPrice") || "0.00"}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Estimated {direction === "buy" ? "Cost" : "Proceeds"}</span>
                          <span className="font-bold">
                            ${(() => {
                              const quantity = parseFloat(form.watch("quantity") || "0");
                              const price = orderType === "market"
                                ? (direction === "buy" 
                                  ? marketData[localSelectedSymbol as keyof typeof marketData].ask 
                                  : marketData[localSelectedSymbol as keyof typeof marketData].bid)
                                : parseFloat(form.watch("limitPrice") || "0");
                              const total = quantity * price;
                              const fee = total * 0.001; // 0.1% fee
                              return direction === "buy"
                                ? (total + fee).toFixed(2)
                                : (total - fee).toFixed(2);
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Including fees</span>
                          <span>
                            ${(() => {
                              const quantity = parseFloat(form.watch("quantity") || "0");
                              const price = orderType === "market"
                                ? (direction === "buy" 
                                  ? marketData[localSelectedSymbol as keyof typeof marketData].ask 
                                  : marketData[localSelectedSymbol as keyof typeof marketData].bid)
                                : parseFloat(form.watch("limitPrice") || "0");
                              const total = quantity * price;
                              return (total * 0.001).toFixed(2); // 0.1% fee
                            })()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  {!form.watch("quantity") && (
                    <p className="text-slate-500 italic">Enter quantity to see order preview</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <p className="text-slate-500 text-center">
                Select a symbol to view market information and place an order
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
