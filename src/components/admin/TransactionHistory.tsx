
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Sample transaction data
const transactions = [
  { id: 1, user: "John Smith", security: "AAPL", type: "buy", amount: 10, price: 182.52, fee: 2.43, timestamp: "2023-06-12T10:23:45" },
  { id: 2, user: "Sarah Johnson", security: "MSFT", type: "sell", amount: 5, price: 334.12, fee: 3.67, timestamp: "2023-06-12T11:05:21" },
  { id: 3, user: "Michael Brown", security: "GOOGL", type: "buy", amount: 2, price: 131.86, fee: 1.85, timestamp: "2023-06-12T11:32:07" },
  { id: 4, user: "Emma Wilson", security: "AMZN", type: "buy", amount: 3, price: 127.74, fee: 2.15, timestamp: "2023-06-12T12:15:33" },
  { id: 5, user: "James Davis", security: "TSLA", type: "sell", amount: 8, price: 217.25, fee: 4.22, timestamp: "2023-06-12T13:45:11" },
  { id: 6, user: "John Smith", security: "NVDA", type: "buy", amount: 12, price: 432.38, fee: 5.76, timestamp: "2023-06-12T14:20:45" },
  { id: 7, user: "Sarah Johnson", security: "META", type: "sell", amount: 15, price: 326.72, fee: 6.38, timestamp: "2023-06-12T15:07:19" },
  { id: 8, user: "Michael Brown", security: "AAPL", type: "sell", amount: 7, price: 183.05, fee: 2.65, timestamp: "2023-06-12T15:45:52" },
];

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(transaction => 
    transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    transaction.security.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const totalFees = filteredTransactions.reduce((sum, transaction) => sum + transaction.fee, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/3">
          <Input
            placeholder="Search by user or security..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-slate-100 p-4 rounded-lg">
          <p className="text-sm text-slate-500">Total Transaction Fees</p>
          <p className="text-2xl font-bold">${totalFees.toFixed(2)}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Security</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Fee</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.user}</TableCell>
              <TableCell>{transaction.security}</TableCell>
              <TableCell>
                <Badge variant={transaction.type === "buy" ? "default" : "secondary"}>
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{transaction.amount}</TableCell>
              <TableCell className="text-right">${transaction.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">${(transaction.amount * transaction.price).toFixed(2)}</TableCell>
              <TableCell className="text-right">${transaction.fee.toFixed(2)}</TableCell>
              <TableCell>{formatDate(transaction.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
