export type ActivationEmailPayload = {
  email: string;
  token: string;
};

export type AlertMovieReleasePayload = {
  email: string;
  content: {
    title: string;
    description: string;
    releaseDate: string;
  };
};
