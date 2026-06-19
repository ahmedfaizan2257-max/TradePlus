/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TradingAccount, PricingPlan, FAQItem, TradeOrder, CopyLog } from './types';

export const SUPPORTED_PLATFORMS = [
  { id: 'MT4', name: 'MetaTrader 4', logo: 'MT4', desc: 'Industry standard for retail CFDs' },
  { id: 'MT5', name: 'MetaTrader 5', logo: 'MT5', desc: 'Modern multi-asset trading standard' },
  { id: 'DXTrade', name: 'DXTrade', logo: 'DX', desc: 'Widespread among premier modern prop firms' },
  { id: 'MatchTrader', name: 'MatchTrader', logo: 'MTR', desc: 'Sleek, web-centric multi-asset client' },
  { id: 'cTrader', name: 'cTrader', logo: 'cT', desc: 'Direct market access, high-fidelity analytics' },
  { id: 'Tradovate', name: 'Tradovate', logo: 'Trd', desc: 'Cloud-first futures trading powerhouse' },
  { id: 'Rithmic', name: 'Rithmic', logo: 'Rh', desc: 'Low-latency infrastructure for futures' }
];

export const CORE_FEATURES = [
  {
    title: '100% Cloud-Based',
    description: 'No software installation, no browser extensions, and absolutely no expensive VPS rentals required. Our cloud infrastructure runs 24/7/365 with perfect reliability.',
    iconName: 'Cloud'
  },
  {
    title: 'Ultra-Low Latency (<15ms)',
    description: 'Trades are synchronized across and within brokers globally in milliseconds. Prevent slippage and replicate executions instantly when every fraction of a second counts.',
    iconName: 'Zap'
  },
  {
    title: 'Intelligent Lot Scaling',
    description: 'Scale copied trades automatically with flexible lot rules: exact multipliers, relative account size percentages, fixed lot sizing, or direct risk exposure calculations.',
    iconName: 'Sliders'
  },
  {
    title: 'Advanced Risk Management',
    description: 'Protect child accounts with customizable max-loss limits, force-close parameters, slippage caps, max delays, and selective asset whitelist or blacklist filters.',
    iconName: 'ShieldAlert'
  },
  {
    title: 'Interactive Mirror (Reverse Copying)',
    description: 'Replicate systems in reverse! Automatically execute opposing trades on secondary accounts to capitalize on specific systems or failing algorithms.',
    iconName: 'RefreshCw'
  },
  {
    title: 'Universal Platform Synthesis',
    description: 'Synchronize seamlessly regardless of the engine. Route trades from MT5 to DXTrade, cTrader to MatchTrader, or Rithmic to Tradovate with robust translation.',
    iconName: 'GitCommit'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Plus Starter',
    priceMonthly: 19,
    priceAnnual: 15,
    accountsLimit: 2,
    features: [
      'Sync up to 2 accounts',
      'Under 50ms replication latency',
      'All platforms (MT4, MT5, DXTrade...)',
      'Real-time position monitoring',
      'Basic lot sizing multipliers',
      'Email support (24h response)'
    ]
  },
  {
    name: 'Plus Pro',
    priceMonthly: 29,
    priceAnnual: 23,
    accountsLimit: 5,
    recommended: true,
    features: [
      'Sync up to 5 accounts',
      'Under 30ms premium latency',
      'Everything in Starter',
      'Advanced lot scaling (Risk %, Auto)',
      'Custom slippage guards & delays',
      'Symbol conversion presets',
      'Priority live chat support'
    ]
  },
  {
    name: 'Plus Elite',
    priceMonthly: 49,
    priceAnnual: 39,
    accountsLimit: 10,
    features: [
      'Sync up to 10 accounts',
      'Under 15ms VIP latency',
      'Everything in Pro',
      'Reverse Copying mode',
      'Bulk trade management',
      'Advanced API access controls',
      '24/7 Dedicated account manager'
    ]
  },
  {
    name: 'Plus Enterprise',
    priceMonthly: 99,
    priceAnnual: 79,
    accountsLimit: 30,
    features: [
      'Sync up to 30 accounts',
      'Fastest dedication throughput',
      'Unlimited masters and children',
      'High-frequency trading (HFT) support',
      'Custom webhook triggers',
      'SLA performance guarantee',
      'Dedicated Discord channel'
    ]
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does TradePlus work without installing custom software?',
    answer: 'TradePlus operates in the cloud using API hooks and enterprise-grade bridging connectors. By hooking directly into your broker credentials (for platforms like MT4, MT5, DXTrade, MatchTrader, cTrader), we listen to trade events on your designated Master accounts and instantly replicate those instructions on your Child accounts within milliseconds without requiring you to run a VPS or download desktop software.'
  },
  {
    question: 'Is TradePlus allowed on prop firms?',
    answer: 'Yes! TradePlus is widely used to copy trades across prop firm challenges and funded accounts. Because our copier adds minimal latency (reproducing trades under 15-30ms) and lets you choose customized lot multipliers, your child account trades appear organic. Always verify your specific prop firm\'s IP address rules and trade copier guidelines to ensure compliance.'
  },
  {
    question: 'Do I need to leave my PC or phone running for it to copy trades?',
    answer: 'Absolutely not. Since TradePlus runs 100% on cloud servers, the trade copy engine operates completely independently. You can shut down your computer, go offline, lose internet connection, or put your phone on airplane mode. The trades will continue to sync perfectly in real-time, 24 hours a day.'
  },
  {
    question: 'Can I copy trades from one broker to a different broker?',
    answer: 'Yes, cross-broker synchronization is one of our major capabilities. For example, you can copy trades from an MT5 account at IC Markets to a DXTrade account at FundedNext, and a MatchTrader account at FTMO simultaneously. Our engine automatically translates trade parameters, currencies, and symbol mappings in real-time.'
  },
  {
    question: 'What happens if a trade executes with slippage?',
    answer: 'We provide advanced slippage filter rules. You can define a maximum slippage cap (e.g., 5 pips / 50 points). If a trade on your child account cannot be filled within your defined slippage threshold compared to the master execution price, the engine can reject it or wait for a price pull-back to protect your margins.'
  }
];

