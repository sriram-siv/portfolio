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

  const contactLinks = document.querySelectorAll('.contact-section')

  let techLoaded = false

  const loadTitle = () => {

    monogram.style.animation = 'spin linear 0.3s'
    monogramLetter.style.animation = 'spin-reverse linear 0.3s'

    navbar.style.top = '30px'
    container.style.pointerEvents = 'none'

    techLoaded = false
    Array.from(tech.children).forEach(child => child.style.opacity = 0)
    contactLinks.forEach(child => child.style.opacity = 0)

    setTimeout(() => {
      monogram.style.animation = 'none'
      monogramLetter.style.animation = 'none'
    }, 300)

    setTimeout(() => {
      title.style.opacity = 1
      switchSections()
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

  const loadContact = () => {
    contactLinks.forEach((link, i) => {
      setTimeout(() => link.style.opacity = 1, 300 + (i * 150))
    })
  }

  const loadSection = (e) => {
    // Animatate navlink bounce
    e.target.style.transform = 'translateY(2px)'
    setTimeout(() => {
      e.target.style.transform = 'translateY(0)'

      const section = e.target.getAttribute('data-section')
      if (section === 'tech') loadTech()
      // if (section === 'about') loadAbout()
      if (section === 'contact') loadContact()
      // Switch section visibility
      const titleShowing = title.style.opacity !== '0'
      setTimeout(() => switchSections(section), titleShowing ? 200 : 0)
      // Hide title
      navbar.style.top = '-70px'
      title.style.opacity = 0
      container.style.pointerEvents = 'all'
    }, 100)

  }

  const switchSections = (exception) => {
    Array.from(main.children).forEach(section => {
      const isException = section.id === exception
      // Constant behaviour
      setTimeout(() => {
        section.style.height = 'auto'
        container.scrollTop = 0
      }, 250)

      if (isException) {
        setTimeout(() => {
          section.style.opacity = 1
          section.style.pointerEvents = 'all'
        }, 250)
      } else {
        section.style.opacity = 0
        section.style.pointerEvents = 'none'
      }
    })
  }

  const getMousePosition = event => {
    const translation = (event.clientX / window.visualViewport.width) - 0.5
    monogram.style.boxShadow = `${translation * 50}px 0 500px 50px white`
  }

  const toggleLinkIndicator = event => {
    const indicator = event.target.querySelector('.link-indicator')
    indicator.style.opacity = getComputedStyle(indicator).opacity === '0' ? '1' : '0'
  }

  
  window.addEventListener('mousemove', getMousePosition)
  monogram.addEventListener('click', loadTitle)
  navItems.forEach(item => item.addEventListener('click', loadSection))
  contactLinks.forEach(link => link.addEventListener('mouseenter', toggleLinkIndicator))
  contactLinks.forEach(link => link.addEventListener('mouseleave', toggleLinkIndicator))


}

window.addEventListener('DOMContentLoaded', init)