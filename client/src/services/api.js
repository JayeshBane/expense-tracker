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

export const exportExpenses = async (filters, format) => {
  try {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries({ ...filters, format }).filter(([, v]) => v != null),
      ),
    );

    const response = await client.get(`/expenses/export?${params}`, {
      responseType: "blob",
    });

    // Build a filename from the current date
    const date = new Date().toISOString().slice(0, 10);
    const ext = format === "excel" ? "xlsx" : "csv";
    const filename = `expenses-${date}.${ext}`;

    // Create a temporary anchor and trigger the download
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { ok: true };
  } catch (err) {
    const message = err.response?.data?.error ?? "Export failed";
    return { ok: false, error: message };
  }
};
