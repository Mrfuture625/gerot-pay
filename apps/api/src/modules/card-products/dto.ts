export class CardProductDto {
  id!: string;
  name!: string;
  cardType!: "virtual" | "physical";
  priceUsd!: number;
  stock!: number | null;
  description!: string | null;
  isActive!: boolean;
}