import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export const getExpenses = (p) => {
  return client.get("/expenses", { params: p }).then((r) => r.data);
};

export const createExpense = (data) => {
  return client.post("/expenses", data).then((r) => r.data);
};

export const updateExpense = (id, d) => {
  return client.put(`/expenses/${id}`, d).then((r) => r.data);
};

export const deleteExpense = (id) => {
  return client.delete(`/expenses/${id}`);
};

export const getCategories = () => {
  return client.get("/categories").then((r) => r.data);
};

export const createCategory = (data) => {
  return client.post("/categories", data).then((r) => r.data);
};

export const getPaymentMethods = () => {
  return client.get("/payment-methods").then((r) => r.data);
};

export const createPaymentMethod = (data) => {
  return client.post("/payment-methods", data).then((r) => r.data);
};

export const getBarChartData = (s, e) => {
  return client
    .get("/charts/bar", { params: { start: s, end: e } })
    .then((r) => r.data);
};

export const getLineChartData = (m) => {
  return client
    .get("/charts/line", { params: { months: m } })
    .then((r) => r.data);
};

export const getPieChartData = (s, e) => {
  return client
    .get("/charts/pie", { params: { start: s, end: e } })
    .then((r) => r.data);
};

export const exportExpenses = (f, fmt) => {
  window.location.href = `/api/expenses/export?${new URLSearchParams({ format: fmt, ...f })}`;
};
