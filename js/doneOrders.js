// إعداد Firebase Firestore
const firebaseConfig = {
    apiKey: "AIzaSyDwMiCfdg9yeaSUSsTvqaTrNBWhK71eXSU",
    authDomain: "clothes-brand-e3f32.firebaseapp.com",
    projectId: "clothes-brand-e3f32",
    storageBucket: "clothes-brand-e3f32.appspot.com",
    messagingSenderId: "510550881692",
    appId: "1:510550881692:web:f5c073b95a4293602dc459",
    measurementId: "G-YP0WXW5W3G"
  };
  
  // تهيئة Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // دالة لإظهار رسالة إشعار الطلب
  function showToast() {
    const toastElement = document.getElementById('orderToast');
    const timestamp = new Date().toLocaleTimeString();
    document.getElementById('toastTimestamp').innerText = timestamp;
  
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
  
 // دالة لعرض الطلبات الغير مكتملة
function displayOrders() {
    const ordersContainer = document.getElementById("ordersContainer");
    if (!ordersContainer) {
      console.error("Error: The orders container element was not found.");
      return;
    }
  
    ordersContainer.innerHTML = ""; // تفريغ المحتوى القديم
  
    // استخدام onSnapshot للاستماع إلى التغييرات في الطلبات
    db.collection("orders").where("done", "==", true).onSnapshot((ordersSnapshot) => {
      ordersContainer.innerHTML = ""; // تفريغ المحتوى القديم عند التحديث
  
      ordersSnapshot.forEach((docSnapshot) => {
        const order = docSnapshot.data();
        const orderId = docSnapshot.id;
  
        // إنشاء عناصر HTML لكل طلب
        const orderDiv = document.createElement("div");
        orderDiv.className = "order-item";
        orderDiv.innerHTML = `
          <div class="order-header">Order ID: ${orderId}</div>
          <div class="order-info"><strong>Name:</strong> ${order.name || "N/A"}</div>
          <div class="order-info"><strong>Phone:</strong> ${order.phone || "N/A"}</div>
          <div class="order-info"><strong>Email:</strong> ${order.email || "N/A"}</div>
          <div class="order-info"><strong>Address:</strong> ${order.address || "N/A"}</div>
          <div class="order-info">
   
          <div class="item-list">
            <strong>Items:</strong>
            ${order.items ? order.items.map((item, index) => `
              <div class="item-details">
                ${index + 1}. ${item.title || "Untitled"} - Price: $${item.price || 0}, Quantity: ${item.quantity || 0}
              </div>
            `).join("") : "No items"}
          </div>
          <button class="btn btn-complete" onclick="markOrderAsUnDone('${orderId}')">✘ Complete Order</button>
        `;
        ordersContainer.appendChild(orderDiv);
      });
    }, (error) => {
      console.error("Error fetching orders: ", error);
    });
  }
  
  // عرض الطلبات عند تحميل الصفحة
  document.addEventListener("DOMContentLoaded", function() {
    displayOrders();
  });
  
  // دالة لتحديث حالة الطلب كـ 'done'
  async function markOrderAsUnDone(orderId) {
    try {
      const orderDocRef = db.collection("orders").doc(orderId);
      await orderDocRef.update({ done: false });
      console.log("Order marked as done:", orderId);
      displayOrders(); // تحديث القائمة بعد التحديث
    } catch (error) {
      console.error("Error updating order: ", error);
    }
  }
  
