import {create} from 'zustand';

export interface ChatState {
  roomId: string;
  setRoomId: (id: string) => void;

  recipientId: string;
  setRecipientId: (id: string) => void;

  senderId: string;
  setSenderId: (id: string) => void;

  productTitle: string;
  setProductTitle: (title: string) => void;
}

const useChatStore = create<ChatState>()((set) => ({
  roomId: '',
  setRoomId: (id) => set(() => ({roomId: id})),

  recipientId: '',
  setRecipientId: (id) => set(() => ({recipientId: id})),

  senderId: '',
  setSenderId: (id) => set(() => ({senderId: id})),

  productTitle: '',
  setProductTitle: (title) => set(() => ({productTitle: title})),
}));

export default useChatStore;
