export const products = [
  {
    id: 1,
    serialNumber: "SN-1234",
    isNew: 1,
    photo: "/images/placeholder.png",
    title: "UltraMonitor 24",
    type: "Monitors",
    specification: "24 inch, 1080p",
    guarantee: {
      start: "2017-06-29 12:09:33",
      end: "2020-06-29 12:09:33",
    },
    price: [
      { value: 100, symbol: "USD", isDefault: 0 },
      { value: 2600, symbol: "UAH", isDefault: 1 },
    ],
    order: 1,
    date: "2017-06-29 12:09:33",
  },
  {
    id: 2,
    serialNumber: "SN-5678",
    isNew: 0,
    photo: "/images/placeholder.png",
    title: "ProKeyboard X1",
    type: "Keyboards",
    specification: "Mechanical",
    guarantee: {
      start: "2018-03-10 10:00:00",
      end: "2021-03-10 10:00:00",
    },
    price: [
      { value: 50, symbol: "USD", isDefault: 0 },
      { value: 1300, symbol: "UAH", isDefault: 1 },
    ],
    order: 1,
    date: "2018-03-10 10:00:00",
  },
];

export const orders = [
  {
    id: 1,
    title: "Order 1",
    date: "2017-06-29 12:09:33",
    description: "First test order",
    products: products,
  },
  {
    id: 2,
    title: "Order 2",
    date: "2018-08-12 09:15:00",
    description: "Second test order",
    products: [],
  },
];
