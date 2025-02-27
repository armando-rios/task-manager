export function initSidebarController () {
  const sidebar = document.querySelector("#sidebar")
  const sidebarButton = document.querySelector("#sidebar-button")
  const closeSidebar = document.querySelector("#close-sidebar")

  const handleClickOutside = (e) => {
    if (!sidebar.contains(e.target) && !sidebarButton.contains(e.target)) {
      hideSidebar()
    }
  }

  function showSidebar () {
    sidebar.classList.remove("hidden")
    sidebar.classList.remove("-translate-x-full")
    document.addEventListener("click", handleClickOutside)
  }

  function hideSidebar () {
    sidebar.classList.add("hidden")
    sidebar.classList.add("-translate-x-full")
    document.removeEventListener("click", handleClickOutside)
  }

  sidebarButton.addEventListener("click", (e) => {
    e.stopPropagation()
    const isHidden = sidebar.classList.contains("hidden")
    if (isHidden) {
      showSidebar()
    } else {
      hideSidebar()
    }
  })

  closeSidebar.addEventListener("click", hideSidebar)
}
