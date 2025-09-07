console.log("✅ AutoFill extension loaded");

// ==========================
// Helper: Fill Field
// ==========================
function fillField(possibleNames, value) {
  if (!value) return false;

  const lowerNames = possibleNames.map(n => n.toLowerCase());
  const fields = document.querySelectorAll("input, select, textarea");

  for (let field of fields) {
    const nameAttr = (field.name || "").toLowerCase();
    const idAttr = (field.id || "").toLowerCase();
    const placeholder = (field.placeholder || "").toLowerCase();

    if (
      lowerNames.some(
        n =>
          nameAttr.includes(n) ||
          idAttr.includes(n) ||
          placeholder.includes(n)
      )
    ) {
      field.value = value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      console.log(`✅ Filled: ${field.name || field.id || placeholder} -> ${value}`);
      return true;
    }
  }
  return false;
}

// ==========================
// Run AutoFill
// ==========================
function runAutoFill(profile) {
  const mappings = {
    fullName: ["fullname","fullName" ,"name", "firstName", "username"],
    fatherName: ["father", "parent", "guardian"],
    dob: ["dob", "birth", "dateofbirth"],
    gender: ["gender", "sex"],
    nationality: ["nationality", "country"],
    religion: ["religion"],
    maritalStatus: ["marital", "status"],
    bloodGroup: ["bloodgroup", "blood"],
    aadhaarNumber: ["aadhaar", "aadhar", "uid"],
    panNumber: ["pan"],
    passportNumber: ["passport"],
    identificationMark: ["identification", "mark", "idmark"]
  };

  for (let key in mappings) {
    fillField(mappings[key], profile[key]);
  }
}

// ==========================
// Listen for popup.js trigger
// ==========================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill" && request.profile) {
    console.log("📥 Received autofill request:", request.profile);
    runAutoFill(request.profile);
    sendResponse({ success: true });
  }
});























// console.log("✅ AutoFill extension loaded");

// // ==========================
// // Helper: Fill Field
// // ==========================
// function fillField(possibleNames, value) {
//   if (!value) return false;

//   const lowerNames = possibleNames.map(n => n.toLowerCase());
//   const fields = document.querySelectorAll("input, select, textarea");

//   for (let field of fields) {
//     const nameAttr = (field.name || "").toLowerCase();
//     const idAttr = (field.id || "").toLowerCase();
//     const placeholder = (field.placeholder || "").toLowerCase();

//     if (
//       lowerNames.some(
//         n =>
//           nameAttr.includes(n) ||
//           idAttr.includes(n) ||
//           placeholder.includes(n)
//       )
//     ) {
//       field.value = value;
//       field.dispatchEvent(new Event("input", { bubbles: true }));
//       console.log(`✅ Filled: ${field.name || field.id || placeholder} -> ${value}`);
//       return true;
//     }
//   }
//   return false;
// }

// // ==========================
// // Run AutoFill
// // ==========================
// function runAutoFill(profile) {
//   const mappings = {
//     fullName: ["fullname","fullName" ,"name", "firstName", "username"],
//     fatherName: ["father", "parent", "guardian"],
//     dob: ["dob", "birth", "dateofbirth"],
//     gender: ["gender", "sex"],
//     nationality: ["nationality", "country"],
//     religion: ["religion"],
//     maritalStatus: ["marital", "status"],
//     bloodGroup: ["bloodgroup", "blood"],
//     aadhaarNumber: ["aadhaar", "aadhar", "uid"],
//     panNumber: ["pan"],
//     passportNumber: ["passport"],
//     identificationMark: ["identification", "mark", "idmark"]
//   };

//   for (let key in mappings) {
//     fillField(mappings[key], profile[key]);
//   }
// }

// // ==========================
// // Fetch profile & autofill
// // ==========================
// async function fetchProfileAndFill() {
//   try {
//     const res = await fetch("http://localhost:5000/api/profiles/latest");
//     const result = await res.json();

//     if (result.success && result.profile) {
//       console.log("📥 Profile data received:", result.profile);

//       // Debug: show all input fields on the current page
//       console.log(
//         "🔍 All inputs found:",
//         Array.from(document.querySelectorAll("input, select, textarea")).map(
//           f => ({
//             name: f.name,
//             id: f.id,
//             placeholder: f.placeholder
//           })
//         )
//       );

//       runAutoFill(result.profile);
//     } else {
//       console.warn("⚠️ No profile found in DB.");
//     }
//   } catch (err) {
//     console.error("❌ Error fetching profile:", err);
//   }
// }

// // ==========================
// // Run on page load
// // ==========================
// window.addEventListener("load", () => {
//   setTimeout(fetchProfileAndFill, 2000); // wait 2s for fields to render
// });

