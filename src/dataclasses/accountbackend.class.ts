export class AccountBackend {
  username: string;
  email: string;
}

export class OwnerBackend {
  owner: AccountBackend;
}
