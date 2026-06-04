export type Effect = {
    id: string;
    nameKey: string;
    descriptionKey: string;
    icon: string;
    permanent: boolean;
    expiresAt?: number;
};
