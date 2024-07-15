export type FilterOption = {
  label: string;
  value: string;
  parent?: string;
  collectionHandle: string | null;
};

export type MMYFilterResponse = {
  partTypes: FilterOption[];
  makes: FilterOption[];
  models: FilterOption[];
  years: FilterOption[];
};

export type RedirectEntry = {
  destination: string;
  permanent: boolean;
};
