function init() {

  const monogram = document.querySelector('.monogram')
  const monogramLetter = document.querySelector('.monogram h1')
  const title = document.querySelector('.title')
  const navbar = document.querySelector('.navigation')
  const navItems = document.querySelectorAll('.navigation span p')

  const container = document.querySelector('.container')
  const main = document.querySelector('main')

  const about = document.querySelector('.about')
  const tech = document.querySelector('.tech')

  let techLoaded = false

  const loadTitle = () => {

    monogram.style.animation = 'spin linear 0.3s'
    monogramLetter.style.animation = 'spin-reverse linear 0.3s'

    navbar.style.top = '30px'
    container.style.pointerEvents = 'none'

    techLoaded = false
    Array.from(tech.children).forEach(child => child.style.opacity = 0)

    setTimeout(() => {
      monogram.style.animation = 'none'
      monogramLetter.style.animation = 'none'
    }, 300)

    setTimeout(() => {
      title.style.opacity = 1
      hideSections()
    }, 200)
  }

  const loadAbout = () => {
    setTimeout(() => {
      
    }, 200)
  }

  const loadTech = (children = Array.from(tech.children)) => {
    // Only animate single elements on first load
    if (children.length <= 0) techLoaded = true
    if (techLoaded) return
    // Select two random items from the tech stack array
    const one = Math.floor(Math.random() * children.length)
    let two = Math.floor(Math.random() * children.length)
    while (one === two) two = Math.floor(Math.random() * children.length)
    // Fade in and remove from array for further calls to this function
    children[one].style.opacity = 1
    children[two].style.opacity = 1
    children = children.filter((item, i) => i !== one && i !== two)
    setTimeout(() => loadTech(children, false), 100)
  }

  const loadSection = (e) => {
    // Animatate navlink bounce
    e.target.style.transform = 'translateY(2px)'
    setTimeout(() => {
      e.target.style.transform = 'translateY(0)'

      const section = e.target.getAttribute('data-section')
      if (section === 'tech') loadTech()
      // if (section === 'about') loadAbout()
      // Switch section visibility
      const titleShowing = title.style.opacity !== '0'
      setTimeout(() => hideSections(section), titleShowing ? 200 : 0)
      // Hide title
      navbar.style.top = '-70px'
      title.style.opacity = 0
      container.style.pointerEvents = 'all'
    }, 100)

  }

  const hideSections = (exception) => {
    Array.from(main.children).forEach(section => {
      const isException = section.id === exception
      // Height changes either before or after transition depending on direction
      // because auto -> 0 animation isn't possible
      setTimeout(() => section.style.height = isException ? 'auto' : 0, isException ? 0 : 300)
      section.style.opacity = isException ? 1 : 0
      section.style.pointerEvents = isException ? 'all' : 'none'
    })
  }

  const getMousePosition = (e) => {
    const translation = (e.clientX / window.visualViewport.width) - 0.5
    monogram.style.boxShadow = `${translation * 50}px 0 500px 50px white`
  }

  
  window.addEventListener('mousemove', getMousePosition)
  monogram.addEventListener('click', loadTitle)
  navItems.forEach(item => item.addEventListener('click', loadSection))

}

window.addEventListener('DOMContentLoaded', init)