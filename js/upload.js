document.getElementById("uploadForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  const res = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (res.ok) {
    alert("Upload successful!");
    console.log(data);
  } else {
    alert("Upload failed");
  }
});
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("audio");

dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.style.borderColor = "#ffffff";
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
});
