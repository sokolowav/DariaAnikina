document.addEventListener('DOMContentLoaded', function () {
  const card = document.querySelector('.business-card')
  const contactItems = document.querySelectorAll('.contact-item')
  const socialLinks = document.querySelectorAll('.social-link')

  // Эффект наклона карточки при движении мыши
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

  // Анимация появления элементов
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  })

  // Копирование контактов в буфер обмена
  contactItems.forEach((item) => {
    if (item.tagName !== 'A') {
      item.addEventListener('click', function () {
        const text = this.textContent.trim()
        navigator.clipboard
          .writeText(text)
          .then(() => {
            // Показываем уведомление
            const notification = document.createElement('div')
            notification.textContent = 'Скопировано!'
            notification.style.cssText = `
                                position: fixed;
                                top: 20px;
                                right: 20px;
                                background: rgba(255, 255, 255, 0.9);
                                color: #333;
                                padding: 10px 20px;
                                border-radius: 10px;
                                z-index: 1000;
                                animation: slideIn 0.3s ease;
                            `
            document.body.appendChild(notification)

            setTimeout(() => {
              notification.remove()
            }, 2000)
          })
          .catch(() => {
            console.log('Не удалось скопировать')
          })
      })
    }
  })

  // Добавляем CSS для анимации уведомления
  const style = document.createElement('style')
  style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `
  document.head.appendChild(style)
})
