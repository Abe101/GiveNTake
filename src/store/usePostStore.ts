import {create} from 'zustand';

export interface PostState {
  id: string;
  setId: (newId: string) => void;
  email: string;
  setEmail: (newEmail: string) => void;

  productTitle: string;
  setProductTitle: (productTitle: string) => void;

  recipient: string;
  setRecipient: (recipient: string) => void;

  sender: string;
  setSender: (sender: string) => void;

  roomId: string;
  setRoomId: (roomId: string) => void;
}

const usePostStore = create<PostState>()((set) => ({
  id: '',
  setId: (newId) => set(() => ({id: newId})),
  email: '',
  setEmail: (newEmail) => set(() => ({email: newEmail})),
  productTitle: '',
  setProductTitle: (productTitle) => set(() => ({productTitle})),
  recipient: '',
  setRecipient: (recipient) => set(() => ({recipient})),
  sender: '',
  setSender: (sender) => set(() => ({sender})),
  roomId: '',
  setRoomId: (roomId) => set(() => ({roomId})),
}));

export default usePostStore;
