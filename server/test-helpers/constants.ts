export const Collections = {
  CatchAll: 'catchAll',
  Homesteads: 'homesteads',
  Users: 'users',
} as const;
export type Collections = Enum<typeof Collections>;