export const INITIAL_ACCOUNTS: TradingAccount[] = [
  {
    id: 'acc-1',
    name: 'Main FTMO Master',
    platform: 'MT5',
    role: 'master',
    accountNo: '8172942',
    broker: 'FTMO Technologies',
    status: 'connected',
    balance: 100000.00,
    equity: 100480.00,
    currency: 'USD'
  },
  {
    id: 'acc-2',
    name: 'FundedNext Child 1',
    platform: 'DXTrade',
    role: 'child',
    accountNo: '4819203',
    broker: 'FundedNext Server',
    status: 'connected',
    balance: 50000.00,
    equity: 50240.00,
    currency: 'USD',
    multiplier: 1.0,
    copierMode: 'multiplier'
  },
  {
    id: 'acc-3',
    name: 'IC Markets Child 2',
    platform: 'MatchTrader',
    role: 'child',
    accountNo: '5719302',
    broker: 'IC Markets Global',
    status: 'connected',
    balance: 200000.00,
    equity: 200960.00,
    currency: 'USD',
    multiplier: 2.0,
    copierMode: 'multiplier'
  },
  {
    id: 'acc-4',
    name: 'cTrader Backup Child',
    platform: 'cTrader',
    role: 'child',
    accountNo: '2288114',
    broker: 'Pepperstone cTrader',
    status: 'disconnected',
    balance: 10000.00,
    equity: 10000.00,
    currency: 'USD',
    multiplier: 0.5,
    copierMode: 'multiplier'
  }
];

