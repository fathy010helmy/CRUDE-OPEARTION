import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ControllClients = () => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [selectedClient, setSelectedClient] = useState(null);
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('debit');
  const [transactionDate, setTransactionDate] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  // إضافة عميل جديد
  const handleAddClient = (e) => {
    e.preventDefault();
    if (name && phone) {
      const newClient = {
        id: Date.now(),
        name,
        phone,
        notes,
        transactions: []
      };
      setClients([...clients, newClient]);
      setName('');
      setPhone('');
      setNotes('');
    }
  };

  // حذف عميل
  const handleDeleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
    if (selectedClient?.id === id) setSelectedClient(null);
  };

  // اختيار العميل وعمل Toggle
  const handleSelectClient = (client) => {
    if (selectedClient?.id === client.id) {
      setSelectedClient(null); // لو ضغطت تاني على نفس العميل يقفل
    } else {
      setSelectedClient(client);
      setEditingTransaction(null);
    }
  };

  // إضافة أو تعديل عملية مالية
  const handleTransactionSubmit = (e) => {
    e.preventDefault();

    if (!selectedClient) return;

    const newTransaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      productName,
      productType,
      amount: parseFloat(amount),
      type: transactionType,
      date: transactionDate || new Date().toISOString().slice(0, 10),
    };

    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        const updatedTransactions = editingTransaction
          ? client.transactions.map(t => (t.id === editingTransaction.id ? newTransaction : t))
          : [...client.transactions, newTransaction];

        return { ...client, transactions: updatedTransactions };
      }
      return client;
    });

    setClients(updatedClients);
    setSelectedClient(updatedClients.find(c => c.id === selectedClient.id));
    clearTransactionForm();
  };

  // حذف العملية
  const handleDeleteTransaction = (transactionId) => {
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        const updatedTransactions = client.transactions.filter(t => t.id !== transactionId);
        return { ...client, transactions: updatedTransactions };
      }
      return client;
    });

    setClients(updatedClients);
    setSelectedClient(updatedClients.find(c => c.id === selectedClient.id));
  };

  // بدء التعديل
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setProductName(transaction.productName);
    setProductType(transaction.productType);
    setAmount(transaction.amount);
    setTransactionType(transaction.type);
    setTransactionDate(transaction.date);
  };

  // تفريغ بيانات فورم العملية
  const clearTransactionForm = () => {
    setEditingTransaction(null);
    setProductName('');
    setProductType('');
    setAmount('');
    setTransactionType('debit');
    setTransactionDate('');
  };

  // حساب الرصيد بناء على الثلاثة أنواع
  const calculateBalance = (transactions) => {
    return transactions.reduce((total, t) => {
      if (t.type === 'debit') return total - t.amount;
      if (t.type === 'credit') return total + t.amount;
      if (t.type === 'payment') return total - t.amount;
      return total;
    }, 0);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">إدارة العملاء والمعاملات المالية</h2>

      {/* فورم إضافة عميل */}
      <form className="mb-4" onSubmit={handleAddClient}>
        <div className="row g-2">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="اسم العميل" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="رقم الهاتف" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="ملاحظات" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">إضافة</button>
          </div>
        </div>
      </form>

      {/* جدول العملاء */}
      <div className="table-responsive mb-5">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>اسم العميل</th>
              <th>رقم الهاتف</th>
              <th>الملاحظات</th>
              <th>الرصيد</th>
              <th>العمليات</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr><td colSpan="7">لا يوجد عملاء</td></tr>
            ) : (
              clients.map((client, idx) => (
                <tr key={client.id}>
                  <td>{idx + 1}</td>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>{client.notes || '-'}</td>
                  <td>{calculateBalance(client.transactions)}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => handleSelectClient(client)}>
                      {selectedClient?.id === client.id ? 'إخفاء العمليات' : 'عرض العمليات'}
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClient(client.id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* العمليات المالية الخاصة بالعميل المحدد */}
      {selectedClient && (
        <>
          <h4 className="mb-3">المعاملات الخاصة بـ {selectedClient.name}</h4>

          <form className="mb-4" onSubmit={handleTransactionSubmit}>
            <div className="row g-2">
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="اسم المنتج" value={productName} onChange={e => setProductName(e.target.value)} required />
              </div>
              <div className="col-md-2">
                <input type="text" className="form-control" placeholder="نوع المنتج" value={productType} onChange={e => setProductType(e.target.value)} required />
              </div>
              <div className="col-md-2">
                <input type="number" className="form-control" placeholder="المبلغ" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
              <div className="col-md-2">
                <select className="form-control" value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                  <option value="debit">مدين</option>
                  <option value="credit">دائن</option>
                  <option value="payment">دفع</option>
                </select>
              </div>
              <div className="col-md-2">
                <input type="date" className="form-control" value={transactionDate} onChange={e => setTransactionDate(e.target.value)} />
              </div>
              <div className="col-md-1">
                <button type="submit" className={`btn ${editingTransaction ? 'btn-warning' : 'btn-primary'} w-100`}>
                  {editingTransaction ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center">
              <thead className="table-light">
                <tr>
                  <th>اسم المنتج</th>
                  <th>نوع المنتج</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th>تعديل</th>
                  <th>حذف</th>
                </tr>
              </thead>
              <tbody>
                {selectedClient.transactions.length === 0 ? (
                  <tr><td colSpan="7">لا يوجد معاملات</td></tr>
                ) : (
                  selectedClient.transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.productName}</td>
                      <td>{t.productType}</td>
                      <td>{t.amount}</td>
                      <td>{t.type === 'debit' ? 'مدين' : 'دائن' }</td>
                      <td>{t.date}</td>
                      <td>
                        <button className="btn btn-warning btn-sm" onClick={() => handleEditTransaction(t)}>
                          تعديل
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTransaction(t.id)}>
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ControllClients;
