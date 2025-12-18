export type RecipeFormState = {
  message: string | null;
  errors: Record<string, string[]>;
};

// type UserFormState = {
//   message: string | null;
//   errors: Record<string, string[]>;
//   ok?: boolean;
//   shouldRefresh?: boolean;
//   patch?: { country?: string; language?: string };
// };

export type UserErrorKey =
  | "name"
  | "user_name"
  | "last_name"
  | "email"
  | "password"
  | "confirm_password";

export type UpdateUserResult = {
  message: string | null;
  errors: Record<string, string[]>;
  ok: boolean;
  shouldRefresh?: boolean;
};
