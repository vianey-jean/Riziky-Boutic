
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SavedCard {
  id: string;
  maskedNumber: string;
  cardType: 'visa' | 'mastercard' | 'american-express' | 'other';
  cardName: string;
  expiryDate: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CardData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

class CardsAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken'); // Utiliser 'authToken' au lieu de 'token'
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getUserCards(): Promise<SavedCard[]> {
    const response = await axios.get(`${API_BASE_URL}/api/cards`, {
      headers: this.getAuthHeaders()
    });
    return response.data.data;
  }

  async getCard(cardId: string): Promise<CardData & { id: string; cardType: string; isDefault: boolean }> {
    const response = await axios.get(`${API_BASE_URL}/api/cards/${cardId}`, {
      headers: this.getAuthHeaders()
    });
    return response.data.data;
  }

  async addCard(cardData: CardData, setAsDefault: boolean = false): Promise<string> {
    const response = await axios.post(`${API_BASE_URL}/api/cards`, {
      ...cardData,
      setAsDefault
    }, {
      headers: this.getAuthHeaders()
    });
    return response.data.cardId;
  }

  async setDefaultCard(cardId: string): Promise<void> {
    await axios.put(`${API_BASE_URL}/api/cards/${cardId}/default`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  async deleteCard(cardId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/cards/${cardId}`, {
      headers: this.getAuthHeaders()
    });
  }
}

export const cardsAPI = new CardsAPI();
