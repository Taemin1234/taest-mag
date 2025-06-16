// 카테고리 value - label 변환 함수
import { CATEGORIES } from '@/constants/categories'

export function getCategoryLabel(value: string): string {
    const category = CATEGORIES.find(cat => cat.value === value);
    return category ? category.label : value;
}