function init() {

  const monogram = document.querySelector('.monogram')
  const monogramLetter = document.querySelector('.monogram h1')
  const title = document.querySelector('.title')
  const navbar = document.querySelector('.navigation')
  const navItems = document.querySelectorAll('.navigation span p')
  const container = document.querySelector('.container')
  const main = document.querySelector('main')
  const tech = document.querySelectorAll('.tech i')
  const about = document.querySelector('.about')
  const contactLinks = document.querySelectorAll('.contact-section')
  const projectSelectors = document.querySelectorAll('.project-selector')
  const projects = document.querySelectorAll('.project-show')

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
    const prevBtn = document.querySelector('.prev-project')
    const nextBtn = document.querySelector('.next-project')
    setTimeout(() => {
      prevBtn.style.opacity = currentProject > 0 ? 1 : 0
      nextBtn.style.opacity = currentProject < 3 ? 1 : 0
    }, titleShowing ? 700 : 200)
    resizeCarousel()
    // setTimeout(() => projectSelectors.forEach(button => button.style.opacity = 1), titleShowing ? 700 : 200)
  }

  const loadSection = e => {
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
      
      if (section === 'tech') loadTech()
      if (section === 'contact') loadContact()
      if (section === 'projects') loadProjects()
      
      navbar.style.top = '-110px'
      monogram.style.top = '-30px'
    }, 150)
    
    if (section !== 'projects') {
      projectSelectors.forEach(button => button.style.opacity = 0)
      setTimeout(resetProjects, 400)
    }

    container.style.webkitMaskImage = 'none'
    container.style.maskImage = 'none'
  }

  const switchSections = (exception) => {
    Array.from(main.children).forEach(section => {
      if (section.tagName === 'BUTTON') return
      const isException = section.id === exception
      // Constant behaviour
      setTimeout(() => {
        section.style.height = isException ? 'auto' : 0
        section.style.pointerEvents = isException ? 'all' : 'none'
        container.scrollTop = 0
        // This prevents non-visible sections from affecting the scroll container height
        section.style.position = isException ? 'relative' : 'absolute'
      }, 250)
      // Variable delay
      setTimeout(() => section.style.opacity = isException ? 1 : 0, isException ? 250 : 0)
    })
  }

  const adjustMask = (scrollTop) => {
    const aboutVisible = getComputedStyle(about).opacity
    if (aboutVisible === '0') return
    const marginWidth = (parseInt(getComputedStyle(container).width) - parseInt(getComputedStyle(main).width)) / 2
    const value = scrollTop > 150
      ? 'linear-gradient(transparent, black 10px)'
      : `linear-gradient(transparent, black 10px), linear-gradient(-90deg, black ${marginWidth + 160}px, transparent ${marginWidth + 160}px)`

    container.style.webkitMaskImage = value
    container.style.maskImage = value
  }

  const trackMouseWithGlow = event => {
    if (event.sourceCapabilities.firesTouchEvents) return
    const translationX = (event.clientX / window.visualViewport.width) - 0.5
    const translationY = event.clientY / window.visualViewport.height
    monogram.style.boxShadow = `${translationX * 100}px ${translationY * 40}px 500px 50px #888`
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

    currentProject = Math.min(Math.max(currentProject + direction, 0), 3)
    
    projects.forEach((project, i) => adjustCarousel(project, i))

    // Hide buttons on either end of carousel
    const prevBtn = document.querySelector('.prev-project')
    const nextBtn = document.querySelector('.next-project')
    prevBtn.style.opacity = delay && currentProject > 0 ? 1 : 0
    nextBtn.style.opacity = delay && currentProject < 3 ? 1 : 0
  }

  const resizeCarousel = () => {
    document.querySelectorAll('.project-show').forEach((project, i) => {
      project.style.transition = 'none'
      adjustCarousel(project, i)
      setTimeout(() => {
        project.style.transition = 'all 1s'
      }, 100)
    })
    const links = document.querySelector('.project-links')
    projectSelectors.forEach(button => button.style.top = links.offsetTop + 'px')
  }

  const adjustCarousel = (project, i) => {
    const initialProject = document.querySelector('.project-show')
    const width = parseInt(getComputedStyle(initialProject).width) + 20
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
  }

  let swipeX
  let swipeY

  const beginSwipe = event => {
    swipeX = event.touches[0].clientX
    swipeY = event.touches[0].clientY
  }

  const endSwipe = event => {
    const diffX = event.changedTouches[0].clientX - swipeX
    const diffY = event.changedTouches[0].clientY - swipeY
    if (diffX > 30 && Math.abs(diffY) < 30) changeProject(-1)
    if (diffX < -30 && Math.abs(diffY) < 30) changeProject(1)
  }

  window.addEventListener('mousemove', trackMouseWithGlow)
  monogram.addEventListener('click', loadTitle)
  navItems.forEach(item => item.addEventListener('click', loadSection))
  contactLinks.forEach(link => link.addEventListener('mouseenter', toggleLinkIndicator))
  contactLinks.forEach(link => link.addEventListener('mouseleave', toggleLinkIndicator))

  document.querySelector('.next-project').addEventListener('click', () => changeProject(1))
  document.querySelector('.prev-project').addEventListener('click', () => changeProject(-1))

  // Position the items in carousel
  resizeCarousel()
  window.addEventListener('resize', () => {
    resizeCarousel()
    adjustMask(container.scrollTop)
  })

  window.addEventListener('keydown', (e) => {
    const projectSection = document.querySelector('.projects')
    if (getComputedStyle(projectSection).opacity === '0') return
    if (e.key === 'ArrowLeft') changeProject(-1)
    if (e.key === 'ArrowRight') changeProject(1)
  })

  container.addEventListener('scroll', (e) => adjustMask(e.target.scrollTop))

  document.querySelector('.projects').addEventListener('touchstart', beginSwipe)
  document.querySelector('.projects').addEventListener('touchend', endSwipe)



  
}

window.addEventListener('DOMContentLoaded', init)