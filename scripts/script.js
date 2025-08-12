// document.addEventListener('DOMContentLoaded', function () {
//   const card = document.querySelector('.business-card')
//   const contactItems = document.querySelectorAll('.contact-item')
//   const socialLinks = document.querySelectorAll('.social-link')

//   // Эффект наклона карточки при движении мыши
//   card.addEventListener('mousemove', function (e) {
//     const rect = card.getBoundingClientRect()
//     const x = e.clientX - rect.left
//     const y = e.clientY - rect.top

//     const centerX = rect.width / 2
//     const centerY = rect.height / 2

//     const rotateX = (y - centerY) / 10
//     const rotateY = (centerX - x) / 10

//     card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
//   })

//   card.addEventListener('mouseleave', function () {
//     card.style.transform =
//       'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
//   })

//   // Анимация появления элементов
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         entry.target.style.opacity = '1'
//         entry.target.style.transform = 'translateY(0)'
//       }
//     })
//   })

//   // Копирование контактов в буфер обмена
//   contactItems.forEach((item) => {
//     if (item.tagName !== 'A') {
//       item.addEventListener('click', function () {
//         const text = this.textContent.trim()
//         navigator.clipboard
//           .writeText(text)
//           .then(() => {
//             // Показываем уведомление
//             const notification = document.createElement('div')
//             notification.textContent = 'Скопировано!'
//             notification.style.cssText = `
//                                 position: fixed;
//                                 top: 20px;
//                                 right: 20px;
//                                 background: rgba(255, 255, 255, 0.9);
//                                 color: #333;
//                                 padding: 10px 20px;
//                                 border-radius: 10px;
//                                 z-index: 1000;
//                                 animation: slideIn 0.3s ease;
//                             `
//             document.body.appendChild(notification)

//             setTimeout(() => {
//               notification.remove()
//             }, 2000)
//           })
//           .catch(() => {
//             console.log('Не удалось скопировать')
//           })
//       })
//     }
//   })

//   // Добавляем CSS для анимации уведомления
//   const style = document.createElement('style')
//   style.textContent = `
//                 @keyframes slideIn {
//                     from {
//                         transform: translateX(100%);
//                         opacity: 0;
//                     }
//                     to {
//                         transform: translateX(0);
//                         opacity: 1;
//                     }
//                 }
//             `
//   document.head.appendChild(style)
// })

document.addEventListener('DOMContentLoaded', function () {
  const card = document.querySelector('.business-card')
  const contactItems = document.querySelectorAll('.contact-item')
  const socialLinks = document.querySelectorAll('.social-link')
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window

  if (!isMobile) {
    // Эффект наклона карточки при движении мыши (десктоп)
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
    })

    card.addEventListener('mouseleave', function () {
      card.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
    })
  } else {
    // Мобильные анимации

    // Гироскоп анимация при наклоне устройства
    // if (window.DeviceOrientationEvent) {
    //   window.addEventListener('deviceorientation', function (e) {
    //     const tiltX = e.beta / 3
    //     const tiltY = e.gamma / 3
    //     card.style.transform = `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`
    //     card.style.transition = 'transform 0.3s ease-out'
    //   })
    // }

    // Touch анимации
    let isPressed = false
    let startX, startY

    card.addEventListener('touchstart', function (e) {
      isPressed = true
      const touch = e.touches[0]
      startX = touch.clientX
      startY = touch.clientY

      card.style.transform = 'scale(0.95) translateY(5px)'
      card.style.transition = 'transform 0.15s ease'

      createRipple(e, card)
    })

    card.addEventListener('touchmove', function (e) {
      if (!isPressed) return

      const touch = e.touches[0]
      const deltaX = (touch.clientX - startX) / 100
      const deltaY = (touch.clientY - startY) / 100

      card.style.transform = `perspective(1000px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg) scale(0.98)`
    })

    card.addEventListener('touchend', function () {
      isPressed = false
      card.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0px)'
      card.style.transition = 'transform 0.3s ease'
    })

    // "Дышащая" анимация
    setInterval(() => {
      if (!isPressed) {
        card.style.animation = 'breathe 4s ease-in-out'
        setTimeout(() => {
          card.style.animation = ''
        }, 4000)
      }
    }, 8000)

    // Анимация элементов при скролле/появлении
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -10px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0) scale(1)'
          }, index * 150)
        }
      })
    }, observerOptions)

    const animatedElements = [
      '.profile-photo',
      '.name',
      '.position',
      ...Array.from(contactItems),
      ...Array.from(socialLinks),
    ]

    animatedElements.forEach((el) => {
      const element = typeof el === 'string' ? document.querySelector(el) : el
      if (element) {
        element.style.opacity = '0'
        element.style.transform = 'translateY(30px) scale(0.8)'
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        observer.observe(element)
      }
    })
  }

  // Функция создания ripple эффекта
  function createRipple(e, element) {
    const ripple = document.createElement('div')
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.touches[0].clientX - rect.left - size / 2
    const y = e.touches[0].clientY - rect.top - size / 2

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      animation: rippleEffect 0.6s ease-out forwards;
      z-index: 1000;
    `

    element.style.position = 'relative'
    element.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  // Копирование контактов в буфер обмена
  contactItems.forEach((item) => {
    if (item.tagName !== 'A') {
      item.addEventListener('click', function () {
        const text = this.textContent.trim()
        navigator.clipboard
          .writeText(text)
          .then(() => {
            // Уведомление с анимацией
            const notification = document.createElement('div')
            notification.textContent = 'Скопировано'
            notification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #1f355c;
              color:rgba(234, 197, 126, 0.95);
              padding: 12px 20px;
              border-radius: 25px;
              z-index: 1000;
              font-weight: 600;
              box-shadow: 0 10px 25px rgba(0,0,0,0.2);
              animation: slideInBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
              backdrop-filter: blur(10px);
            `
            document.body.appendChild(notification)

            setTimeout(() => {
              notification.style.animation =
                'slideOutBounce 0.3s ease-in forwards'
              setTimeout(() => notification.remove(), 300)
            }, 2000)
          })
          .catch(() => {
            console.log('Не удалось скопировать')
          })
      })
    }
  })
})
