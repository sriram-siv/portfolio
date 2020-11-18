function init() {

  const monogram = document.querySelector('.monogram')
  const monogramLetter = document.querySelector('.monogram h1')
  const title = document.querySelector('.title')
  const navbar = document.querySelector('.navigation')
  const navItems = document.querySelectorAll('.navigation span p')
  const container = document.querySelector('.container')
  const main = document.querySelector('main')
  const tech = document.querySelectorAll('.tech i')
  const contactLinks = document.querySelectorAll('.contact-section')
  const projectSelectors = document.querySelectorAll('.project-selector')
  // Carousel settings, delay prevents multiple function calls
  let currentProject = 0
  let projectSelectorDelay = false
  // Tech logos fade settings
  const fadeOrder = [
    [0], [1], [2, 5], [3, 6, 9], [4, 7, 10], [8, 11], [12], [13]
  ]
  // Move carousel back to first project
  const resetProjects = () => {
    changeProject(-1, false)
    if (currentProject > 0) resetProjects()
  }

  const loadTitle = () => {
    // Animate spin and navbar scroll
    monogram.style.animation = 'spin ease 0.25s'
    monogramLetter.style.animation = 'spin-reverse ease 0.25s'
    navbar.style.top = '30px'
    container.style.pointerEvents = 'none'
    
    // Hide sections and reset animations 0.1s
    setTimeout(() => {
      switchSections()

      // Remove animation and move monogram 0.4s
      setTimeout(() => {
        monogram.style.top = 0
        monogram.style.animation = 'none'
        monogramLetter.style.animation = 'none'

        // Reveal title 0.6s
        setTimeout(() => {
          title.style.opacity = 1
        }, 200)
      }, 300)
    }, 100)

    tech.forEach(child => child.style.opacity = 0)
    contactLinks.forEach(child => child.style.opacity = 0)
    projectSelectors.forEach(button => button.style.opacity = 0)
  }

  const loadTech = (order = fadeOrder) => {
    if (order.length < 1) return
    order[0].forEach(position => tech[position].style.opacity = 1)
    setTimeout(() => loadTech(order.slice(1)), 120)
  }

  const loadContact = () => {
    contactLinks.forEach((link, i) => {
      setTimeout(() => link.style.opacity = 1, 300 + (i * 150))
    })
  }

  const loadProjects = () => {
    const titleShowing = getComputedStyle(title).opacity !== '0'
    setTimeout(() => projectSelectors.forEach(button => button.style.opacity = 1), titleShowing ? 700 : 200)
  }

  const loadSection = async (e) => {
    // Animatate navlink bounce
    e.target.style.animation = 'bounce 0.2s'
    setTimeout(() => e.target.style.animation = 'none', 200)
    
    const section = e.target.getAttribute('data-section')
    // Switch section visibility
    const titleShowing = title.style.opacity !== '0'
    setTimeout(() => switchSections(section), titleShowing ? 500 : 100)

    // Hide title and activate scroll
    title.style.opacity = 0
    container.style.pointerEvents = 'all'

    setTimeout(() => {
      projectSelectors.forEach(button => button.style.opacity = 0)

      if (section === 'tech') loadTech()
      // if (section === 'about') loadAbout()
      if (section === 'contact') loadContact()
      if (section === 'projects') loadProjects()

      
      navbar.style.top = '-110px'
      monogram.style.top = '-30px'
    }, 150)

    if (section !== 'projects') setTimeout(resetProjects, 300)

  }

  const switchSections = (exception) => {
    Array.from(main.children).forEach(section => {
      if (section.tagName === 'BUTTON') return
      const isException = section.id === exception
      // Constant behaviour
      setTimeout(() => {
        section.style.height = isException ? 'auto' : 0
        section.style.pointerEvents = isException  ? 'all' : 'none'
        container.scrollTop = 0
      }, 250)
      // Variable delay
      setTimeout(() => section.style.opacity = isException ? 1 : 0, isException ? 250 : 0)
    })
  }

  const trackMouseWithGlow = event => {
    const translationX = (event.clientX / window.visualViewport.width) - 0.5
    const translationY = event.clientY / window.visualViewport.height
    monogram.style.boxShadow = `${translationX * 100}px ${translationY * 40}px 500px 50px white`
  }

  const toggleLinkIndicator = event => {
    const indicator = event.target.querySelector('.link-indicator')
    indicator.style.opacity = getComputedStyle(indicator).opacity === '0' ? '1' : '0'
  }

  const changeProject = (direction, delay = true) => {
    const validPress = currentProject + direction > -1 && currentProject + direction < 4
    if (projectSelectorDelay || !validPress) return
    if (delay) {
      projectSelectorDelay = true
      setTimeout(() => projectSelectorDelay = false, 500)
    }

    const projects = document.querySelectorAll('.project-show')
    const width = parseInt(getComputedStyle(projects[0]).width) + 20
    
    currentProject = Math.min(Math.max(currentProject + direction, 0), 3)

    projects.forEach((project, i) => {
      const image = project.querySelector('img')

      if (currentProject === i) {
        project.style.transform = 'translateX(0)'
        image.style.transform = 'translateX(0)'
      }

      if (currentProject < i) {
        project.style.transform = `translateX(${width}px)`
        image.style.transform = `translateX(${-width / 2}px)`
      }

      if (currentProject > i) {
        project.style.transform = `translateX(${-width}px)`
        image.style.transform = `translateX(${width / 2}px)`
      }
    })
  }
  
  window.addEventListener('mousemove', trackMouseWithGlow)
  monogram.addEventListener('click', loadTitle)
  navItems.forEach(item => item.addEventListener('click', loadSection))
  contactLinks.forEach(link => link.addEventListener('mouseenter', toggleLinkIndicator))
  contactLinks.forEach(link => link.addEventListener('mouseleave', toggleLinkIndicator))

  document.querySelector('.next-project').addEventListener('click', () => changeProject(1))
  document.querySelector('.prev-project').addEventListener('click', () => changeProject(-1))


  document.querySelectorAll('.extra-project').forEach(project => {
    project.style.transform = `translateX(${parseInt(getComputedStyle(project).width)}px)`
  })

  window.addEventListener('keydown', (e) => {
    const projects = document.querySelector('.projects')
    if (getComputedStyle(projects).opacity === '0') return
    if (e.key === 'ArrowLeft') changeProject(-1)
    if (e.key === 'ArrowRight') changeProject(1)
  })
  
}

window.addEventListener('DOMContentLoaded', init)