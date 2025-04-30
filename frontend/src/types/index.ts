export interface Editor {
    slug?: number;
    id?: string;  
    name: string;
    imageUrl: string;
    tagline: string;
    des: string;
    socialLinks?: SNSLink[];
}

export interface SNSLink {
    platform: string;
    url: string;
}

export interface Option {
    label: string;
    value: string;
    subCategories?: Option[];
};