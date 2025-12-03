import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OrdersList from "./OrdersList";
import { Order } from "@/store/slices/ordersSlice";

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (k: string, opts?: any) => {
      if (k === "orders.deleteAria" && opts?.title)
        return `Delete ${opts.title}`;
      return k;
    },
  }),
}));

const orders: Order[] = [
  {
    id: 1,
    title: "Order A",
    date: new Date().toISOString(),
    description: "",
    products: [],
  },
  {
    id: 2,
    title: "Order B",
    date: new Date().toISOString(),
    description: "",
    products: [],
  },
];

describe("OrdersList", () => {
  it("shows loading text when loading is true", () => {
    render(
      <OrdersList
        orders={[]}
        loading
        onSelect={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("orders.loading")).toBeInTheDocument();
  });

  it("renders orders and delete button", () => {
    const onSelect = jest.fn();
    const onDelete = jest.fn();
    render(
      <OrdersList orders={orders} onSelect={onSelect} onDelete={onDelete} />,
    );
    expect(screen.getByText("orders.title")).toBeInTheDocument();
    expect(screen.getByText("Order A")).toBeInTheDocument();
    const delBtn = screen.getAllByRole("button", { name: "common.delete" })[0];
    fireEvent.click(delBtn);
    expect(onDelete).toHaveBeenCalled();
  });
});
