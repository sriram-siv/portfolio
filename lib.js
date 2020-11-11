const monogram = document.querySelector('.monogram')
const monogramLetter = document.querySelector('.monogram h1')
const title = document.querySelector('.title')
const navbar = document.querySelector('.navigation')
const navItems = document.querySelectorAll('.navigation span p')

const container = document.querySelector('.container')
const main = document.querySelector('main')

const tech = document.querySelectorAll('.tech i')
const contactLinks = document.querySelectorAll('.contact-section')

export const loadTitle = () => {
  // Animate spin and navbar scroll
  monogram.style.animation = 'spin linear 0.3s'
  monogramLetter.style.animation = 'spin-reverse linear 0.3s'
  navbar.style.top = '30px'
  container.style.pointerEvents = 'none'
  // Remove animation and reveal title
  setTimeout(() => {
    monogram.style.animation = 'none'
    monogramLetter.style.animation = 'none'
    title.style.opacity = 1
  }, 400)
  // Hide sections and reset animations
  setTimeout(() => switchSections(), 150)
  tech.forEach(child => child.style.opacity = 0)
  contactLinks.forEach(child => child.style.opacity = 0)
}

export const switchSections = (exception) => {
  Array.from(main.children).forEach(section => {
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

export const trackMouseWithGlow = event => {
  const translationX = (event.clientX / window.visualViewport.width) - 0.5
  const translationY = event.clientY / window.visualViewport.height
  monogram.style.boxShadow = `${translationX * 70}px ${translationY * 40}px 500px 50px white`
}

export const toggleLinkIndicator = event => {
  const indicator = event.target.querySelector('.link-indicator')
  indicator.style.opacity = getComputedStyle(indicator).opacity === '0' ? '1' : '0'
}