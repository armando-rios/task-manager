export const showModal = (title, children) => {
  const modal = document.createElement("div")
  modal.className = "fixed inset-0 bg-theme-surface-1/50 flex justify-center items-center z-50"

  const content = document.createElement("div")
  content.className = "bg-theme-surface-0 p-6 rounded shadow-md flex flex-col gap-4"

  content.innerHTML = `
    <h2 class="text-xl text-theme-primary font-bold">${title}</h2>
    <form class="flex flex-col gap-4" id="${title.toLowerCase().replace(" ", "-")}-form">
      ${children}
    </form>
  `

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })

  modal.appendChild(content)
  document.body.appendChild(modal)
}
