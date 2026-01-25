const API = "https://your-backend.onrender.com";
const role = localStorage.getItem("role");

async function addStock(){
  await fetch(API+"/kitchen-stock",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      role
    },
    body:JSON.stringify({
      name:name.value,
      quantity:Number(qty.value)
    })
  });
  loadStock();
}

async function loadStock(){
  const res = await fetch(API+"/kitchen-stock",{headers:{role}});
  const data = await res.json();

  stockTable.innerHTML="<tr><th>Item</th><th>Qty</th></tr>";
  data.forEach(s=>{
    stockTable.innerHTML+=`
      <tr>
        <td>${s.name}</td>
        <td>${s.quantity}</td>
      </tr>
    `;
  });
}

loadStock();
