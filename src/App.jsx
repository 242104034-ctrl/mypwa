import { useState, useEffect } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // İşlem ekleme
  const addTransaction = () => {
    if (!amount || isNaN(amount)) return;

    const newTransaction = {
      id: crypto.randomUUID(),
      value: Number(amount),
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount("");
  };

  // Tüm işlemleri silme
  const clearTransactions = () => {
    if (window.confirm("Tüm işlemleri silmek istediğinize emin misiniz?")) {
      setTransactions([]);
    }
  };

  // Tek bir işlemi silme
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Toplam gelir (pozitifler)
  const totalIncome = transactions
    .filter((t) => t.value > 0)
    .reduce((acc, t) => acc + t.value, 0);

  // Toplam gider (negatifler)
  const totalExpense = transactions
    .filter((t) => t.value < 0)
    .reduce((acc, t) => acc + t.value, 0);

  // Bakiye (gelir + gider)
  const balance = totalIncome + totalExpense;

  // localStorage’a kaydetme
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <div style={{ width: "300px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Expense Tracker</h2>

      <div style={{ marginBottom: "12px" }}>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Tutar (+ gelir / - gider)"
          style={{ width: "100%", padding: "8px" }}
        />
        <button
          onClick={addTransaction}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "8px",
            background: "#4caf50",
            color: "white",
            border: "none",
          }}
        >
          Ekle
        </button>
      </div>

      <div
        style={{
          background: "#e81f1fff",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "12px",
        }}
      >
        <p><strong>Toplam Gelir:</strong> {totalIncome} ₺</p>
        <p><strong>Toplam Gider:</strong> {totalExpense} ₺</p>
        <p><strong>Bakiye:</strong> {balance} ₺</p>

        <button
          onClick={clearTransactions}
          style={{
            width: "100%",
            padding: "8px",
            background: "#8236f4ff",
            color: "white",
            border: "none",
            marginTop: "8px",
            borderRadius: "4px",
          }}
        >
          Tüm İşlemleri Sil
        </button>
      </div>

      <h3>İşlemler</h3>
      <ul>
        {transactions.map((t) => (
          <li
            key={t.id}
            style={{
              color: t.value > 0 ? "green" : "red",
              marginBottom: "4px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{t.value > 0 ? "+" : ""}{t.value} ₺</span>
            <button
              onClick={() => deleteTransaction(t.id)}
              style={{
                background: "#ee3225ff",
                color: "white",
                border: "none",
                padding: "2px 6px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



  