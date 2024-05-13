const BASE_URL = "https://information-backend-3n4z.onrender.com";

window.onload = async () => {
    await londdata();
};

const londdata = async () => {
    const userDom = document.getElementById("user");
  // โหลด user จาก API
  console.log("noload");
  const response = await axios.get(`${BASE_URL}/users`);

  console.log(response.data);

  // ดึง  data เข้า  html
 
 let htmlData = "<dev>";
  for (let i = 0; i < response.data.length; i++) {
    let user = response.data[i];

    htmlData += `<div class = 'items'>
        <div class = 'itemone'>
        <div class = fname>ชื่อ: ${user.firstname}</div>
        <div class = lname>${user.lasrname} </div>
        </div>

        <div class = 'itemtwo'>
          <div class = 'age'>อายุ: ${user.age}</div>
          <div class = 'gender'>เพศ: ${user.gender}</div>
        </div>

        <div class = 'itemthree'>
         <div class = 'interest'>สิ่งที่สนใจ: ${user.interests}</div>
         </div>

         <div class = 'itemfour'>
          คำอธิบายเกี่ยวกับฉัน
         <div class = 'description'> ${user.description}</div>
         </div>
        </div>

      
        <div class = 'button'>
        <a href = 'index.html?id=${user.id}'><button>แก้ไข</button></a>
        <button class = 'delete' data-id = ${user.id}>ลบ</button>
        </div>
        </div>
        `;
  }

  htmlData += "</dev>";
  userDom.innerHTML = htmlData;

  const deletsDom = document.getElementsByClassName("delete");

  for (let i = 0; i < deletsDom.length; i++) {
      deletsDom[i].addEventListener('click', async (event) => {
          // ดึง ID ออกมา
          const id = event.target.dataset.id;
          try{
              await axios.delete(`${BASE_URL}/user/${id}`);
              londdata();
          }catch(error){
            console.log(error);
          }
      })
  }
}
