// Get form elements
const yourNameInput = document.getElementById("yourName");
const crushNameInput = document.getElementById("crushName");
const matchBtn = document.getElementById("matchBtn");

// When user clicks the button
matchBtn.addEventListener("click", async () => {
  const yourName = yourNameInput.value.trim(); // optional
  const crushName = crushNameInput.value.trim(); // required

  if (!crushName) {
    alert("Please enter your crush's Full name!");
    return;
  }

  // Generate random match percentage (0 to 100)
  const match = Math.floor(Math.random() * 101);

  try {
    // Send data to backend
    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yourName, crushName, match })
    });

    const data = await response.json();

    if (data.success) {
      // Save the match in localStorage for result page (optional)
      localStorage.setItem("matchResult", JSON.stringify({ yourName, crushName, match }));

      // Redirect to result page
      window.location.href = "/result.html";
    } else {
      alert("Error saving data: " + data.error);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Try again!");
  }
});
