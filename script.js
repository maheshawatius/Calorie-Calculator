const form = document.querySelector("#calorie-form");
const results = document.querySelector("#results");

const fields = {
  age: { input: document.querySelector("#age"), min: 18, max: 100, message: "Enter an age from 18 to 100." },
  height: { input: document.querySelector("#height"), min: 120, max: 230, message: "Enter a height from 120 to 230 cm." },
  weight: { input: document.querySelector("#weight"), min: 30, max: 300, message: "Enter a weight from 30 to 300 kg." }
};

function setError(name, message) {
  const input = document.querySelector(`#${name}`);
  const error = document.querySelector(`#${name}-error`);
  error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let valid = true;

  for (const [name, field] of Object.entries(fields)) {
    const value = Number(field.input.value);
    const error = !field.input.value || !Number.isFinite(value) || value < field.min || value > field.max ? field.message : "";
    setError(name, error);
    if (error) valid = false;
  }

  const gender = document.querySelector("#gender").value;
  const activity = Number(document.querySelector("#activity").value);
  setError("gender", gender ? "" : "Choose an option.");
  setError("activity", activity ? "" : "Choose your activity level.");
  if (!gender || !activity) valid = false;
  if (!valid) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const age = Number(fields.age.input.value);
  const height = Number(fields.height.input.value);
  const weight = Number(fields.weight.input.value);
  // Mifflin–St Jeor estimates resting energy expenditure; activity scales it to maintenance.
  const resting = 10 * weight + 6.25 * height - 5 * age + (gender === "male" ? 5 : -161);
  const maintenance = Math.round(resting * activity);

  document.querySelector("#maintenance-value").textContent = maintenance.toLocaleString();
  const deficit = Math.min(500, maintenance * 0.25);
  document.querySelector("#loss-value").textContent = Math.round(maintenance - deficit).toLocaleString();
  document.querySelector("#gain-value").textContent = (maintenance + 300).toLocaleString();
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

for (const [name, field] of Object.entries(fields)) {
  field.input.addEventListener("input", () => {
    const value = Number(field.input.value);
    setError(name, field.input.value && (value < field.min || value > field.max) ? field.message : "");
  });
}

document.querySelector("#gender").addEventListener("change", () => setError("gender", ""));
document.querySelector("#activity").addEventListener("change", () => setError("activity", ""));
document.querySelector("#edit-details").addEventListener("click", () => {
  document.querySelector("#age").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
