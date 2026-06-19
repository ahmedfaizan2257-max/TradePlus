/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlatformType = 'MT4' | 'MT5' | 'DXTrade' | 'MatchTrader' | 'cTrader' | 'Tradovate' | 'Rithmic';

export interface TradingAccount {
  id: string;
  name: string;
  platform: PlatformType;
  role: 'master' | 'child';
  accountNo: string;
  broker: string;
  status: 'connected' | 'disconnected' | 'connecting';
  balance: number;
  equity: number;
  currency: string;
  multiplier?: number; // children only
  fixedLot?: number; // children only
  copierMode?: 'multiplier' | 'fixed' | 'risk_percentage'; // children only
}

export interface CopierRule {
  id: string;
  sourceAccountId: string;
  targetAccountId: string;
  isActive: boolean;
  multiplier: number;
  slippageLimit: number; // max points or pips
  copyTakeProfit: boolean;
  copyStopLoss: boolean;
  reverseCopy: boolean;
}

export interface TradeOrder {
  id: string;
  ticket: string; // e.g., "789123"
  symbol: string; // e.g., "EURUSD"
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  currentPrice: number;
  pnl: number;
  openTime: string;
  accountId: string;
  accountName: string;
  masterTradeId?: string; // If copied, references parent trade
  status: 'OPEN' | 'CLOSED';
  entryPrice?: string;
  exitPrice?: string;
}

export interface CopyLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  latency?: number; // in milliseconds
}

export interface PricingPlan {
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  accountsLimit: number;
  features: string[];
  recommended?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}
