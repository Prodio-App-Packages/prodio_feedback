import { frequencyTypes, localStorageName, SessionStorageName } from "..";
import { getFromLocalStorage, getFromSessionStorage, saveToLocalStorage, saveToSessionStorage } from "../core/repositories/Storage";
import { handleSubmit } from "../core/usecases/handleSubmit";
/**
 * Displays a feedback popup with form fields.
 */
export function showPopup(matchedOrg: any): void {
  if (document.getElementById("custom-popup-overlay")) return; // Avoid duplicate popups

  const { id, metadata } = matchedOrg;
  const { frequency, openAfter = 0, form, whiteLabel=false } = metadata;

  const {title = "Submit your feedback", description ="Fill out the form below to submit you feedback",theme = "system", primaryColor = "#39C3EF"} = form

  // Set theme-based styles
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const backgroundColor = isDarkMode ? "#000" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#000";
  const borderColor = isDarkMode ? "#6a676778" : "#868484";
  const labelColor = isDarkMode ? "#bbb" : "#000";


  // Create the overlay
  const overlay = document.createElement("div");
  overlay.id = "custom-popup-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999998";

  // Create the popup container
  const popup = document.createElement("div");
  popup.id = "custom-popup";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";
  popup.style.gap = "12px";
  popup.style.position = "fixed";
  popup.style.zIndex = "9999999";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = backgroundColor;
  popup.style.color = textColor;
  popup.style.padding = "20px";
  popup.style.borderRadius = "10px";
  popup.style.width = "90%";
  popup.style.maxWidth = "400px";
  // popup.style.border = `1px solid ${textColor}`;
  popup.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)'
  const renderWhiteLabel = () => {
    if(!whiteLabel) {
      return `<a style="font-size:9px;color:#39C3EF;text-align:right;text-decoration:none;" href="https://prodio.app" target="_blank">Powered by Prodio</a>`
    } else {
      return `<span style="display:none;"></span>`
    }
  }

  
  // Function to add styles dynamically without using an ID
