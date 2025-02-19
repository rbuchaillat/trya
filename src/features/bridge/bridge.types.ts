export type CreateUserResponse = {
  uuid: string;
  external_user_id: string;
};

export type AuthorizationTokenResponse = {
  access_token: string;
  expires_at: string;
  user: {
    uuid: string;
    external_user_id: string;
  };
};

export type CreateConnectSessionResponse = {
  id: string;
  url: string;
};

export type ItemResponse = {
  id: string;
  status: number;
  status_code_info?: string;
  status_code_description?: string;
  provider_id: number;
  provider_name?: string;
  provider_group_name?: string;
  provider_images_logo?: string;
  account_types: string;
  last_successful_refresh?: string;
  last_try_refresh?: string;
  created_at: string;
};

export type ItemsResponse = {
  resources: ItemResponse[];
  generated_at: string;
  pagination: {
    next_uri: string | null;
  };
};

export type ProviderResponse = {
  id: number;
  name: string;
  group_name: string;
  country_code: string;
  images: {
    logo: string;
  };
  capabilities: string[][];
  aggregation_metadata: {
    release_status: string;
  };
  payment_metadata: {
    release_status: string;
    nb_max_transactions: number;
    max_size_label: number;
    sender_iban_available: boolean;
    provider_environments: string[];
    execution_status_available: string;
  };
  health_status: {
    aggregation: {
      status: string;
    };
    single_payment: {
      status: string;
    };
  };
  tags: {
    segment: string[];
    region: string;
    keywords: string[];
  };
};

export type BankAccountResponse = {
  id: string;
  name: string;
  balance: number;
  accounting_balance?: number;
  instant_balance?: number;
  updated_at: string;
  last_refresh_status?: string;
  type: string;
  currency_code: string;
  item_id: string;
  provider_id: number;
  loan_details?: {
    next_payment_date?: string;
    next_payment_amount?: number;
    maturity_date?: string;
    opening_date?: string;
    interest_rate?: number;
    type?: string;
    borrowed_capital?: number;
    repaid_capital?: number;
    remaining_capital?: number;
  };
  pro?: boolean;
  data_access?: string;
  iban?: string;
};

export type BankAccountsResponse = {
  resources: BankAccountResponse[];
  generated_at: string;
  pagination: {
    next_uri: string | null;
  };
};

export type TransactionResponse = {
  id: string;
  clean_description: string;
  provider_description: string;
  amount: number;
  date?: string;
  booking_date?: string;
  transaction_date?: string;
  value_date?: string;
  updated_at: string;
  currency_code: string;
  deleted?: boolean;
  category_id?: number;
  operation_type: string;
  account_id: string;
  future?: boolean;
};

export type TransactionsResponse = {
  resources: TransactionResponse[];
  generated_at: string;
  pagination: {
    next_uri: string | null;
  };
};
