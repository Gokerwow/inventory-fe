import { useMemo, useState, type ReactNode } from "react";
import { TagContext } from "./TagContext";

export function TagProvider({ children }: { children: ReactNode }){
    const [tag, setTag] = useState<string | null>(null)

    const value = useMemo(() => ({
        tag,
        setTag
    }), [tag])

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <TagContext.Provider value={value as any}>
            {children}
        </TagContext.Provider>
    )
}