export const INITIAL_TRADES: TradeOrder[] = [
  {
    id: 'trd-1',
    ticket: '984102',
    symbol: 'EURUSD',
    type: 'BUY',
    lots: 1.00,
    openPrice: 1.08550,
    currentPrice: 1.09030,
    pnl: 480.00,
    openTime: '2026-06-19 13:10:45',
    accountId: 'acc-1',
    accountName: 'Main FTMO Master',
    status: 'OPEN'
  },
  {
    id: 'trd-2',
    ticket: '984103',
    symbol: 'EURUSD',
    type: 'BUY',
    lots: 1.00,
    openPrice: 1.08552,
    currentPrice: 1.09030,
    pnl: 240.00, // Multiplier 1.0x on a smaller balance or equivalent scale
    openTime: '2026-06-19 13:10:45',
    accountId: 'acc-2',
    accountName: 'FundedNext Child 1',
    masterTradeId: 'trd-1',
    status: 'OPEN'
  },
  {
    id: 'trd-3',
    ticket: '984104',
    symbol: 'EURUSD',
    type: 'BUY',
    lots: 2.00, // Multiplier 2.0x
    openPrice: 1.08551,
    currentPrice: 1.09030,
    pnl: 960.00,
    openTime: '2026-06-19 13:10:46',
    accountId: 'acc-3',
    accountName: 'IC Markets Child 2',
    masterTradeId: 'trd-1',
    status: 'OPEN'
  },
  // --- RICH COMPILATION OF CLOSED TRADE HISTORY ---
  {
    id: 'trd-c1',
    ticket: '983941',
    symbol: 'XAUUSD',
    type: 'BUY',
    lots: 1.00,
    openPrice: 2315.40,
    currentPrice: 2323.80,
    pnl: 840.00,
    openTime: '2026-06-18 10:15:30',
    accountId: 'acc-1',
    accountName: 'Main FTMO Master',
    status: 'CLOSED',
    entryPrice: '2315.40',
    exitPrice: '2323.80'
  } as any,
  {
    id: 'trd-c2',
    ticket: '983942',
    symbol: 'XAUUSD',
    type: 'BUY',
    lots: 1.00,
    openPrice: 2315.45,
    currentPrice: 2323.80,
    pnl: 835.00,
    openTime: '2026-06-18 10:15:31',
    accountId: 'acc-2',
    accountName: 'FundedNext Child 1',
    masterTradeId: 'trd-c1',
    status: 'CLOSED',
    entryPrice: '2315.45',
    exitPrice: '2323.80'
  } as any,
  {
    id: 'trd-c3',
    ticket: '983943',
    symbol: 'XAUUSD',
    type: 'BUY',
    lots: 2.00,
    openPrice: 2315.42,
    currentPrice: 2323.80,
    pnl: 1676.00,
    openTime: '2026-06-18 10:15:32',
    accountId: 'acc-3',
    accountName: 'IC Markets Child 2',
    masterTradeId: 'trd-c1',
    status: 'CLOSED',
    entryPrice: '2315.42',
    exitPrice: '2323.80'
  } as any,
  {
    id: 'trd-c4',
    ticket: '983810',
    symbol: 'BTCUSD',
    type: 'SELL',
    lots: 0.50,
    openPrice: 66200.00,
    currentPrice: 66820.00,
    pnl: -310.00,
    openTime: '2026-06-17 15:45:10',
    accountId: 'acc-1',
    accountName: 'Main FTMO Master',
    status: 'CLOSED',
    entryPrice: '66200.00',
    exitPrice: '66820.00'
  } as any,
  {
    id: 'trd-c5',
    ticket: '983811',
    symbol: 'BTCUSD',
    type: 'SELL',
    lots: 0.50,
    openPrice: 66201.50,
    currentPrice: 66820.00,
    pnl: -309.25,
    openTime: '2026-06-17 15:45:11',
    accountId: 'acc-2',
    accountName: 'FundedNext Child 1',
    masterTradeId: 'trd-c4',
    status: 'CLOSED',
    entryPrice: '66201.50',
    exitPrice: '66820.00'
  } as any,
  {
    id: 'trd-c6',
    ticket: '983812',
    symbol: 'BTCUSD',
    type: 'SELL',
    lots: 1.00,
    openPrice: 66200.80,
    currentPrice: 66820.00,
    pnl: -619.20,
    openTime: '2026-06-17 15:45:12',
    accountId: 'acc-3',
    accountName: 'IC Markets Child 2',
    masterTradeId: 'trd-c4',
    status: 'CLOSED',
    entryPrice: '66200.80',
    exitPrice: '66820.00'
  } as any,
  {
    id: 'trd-c7',
    ticket: '983750',
    symbol: 'GBPUSD',
    type: 'BUY',
    lots: 1.50,
    openPrice: 1.26850,
    currentPrice: 1.27210,
    pnl: 540.00,
    openTime: '2026-06-16 08:30:00',
    accountId: 'acc-1',
    accountName: 'Main FTMO Master',
    status: 'CLOSED',
    entryPrice: '1.26850',
    exitPrice: '1.27210'
  } as any,
  {
    id: 'trd-c8',
    ticket: '983751',
    symbol: 'GBPUSD',
    type: 'BUY',
    lots: 1.50,
    openPrice: 1.26852,
    currentPrice: 1.27210,
    pnl: 537.00,
    openTime: '2026-06-16 08:30:01',
    accountId: 'acc-2',
    accountName: 'FundedNext Child 1',
    masterTradeId: 'trd-c7',
    status: 'CLOSED',
    entryPrice: '1.26852',
    exitPrice: '1.27210'
  } as any,
  {
    id: 'trd-c9',
    ticket: '983752',
    symbol: 'GBPUSD',
    type: 'BUY',
    lots: 3.00,
    openPrice: 1.26851,
    currentPrice: 1.27210,
    pnl: 1077.00,
    openTime: '2026-06-16 08:30:01',
    accountId: 'acc-3',
    accountName: 'IC Markets Child 2',
    masterTradeId: 'trd-c7',
    status: 'CLOSED',
    entryPrice: '1.26851',
    exitPrice: '1.27210'
  } as any
];

