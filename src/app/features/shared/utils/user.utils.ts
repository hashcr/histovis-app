import { User } from "src/app/core/models/user.model";

export function getAuthor(user: User | null | undefined): string {
    if (!user) return "Unknown Author";

    const first = (user.firstName || "").trim();
    const last = (user.lastName || "").trim();
    const full = [first, last].filter(Boolean).join(" ");
    return full || "Unknown Author";
}