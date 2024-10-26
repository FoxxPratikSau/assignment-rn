// models/userModel.ts

export interface Card {
    id: number;
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    type: string;
    isDefault: boolean;
  }
  
  export interface Transaction {
    id: number;
    cardId: number;
    amount: number;
    date: string;
    description: string;
    category: string;
    status: string;
  }
  
  export interface Transactions {
    [key: string]: Transaction[]; 
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    cards: Card[];
  }
  
  export interface Record {
    user: User;
    transactions: Transactions;
  }
  
  export interface ApiResponse {
    record: Record;
    metadata: {
      id: string;
      private: boolean;
      createdAt: string;
    };
  }
  