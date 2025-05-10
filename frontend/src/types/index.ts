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

// Post 타입
export interface Post {
    id?: string;
    title: string;                  // 제목
    subtitle?: string;              // 소제목 (선택)
    editor: string;         // 작성자(에디터) 참조
    category: string;
    subCategory: string;
    content: string;                // React-Quill에서 생성된 HTML 문자열
    slug: string;                  // URL 슬러그 (선택)
    postNum: number;
    createdAt: Date;                // 자동 생성
    updatedAt: Date;                // 자동 갱신
};

// 등급
export interface Role { role: 'superman' | 'ironman' | 'human' };