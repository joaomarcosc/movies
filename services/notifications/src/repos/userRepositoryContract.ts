interface ListAllUsersEmailReturn {
  email: string;
}

export interface UserRepositoryContract {
  listAllUsersEmail(): Promise<ListAllUsersEmailReturn[]>;
}
