export type Order = {
  id: string;
  cardholder_name: string | null;
  customer_email: string | null;
  wallet_address: string;
  price_eth: number;
  payment_tx_hash: string | null;
  status: string;
  network: string | null;
  payment_provider: string | null;
  created_at: string;
  card_products?: {
    name?: string | null;
    card_type?: string | null;
  } | null;
};