const addStyles = () => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
    .prodio-feedback-form-heading {
      font-size: 27px;
      margin: 0;
    }

    @media screen and (max-width: 700px) {
      .prodio-feedback-form-heading {
        font-size: 20px;
      }
    }

    .prodio-feedback-form-description {
      font-size: 14px;
    }

    @media screen and (max-width: 700px) {
      .prodio-feedback-form-description {
        font-size: 12px;
      }
    }
  `;
  document.head.appendChild(styleElement);
  };
  

  // Function to remove styles without using an ID
const removeStyles = () => {
  const styles = document.head.getElementsByTagName("style");
  for (let i = 0; i < styles.length; i++) {
    if (styles[i].innerHTML.includes(".prodio-feedback")) {
      styles[i].remove();
      break;
    }
  }
};


  popup.innerHTML = `
    <h2 class="prodio-feedback-form-heading">${title}</h2>
    <span class="prodio-feedback-form-description">${description}</span>

    <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
      <label for="popup-type" style="display: block; text-align: left; color: ${labelColor};font-size:12px;">Type *</label>
      <select id="popup-type" style="padding: 6px 8px;font-size:14px; border-radius: 5px; border:  1px solid ${borderColor}; background: ${backgroundColor}; color: ${textColor};">
        <option value="feature">Feature</option>
        <option value="bug">Bug</option>
        <option value="improvement">Improvement</option>
        <option value="task">Task</option>
        <option value="question">Question</option>
      </select>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
      <label for="popup-title" style="display: block; text-align: left; color:${labelColor};font-size:12px;">Title *</label>
      <input 
        type="text" 
        id="popup-title" 
        placeholder="Enter title"
        autocomplete="off" 
        style="padding: 6px 8px;font-size:14px; border-radius: 5px; border:  1px solid ${borderColor}; background: ${backgroundColor}; color: ${textColor};"
      />
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
      <label for="popup-description" style="display: block; text-align: left; color:${labelColor};font-size:12px;">Description *</label>
      <textarea 
        id="popup-description" 
        placeholder="Enter description" 
        autocomplete="off" 
        rows="5"
        style="padding: 6px 8px;font-size:14px; border-radius: 5px; border:  1px solid ${borderColor}; background: ${backgroundColor}; color: ${textColor}; resize: none;"
      ></textarea>
    </div>

    <span id="popup-error" style="color: red; display: none; font-size:12px;">All fields are required</span>
    <div style="display: flex;justify-content: end;gap: 12px;">
      <button id="popup-close" style="padding: 5px 20px; background-color: ${backgroundColor}; border: 1px solid ${textColor}; border-radius: 5px; color: ${textColor}; font-size: 14px; cursor: pointer;">
        Cancel
      </button>
      <button id="popup-submit" style="padding: 5px 20px; background-color: ${primaryColor}; border: none; border-radius: 5px; color: #fff; font-size: 14px; cursor: pointer;">
        Submit
      </button>
    </div>
    ${renderWhiteLabel()}
  `;

  // Show popup after delay
  setTimeout(() => {
    addStyles();  // Add styles before showing popup
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    document.body.style.overflow = "hidden";

    const errorSpan = document.getElementById("popup-error") as HTMLSpanElement;

    const inputs = [
      document.getElementById("popup-type") as HTMLSelectElement,
      document.getElementById("popup-title") as HTMLInputElement,
      document.getElementById("popup-description") as HTMLTextAreaElement
    ];

    inputs.forEach(input => {
      input.addEventListener("input", () => {
        input.style.border = `1px solid ${borderColor}`;
        errorSpan.style.display = "none";
      });
    });
    const orgData = getFromSessionStorage(SessionStorageName);


    // Submit button click handler
    document.getElementById("popup-submit")!.addEventListener("click", () => {
      const type = (document.getElementById("popup-type") as HTMLSelectElement).value;
      const title = (document.getElementById("popup-title") as HTMLInputElement).value;
      const description = (document.getElementById("popup-description") as HTMLTextAreaElement).value;

      let hasError = false;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.border = "1px solid red";
          hasError = true;
        }
      });

      if (hasError) {
        errorSpan.style.display = "block";
        return;
      }



      
      const dataToSend = {
        type,
        title,
        description,
        user_id: orgData?.userData?.id,
        feedback_id:id
      }


      handleSubmit(dataToSend).then((res:any) => {
        if (res.error) {
          // sho red error
          errorSpan.textContent = res.error;
          errorSpan.style.display = "block";
        } else {
          popup.innerHTML = `
            <h2 class="prodio-feedback-form-heading" style="text-align:center;">Thank you for you feedback</h2>
            <div style="display:flex;justify-content:center;margin-top:20px;">
              <button id="done-button" style="padding: 5px 20px; background-color: ${primaryColor}; border: none; border-radius: 5px; color: #fff; font-size: 14px; cursor: pointer;">
                Done
              </button>
            </div>
          `
          document.getElementById("done-button")!.addEventListener("click", () => {
            overlay.remove();
            popup.remove();
            document.body.style.overflow = "";
            removeStyles();
          });

          const submittedForms = orgData?.submittedForms ?? []
          submittedForms.push(id)
            saveToSessionStorage(SessionStorageName,{...orgData,submittedForms});
          // saveToLocalStorage(localStorageName,{submittedForms:submittedForms})
          // res.message
          // show form submitted successfully popup
        }
      });
    });

    // Close button click handler
    document.getElementById("popup-close")!.addEventListener("click", () => {
      overlay.remove();
      popup.remove();
      if (frequency === frequencyTypes.everySession) {
        const submittedForms = orgData?.submittedForms ?? []
        submittedForms.push(id)
        saveToSessionStorage(SessionStorageName,{...orgData,submittedForms});
      }
      document.body.style.overflow = ""; // Re-enable scrolling
      removeStyles(); // Remove styles after closing popup
    });
  }, openAfter * 1000); // Convert seconds to milliseconds
}
