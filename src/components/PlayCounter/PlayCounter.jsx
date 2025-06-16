import React, { useState, useEffect } from 'react'
import './PlayCounter.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// الكومبوننت الرئيسي
const PlayCounter = () => {

  // تعريف كل الـ States الخاصة بالفورم
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [taxes, setTaxes] = useState('');
  const [ads, setAds] = useState('');
  const [discount, setDiscount] = useState('');
  const [count, setCount] = useState('');
  const [category, setCategory] = useState('');
  const [editId, setEditId] = useState(null);  // للتحكم في وضع التعديل

  // استرجاع البيانات من الـ localStorage عند فتح الصفحة
  const getInitialProducts = () => {
    const saved = localStorage.getItem('product');
    return saved ? JSON.parse(saved) : [];
  };

  // تعريف الـ products من الـ localStorage أول مرة
  const [product, setProduct] = useState(getInitialProducts);

  // حفظ البيانات في الـ localStorage كل ما يتغير الـ product
  useEffect(() => {
    localStorage.setItem('product', JSON.stringify(product));
  }, [product]);

  // دالة لحساب الإجمالي الكلي بناء على الحقول
  const getTotal = () => {
    const p = Number(price) || 0;
    const t = Number(taxes) || 0;
    const a = Number(ads) || 0;
    const d = Number(discount) || 0;
    const c = Number(count) || 0;
    return (p + t + a) * c - d;
  };

  // تفريغ كل الحقول بعد الإنشاء أو التعديل
  const clearForm = () => {
    setTitle('');
    setPrice('');
    setTaxes('');
    setAds('');
    setDiscount('');
    setCount('');
    setCategory('');
    setEditId(null);
  };

  // دالة التحكم في إرسال الفورم (إضافة أو تعديل)
  const handleSubmit = (e) => {
    e.preventDefault();

    // التأكد من وجود بيانات أساسية
    if (title && price && count && category) {
      if (editId !== null) {
        // تعديل منتج موجود
        setProduct(product.map(item =>
          item.id === editId
            ? {
                ...item,
                title,
                price,
                taxes,
                ads,
                discount,
                count,
                category,
                total: getTotal()
              }
            : item
        ));
      } else {
        // إنشاء منتج جديد
        const newProduct = {
          id: Date.now(),  // توليد ID فريد من الزمن
          title,
          price,
          taxes,
          ads,
          discount,
          count,
          category,
          total: getTotal()
        };
        setProduct([...product, newProduct]);
      }
      clearForm();
    }
  };

  // تحميل بيانات المنتج داخل الفورم للتعديل
  const handleUpdate = (item) => {
    setTitle(item.title);
    setPrice(item.price);
    setTaxes(item.taxes);
    setAds(item.ads);
    setDiscount(item.discount);
    setCount(item.count);
    setCategory(item.category);
    setEditId(item.id);  // تفعيل وضع التعديل
  };

  // حذف منتج من القائمة
  const handleDelete = (id) => {
    setProduct(product.filter(item => item.id !== id));
    if (editId === id) clearForm(); // لو كان في وضع تعديل المنتج المحذوف
  };

  return (
    <>
      <div className='container py-4'>

        {/* نموذج إضافة أو تعديل المنتجات */}
        <form onSubmit={handleSubmit}>
          <div className="row mb-4">
            <div className="col-12 text-center text-uppercase fw-bold">
              <h2>crud</h2>
              <p className='text-muted'>product management system</p>
            </div>
          </div>

          {/* حقول إدخال البيانات */}
          <div className="row mb-3">
            <div className="col-12">
              <input type="text" className="form-control text-center fw-bold rounded-3" placeholder="اسم السلعة" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>

          <div className="row gy-3 mb-3">
            <div className="col-md-2 col-sm-4 col-6">
              <input type="number" className="form-control fw-bold text-center rounded-3" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="col-md-2 col-sm-4 col-6">
              <input type="number" className="form-control fw-bold text-center rounded-3" placeholder="الضرائب" value={taxes} onChange={(e) => setTaxes(e.target.value)} />
            </div>
            <div className="col-md-2 col-sm-4 col-6">
              <input type="number" className="form-control fw-bold text-center rounded-3" placeholder="الإعلانات" value={ads} onChange={(e) => setAds(e.target.value)} />
            </div>
            <div className="col-md-2 col-sm-4 col-6">
              <input type="number" className="form-control fw-bold text-center rounded-3" placeholder="الخصم" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div className="col-md-2 col-sm-4 col-6">
              <input type="number" className="form-control fw-bold text-center rounded-3" placeholder="عدد السلع" value={count} onChange={(e) => setCount(e.target.value)} />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex align-items-center justify-content-center">
              <small id="total" className="text-primary fw-bold" style={{ cursor: 'pointer' }}>
                الإجمالي : {getTotal()}
              </small>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12">
              <input type="text" className="form-control fw-bold text-center rounded-3" placeholder="النوع" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
          </div>

          {/* زر إنشاء أو تعديل حسب حالة الفورم */}
          <div className="row">
            <div className="col-12 text-center">
              <button style={{ width: '100%' }} type="submit" className={`btn px-5 fw-bold ${editId !== null ? 'btn-warning' : 'btn-primary'}`}>
                {editId !== null ? 'تعديل' : 'انشاء'}
              </button>
              {editId !== null && (
                <button type="button" className="btn btn-secondary ms-2" onClick={clearForm}>
                  إلغاء
                </button>
              )}
            </div>
          </div>
        </form>

        {/* جدول عرض المنتجات */}
        <div className="row d-flex justify-content-center">
          <div className="col-12">
            <div className="table col-6-md">
              <table className="table table-hover mt-3 fw-bold ">
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>الاسم</th>
                    <th>السعر</th>
                    <th>الضرائب</th>
                    <th>الإعلانات</th>
                    <th>الخصم</th>
                    <th>عدد السلع</th>
                    <th>الإجمالي</th>
                    <th>النوع</th>
                    <th>التعديل</th>
                    <th>الحذف</th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.price}</td>
                      <td>{item.taxes}</td>
                      <td>{item.ads}</td>
                      <td>{item.discount}</td>
                      <td>{item.count}</td>
                      <td>{item.total}</td>
                      <td>{item.category}</td>
                      <td>
                        <button className="btn btn-primary" onClick={() => handleUpdate(item)}>تعديل</button>
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default PlayCounter;
