export interface Transaction {

  id: string;
  time_stamp: Date;
  source_uuid: string;
  destination_uuid: string;
  send_amount: number;
  usage: string;
  origin: 0 | 1;

}
