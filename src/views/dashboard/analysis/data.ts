export interface GrowCardItem {
  icon: string;
  title: string;
  value: number;
  total: number;
  color: string;
  action: string;
}

export const growCardList: GrowCardItem[] = [
  {
    title: "FIRE 目标",
    icon: "transaction|svg",
    value: 1000,
    total: 50000,
    color: "purple",
    action: "总",
  },
];
