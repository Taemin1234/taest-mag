export interface Editor {
    slug?: number;
    _id?: string;  
    name: string;
    imageUrl: string;
    tagline: string;
    des: string;
    socialLinks: SNSLink[];
}

export interface SNSLink {
    platform: string;
    url: string;
}