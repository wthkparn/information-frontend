const BASE_URL = "https://information-backend-3n4z.onrender.com";

let mod = "CREATE"; // defaull
let selectedID = "";

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  console.log("id", id);

  if (id) {
    mod = "EDIT";
    selectedID = id;

    

    try {
      // ดึงข้อมูลเก่า
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      const user = response.data

      // นำข้อมูลใส่กลับเข้าไปใน input HTML
      let firstNameDom = document.querySelector('input[name="fname"]');
      let lastNameDom = document.querySelector('input[name="lname"]');
      let ageDom = document.querySelector('input[name="age"]');

      let genderDoms = document.querySelectorAll('input[name="gender"]');
      let interestDoms = document.querySelectorAll('input[name="interest"]');

      let descriptionDom = document.querySelector('textarea[name="description"]');

      firstNameDom.value = user.firstname;
      lastNameDom.value = user.lasrname;
      ageDom.value = user.age;
      descriptionDom.value = user.description;

      for (let i = 0; i < genderDoms.length; i++) {
        if (genderDoms[i].value == user.gender) {
          genderDoms[i].checked = true;
        }
      }

      for (let i = 0; i < interestDoms.length; i++) {
        if (user.interests.includes(interestDoms[i].value)) {
          interestDoms[i].checked = true;
      }
    }
  
    } catch (error) {
      console.log("error", error);
    }

    
  }
};

const submitData = async () => {
  event.preventDefault(); // ป้องกันการรีโหลดหน้าเว็บ

  let firstNameDom = document.querySelector('input[name="fname"]');
  let lastNameDom = document.querySelector('input[name="lname"]');
  let ageDom = document.querySelector('input[name="age"]');

  let genderDom = document.querySelector('input[name="gender"]:checked') || {};
  let interestDoms =
    document.querySelectorAll('input[name="interest"]:checked') || {};

  let descriptionDom = document.querySelector('textarea[name="description"]');

  let messageDom = document.getElementById("message");

  try {
    let interest = "";
    for (let i = 0; i < interestDoms.length; i++) {
      interest += interestDoms[i].value;
      if (i != interestDoms.length - 1) {
        interest += ",";
      }
    }

    let userData = {
      firstname: firstNameDom.value,
      lasrname: lastNameDom.value,
      age: ageDom.value,
      gender: genderDom.value,
      description: descriptionDom.value,
      interests: interest,
    };
    console.log(userData);

    const errors = validateData(userData);
    if (errors.length > 0) {
      // มี error เกิดขึ้น
      throw {
        message: "กรอกข้อมูลให้ถูกต้อง",
        errors: errors,
      };
    }

    let message = "บันทึกข้อมูลเรียบร้อยแล้ว"
    
    if (mod === "CREATE") {
      // ส่งข้อมูล
    const response = await axios.post(`${BASE_URL}/user`, userData);
    console.log("response", response.data);
    }else {
      const response = await axios.put(`${BASE_URL}/user/${selectedID}`, userData);
      console.log("response", response.data);
      message = 'แก้ไขข้อมูลเรียบร้อยแล้ว'
    }



    messageDom.innerText = message;
    messageDom.className = "message success";
  } catch (error) {
    console.log(error.message);
    console.log(error.errors);
    if (error.response) {
      console.log(error.response.data.message);
    }

    let htmlData = "<div>";
    htmlData += `<div>${error.message}</div>`;
    // loop error
    for (let i = 0; i < error.errors.length; i++) {
      htmlData += `<li>${error.errors[i]}</li>`;
    }
    htmlData += "</div>";

    messageDom.innerHTML = htmlData;
    messageDom.className = "message denger";
  }
  clear();
};

const clear = () => {
  let firstNameDom = document.querySelector('input[name="fname"]');
  let lastNameDom = document.querySelector('input[name="lname"]');
  let ageDom = document.querySelector('input[name="age"]');
  let genderDom = document.querySelector('input[name="gender"]:checked');
  let interestDoms = document.querySelectorAll(
    'input[name="interest"]:checked'
  );
  let descriptionDom = document.querySelector('textarea[name="description"]');

  // Clear first name, last name, and age
  firstNameDom.value = "";
  lastNameDom.value = "";
  ageDom.value = "";

  // Clear description
  descriptionDom.value = "";

  // Clear gender selection
  if (genderDom) {
    genderDom.checked = false;
  }

  // Clear interest selections
  interestDoms.forEach((interest) => {
    interest.checked = false;
  });
};

// ตรวจสอบข้อมูล
const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("กรุณากรอกชื่อจริง");
  }
  if (!userData.lasrname) {
    errors.push("กรุณากรอกนามสกุล");
  }
  if (!userData.age) {
    errors.push("กรุณากรอกอายุ");
  }
  if (!userData.gender) {
    errors.push("กรุณากรอกเลือกเพศ");
  }
  if (!userData.description) {
    errors.push("กรุณาเลือกความสนใจ");
  }
  if (!userData.interests) {
    errors.push("กรุณากรอกรายละเอียด");
  }

  return errors;
};
