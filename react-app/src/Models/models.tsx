export interface Status {
  status_id: number;
  status_name: string;
  total_amount_criteria: number;
  transactions_criteria: number;
  annual_interest_rate: number;
  transaction_fee: number;
}

export interface UserStatus {
annualInterestRate: number;
statusId: number;
statusName: string
totalAmountCriteria: number
transactionFee: number
transactionsCriteria: number
}

export interface Transaction {
  transaction_id: number;
  transactionType: string;
  amount: number;
  timestamp: Date ;
  from_account_id: number;
  to_account_id: number;
  from_account?: Account; 
  to_account?: Account; 
  isFromTransaction?: boolean;
}

export interface Asset {
  asset_id: number;
  name: string;
  abbreviation: string;
  price: number;
  tokens: number;
  astro_price: number;
}

export interface Account {
  accountId: number;
  balance: number;
  assets: {
    $values: Asset[];
  };
  status: UserStatus;
  account_status_id: number;
  active: boolean;
  transactionsTo: {
    $values?: Transaction[];
  },
  transactionsFrom: {
    $values?: Transaction[];
  },
  astro_id: number;
  astro: Astro;
  totalTransactions: number;
  transactions?: Transaction[];
}

export interface User {
  user_id: number;
  email: string;
  username: string;
  account: Account;
}

export interface Astro {
  astro_id: number;
  name: string;
  abbreviation: string;
  price: number;
  tokens: number;
}

export {};
