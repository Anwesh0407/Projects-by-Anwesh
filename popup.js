document.getElementById("fill").addEventListener("click", async () => {
  const statusEl = document.getElementById("status");
  statusEl.textContent = "⏳ Fetching profile...";

  try {
    // Fetch latest profile from backend
    const res = await fetch("http://localhost:5000/api/profiles/latest");
    const data = await res.json();

    if (data.success && data.profile) {
      const profile = data.profile;

      // Send profile to content.js
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: fillForm,
          args: [profile]
        }, () => {
          if (chrome.runtime.lastError) {
            console.error("Injection failed:", chrome.runtime.lastError);
            statusEl.textContent = "❌ Failed to inject autofill script.";
          } else {
            statusEl.textContent = "✅ Profile autofilled!";
          }
        });
      });
    } else {
      console.warn("⚠️ No profile found in DB.");
      statusEl.textContent = "⚠️ No profile found.";
    }
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    statusEl.textContent = "❌ Error fetching profile.";
  }
});

// Function that runs inside the webpage
function fillForm(profile) {
  if (!profile) return;

  const mappings = {
    fullName: ["fullname", "full_name", "name", "applicantname"],
    fatherName: ["fathername", "father_name", "father"],
    dob: ["dob", "dateofbirth", "birthdate"],
    gender: ["gender", "sex"],
    nationality: ["nationality", "country"],
    religion: ["religion"],
    maritalStatus: ["maritalstatus", "marital", "status"],
    bloodGroup: ["bloodgroup", "blood"],
    aadhaarNumber: ["aadhaar", "aadhar", "uid"],
    panNumber: ["pan"],
    passportNumber: ["passport"],
    identificationMark: ["identificationmark", "idmark", "mark"]
  };

  // loop over mappings
  for (const [field, aliases] of Object.entries(mappings)) {
    const value = profile[field];
    if (!value) continue;

    // normalize
    const lowerAliases = aliases.map(a => a.toLowerCase());

    // all form elements
    const elements = document.querySelectorAll("input, select, textarea");

    for (let el of elements) {
      const nameAttr = (el.name || "").toLowerCase();
      const idAttr = (el.id || "").toLowerCase();
      const placeholder = (el.placeholder || "").toLowerCase();

      if (
        lowerAliases.some(alias =>
          nameAttr.includes(alias) ||
          idAttr.includes(alias) ||
          placeholder.includes(alias)
        )
      ) {
        if (el.tagName === "SELECT") {
          // try matching option by value or text
          let matched = false;
          for (let opt of el.options) {
            if (
              opt.value.toLowerCase() === value.toLowerCase() ||
              opt.text.toLowerCase() === value.toLowerCase()
            ) {
              el.value = opt.value;
              matched = true;
              break;
            }
          }
          if (matched) {
            el.dispatchEvent(new Event("change", { bubbles: true }));
            console.log(`✅ Filled dropdown: ${nameAttr || idAttr} -> ${value}`);
          }
        } else {
          // text input, textarea
          el.value = value;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          console.log(`✅ Filled: ${nameAttr || idAttr || placeholder} -> ${value}`);
        }
        break; // stop after first match
      }
    }
  }
}



