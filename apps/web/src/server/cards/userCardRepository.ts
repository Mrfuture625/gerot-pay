import { mockCards } from "@/mock/cards";

export async function getUserCards() {
  return mockCards;
}

export async function getUserCardById(cardId: string) {
  return mockCards.find((card) => card.id === cardId) ?? mockCards[0];
}