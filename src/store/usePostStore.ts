import {create} from 'zustand';

export interface PostState {
  id: string;
  setId: (newId: string) => void;
  email: string;
  setEmail: (newEmail: string) => void;
}

const usePostStore = create<PostState>()((set) => ({
  id: '',
  setId: (newId) => set(() => ({id: newId})),
  email: '',
  setEmail: (newEmail) => set(() => ({email: newEmail})),
}));

export default usePostStore;
