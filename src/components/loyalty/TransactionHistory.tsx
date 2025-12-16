'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, ArrowUp, ArrowDown, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: string;
  points: number;
  description: string;
  createdAt: string;
  expiresAt?: string;
}

interface TransactionHistoryProps {
  accountId: string;
  recentTransactions: Transaction[];
}

export default function TransactionHistory({ accountId, recentTransactions }: TransactionHistoryProps) {
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const loadAllTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/loyalty/transactions?limit=50');

      if (!response.ok) {
        throw new Error('Failed to load transactions');
      }

      const data = await response.json();
      setAllTransactions(data.transactions);
      setShowAll(true);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string, points: number) => {
    if (points > 0) {
      return <ArrowUp className="h-5 w-5 text-green-600" />;
    } else {
      return <ArrowDown className="h-5 w-5 text-red-600" />;
    }
  };

  const getTransactionColor = (points: number) => {
    return points > 0 ? 'text-green-600' : 'text-red-600';
  };

  const transactions = showAll ? allTransactions : recentTransactions;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <History className="h-5 w-5 text-gray-500" />
          <span>Transaction History</span>
        </CardTitle>
        <CardDescription>Your recent points activity</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No transactions yet</p>
            <p className="text-sm mt-1">Start earning points by making purchases!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    {getTransactionIcon(transaction.type, transaction.points)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-xs text-gray-500">
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy • hh:mm a')}
                      </p>
                      {transaction.expiresAt && new Date(transaction.expiresAt) > new Date() && (
                        <div className="flex items-center space-x-1 text-xs text-orange-600">
                          <Clock className="h-3 w-3" />
                          <span>
                            Expires {format(new Date(transaction.expiresAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`text-right`}>
                  <p className={`font-bold text-lg ${getTransactionColor(transaction.points)}`}>
                    {transaction.points > 0 ? '+' : ''}
                    {transaction.points}
                  </p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            ))}

            {!showAll && recentTransactions.length >= 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={loadAllTransactions}
                disabled={loading}
              >
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    View All Transactions
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
