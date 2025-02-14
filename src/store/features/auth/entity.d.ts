import { Nullable, TAuth } from "~/entities";

export type TAuthState = Nullable<TAuth> & {
  error: string | null;
};