export const INITIAL_LOGS: CopyLog[] = [
  {
    id: 'log-1',
    timestamp: '14:20:00',
    type: 'info',
    message: 'TradePlus core engine boot sequence initialized.'
  },
  {
    id: 'log-2',
    timestamp: '14:20:02',
    type: 'success',
    message: 'Master Account FTMO [8172942] synchronized using SSL Bridge.'
  },
  {
    id: 'log-3',
    timestamp: '14:20:03',
    type: 'success',
    message: 'Child DXTrade Account [4819203] synchronized successfully.'
  },
  {
    id: 'log-4',
    timestamp: '14:20:04',
    type: 'success',
    message: 'Child MatchTrader Account [5719302] synchronized successfully.'
  },
  {
    id: 'log-5',
    timestamp: '14:20:10',
    type: 'warning',
    message: 'Child cTrader Account [2288114] state changed to DISCONNECTED. Server rejected credentials or account expired.'
  },
  {
    id: 'log-6',
    timestamp: '14:32:45',
    type: 'info',
    message: 'Detected active trade order on FTMO Master: BUY 1.00 lot EURUSD @ 1.08550'
  },
  {
    id: 'log-7',
    timestamp: '14:32:45',
    type: 'success',
    message: 'Replicated EURUSD BUY 1.00 lot on DXTrade Child [4819203]',
    latency: 18
  },
  {
    id: 'log-8',
    timestamp: '14:32:46',
    type: 'success',
    message: 'Replicated EURUSD BUY 2.00 lot (Multiplier 2.0x) on MatchTrader Child [5719302]',
    latency: 22
  }
];
