const sidebar = document.querySelector("#sidebar")
const sidebarButton = document.querySelector("#sidebar-button")
const closeSidebar = document.querySelector("#close-sidebar")

const handleClickOutside = (e) => {
  console.log("hola")
  if (!sidebar.contains(e.target) && !sidebarButton.contains(e.target)) {
    sidebar.classList.add("hidden")
    document.removeEventListener("click", handleClickOutside) // Removemos el listener cuando se oculta el sidebar
  }
}

sidebarButton.addEventListener("click", (e) => {
  e.stopPropagation()
  const isHidden = sidebar.classList.toggle("hidden")

  if (!isHidden) {
    document.addEventListener("click", handleClickOutside)
  }
})

closeSidebar.addEventListener("click", () => {
  sidebar.classList.add("hidden")
  document.removeEventListener("click", handleClickOutside)
})
