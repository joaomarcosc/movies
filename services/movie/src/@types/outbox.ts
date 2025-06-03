export type OutboxMessageType = {
  email: string;
  content: {
    title: string;
    description: string;
    releaseDate: string;
  };
  runAfter?: Date;
};
