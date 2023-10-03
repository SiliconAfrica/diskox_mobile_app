export interface IModerator {
    id: number;
    username: string;
    profile_image: string;
    role: string;
    permissions: Array<{ permission: string}>;
    
}