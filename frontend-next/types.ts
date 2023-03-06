export type Transcript = {
  id:         number;
  title:      string;
  details:    string;
  reviewedAt: Nullable<Date>;
  claimedAt:  Nullable<Date>;
  createdAt:  Nullable<Date>;
  updatedAt:  Nullable<Date>;
  claimedBy:  Nullable<number>;
  userId:     Nullable<number>;
}

type Nullable<T> = T | null