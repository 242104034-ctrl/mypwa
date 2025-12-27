import { useState, useEffect } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const addTransaction = () => {
    if (!amount || isNaN(amount)) return;

    const newTransaction = {
      id: crypto.randomUUID(),
      value: Number(amount),
      date: date, // Manuel seçilen tarih
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount("");
  };

  const clearTransactions = () => {
    if (window.confirm("Tüm işlemleri silmek istediğinize emin misiniz?")) {
      setTransactions([]);
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalIncome = transactions
    .filter((t) => t.value > 0)
    .reduce((acc, t) => acc + t.value, 0);

  const totalExpense = transactions
    .filter((t) => t.value < 0)
    .reduce((acc, t) => acc + t.value, 0);

  const balance = totalIncome + totalExpense;

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const transactionsByDay = transactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {});

  const saveDailyFile = (date) => {
    const dayTransactions = transactionsByDay[date];
    const blob = new Blob([JSON.stringify(dayTransactions, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `islemler-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: "300px", fontFamily: "Arial" }}>
      <h2>Expense Tracker</h2>

      <div style={{ marginBottom: "12px" }}>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Tutar (+ gelir / - gider)"
          style={{ width: "100%", padding: "8px" }}
        />

        {/* Tarih Seçme Kutusu */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "6px" }}
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

      <h3>Günlük İşlemler</h3>

      {Object.keys(transactionsByDay).map((day) => (
        <div
          key={day}
          style={{
            background: "#333",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "bold", color: "white" }}>
            {day}
          </p>

          <ul style={{ paddingLeft: "18px" }}>
            {transactionsByDay[day].map((t) => (
              <li
                key={t.id}
                style={{
                  color: t.value > 0 ? "lime" : "tomato",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{t.value > 0 ? "+" : ""}{t.value} ₺</span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  style={{
                    background: "#e81f1f",
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

          <button
            onClick={() => saveDailyFile(day)}
            style={{
              width: "100%",
              padding: "6px",
              background: "#646cff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginTop: "6px",
              cursor: "pointer",
            }}
          >
            Günü Dosya Olarak Kaydet
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;





  