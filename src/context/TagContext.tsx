import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface TagContextType {
    tag: string | null
    setTag: Dispatch<SetStateAction<string | null>>;
}

export const TagContext = createContext<TagContextType | null>(null)