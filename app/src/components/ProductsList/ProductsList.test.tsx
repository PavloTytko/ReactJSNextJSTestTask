import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductsList from './ProductsList';
import { Product } from '@/store/slices/productsSlice';

jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const products: Product[] = [
  {
    id: 1,
    title: 'Prod A',
    type: 'pc',
    price: [{ value: 100, symbol: '$', isDefault: 1 }],
    serialNumber: 'S1',
  },
  {
    id: 2,
    title: 'Prod B',
    type: 'server',
    price: [{ value: 200, symbol: '$', isDefault: 1 }],
    serialNumber: 'S2',
  },
];

describe('ProductsList', () => {
  it('renders table headers via i18n keys', () => {
    render(<ProductsList products={products} />);
    expect(screen.getByText('products.table.photo')).toBeInTheDocument();
    expect(screen.getByText('products.table.title')).toBeInTheDocument();
    expect(screen.getByText('products.table.type')).toBeInTheDocument();
    expect(screen.getByText('products.table.serial')).toBeInTheDocument();
    expect(screen.getByText('products.table.guarantee')).toBeInTheDocument();
    expect(screen.getByText('products.table.price')).toBeInTheDocument();
    expect(screen.getByText('products.table.order')).toBeInTheDocument();
  });
});
