export enum CardType {
  Virtual = 0,
  Physical = 1,
}

export function getCardType(cardType: string): CardType {
  return cardType === "physical"
    ? CardType.Physical
    : CardType.Virtual;
}