import { Option } from '@/types/index'
  
export const CATEGORIES: Option[] = [
    {
      label: 'Food & Beverage',
      value: 'fnb',
      subCategories: [
        { label: 'Food', value: 'food' },
        { label: 'Drinks & Alcohol', value: 'drinknalcohol' },
      ],
    },
    {
      label: 'Tech',
      value: 'tech',
      subCategories: [
        { label: 'Review', value: 'review' },
        { label: 'News', value: 'news' },
      ],
    },
    {
      label: 'Culture',
      value: 'culture',
      subCategories: [
        { label: 'Music', value: 'music' },
        { label: 'Moive&Drama', value: 'moivendrama' },
        { label: 'Arts', value: 'arts' },
      ],
    },
    {
        label: 'Living',
        value: 'living',
        subCategories: [
          { label: 'Interior', value: 'interior' },
          { label: 'Items', value: 'items' },
          { label: 'Vehicle', value: 'vehicle' },
        ],
      },
      {
        label: 'People',
        value: 'people',
        subCategories: [
          { label: 'Interview', value: 'interview' },
          { label: 'Introduce', value: 'introduce' },
        ],
      }
];