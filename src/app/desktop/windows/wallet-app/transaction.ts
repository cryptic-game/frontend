export interface Transaction {
  id: string;
  time_stamp: string;
  source_uuid: string;
  destination_uuid: string;
  send_amount: number;
  usage: string;
  origin: 0 | 1;
}
