const API = "https://your-backend-name.onrender.com";
const role = localStorage.getItem("role");

async function addSale(){
  await fetch(API + "/kitchen-sale", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      role
    },
    body: JSON.stringify({
      item: item.value,
      quantity: Number(qty.value),
      price: Number(price.value),
      total: Number(qty.value) * Number(price.value)
    })
  });

  loadSales();
}

async function loadSales(){
  const res = await fetch(API + "/kitchen-sales", {
    headers: { role }
  });
  const data = await res.json();

  salesTable.innerHTML =
    "<tr><th>Item</th><th>Qty</th><th>Total</th></tr>";

  data.forEach(s => {
    salesTable.innerHTML += `
      <tr>
        <td>${s.item}</td>
        <td>${s.quantity}</td>
        <td>₦${s.total}</td>
      </tr>
    `;
  });
}

loadSales();
