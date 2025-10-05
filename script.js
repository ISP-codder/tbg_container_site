// Page Transition System
class PageTransition {
	constructor() {
		this.init()
	}

	init() {
		this.createTransitionElement()
		this.bindNavigationLinks()
	}

	createTransitionElement() {
		this.transitionEl = document.createElement('div')
		this.transitionEl.className = 'page-transition'
		document.body.appendChild(this.transitionEl)
	}

	bindNavigationLinks() {
		document.addEventListener('click', e => {
			const link = e.target.closest('a')
			if (!link) return

			const href = link.getAttribute('href')

			// Check if it's an internal link and not a hash link
			if (href && href.endsWith('.html') && !href.startsWith('#')) {
				e.preventDefault()
				this.navigateTo(href)
			}
		})
	}

	navigateTo(url) {
		// Start transition
		this.transitionEl.classList.add('active')

		// Navigate after transition
		setTimeout(() => {
			window.location.href = url
		}, 600)
	}
}

// Scroll Animation System
class ScrollAnimator {
	constructor() {
		this.elements = []
		this.threshold = 0.1
		this.init()
	}

	init() {
		this.cacheElements()
		this.createObserver()
		this.bindScrollEvents()
	}

	cacheElements() {
		this.elements = document.querySelectorAll(
			[
				'.feature-card',
				'.product-card',
				'.about-image',
				'.contact-info',
				'.contact-details',
				'.map-container',
				'.faq-item',
				'.features h2',
				'.products-preview h2',
				'.cta h2'
			].join(',')
		)
	}

	createObserver() {
		this.observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						this.animateIn(entry.target)
					}
				})
			},
			{
				threshold: this.threshold,
				rootMargin: '50px'
			}
		)

		this.elements.forEach(el => this.observer.observe(el))
	}

	animateIn(element) {
		element.classList.add('visible')
	}

	bindScrollEvents() {
		let lastScrollY = window.scrollY
		let ticking = false

		const updateHeader = () => {
			const header = document.querySelector('header')
			const scrolled = window.scrollY > 100

			if (scrolled) {
				header.classList.add('scrolled')
				if (window.scrollY > lastScrollY && window.scrollY > 200) {
					header.classList.add('hidden')
				} else {
					header.classList.remove('hidden')
				}
			} else {
				header.classList.remove('scrolled', 'hidden')
			}

			lastScrollY = window.scrollY
			ticking = false
		}

		const onScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateHeader)
				ticking = true
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true })
	}
}

// Product Filter System
class ProductFilter {
	constructor() {
		this.filterButtons = document.querySelectorAll('.filter-btn')
		this.productItems = document.querySelectorAll('.product-item')
		this.init()
	}

	init() {
		if (this.filterButtons.length === 0) return

		this.filterButtons.forEach(button => {
			button.addEventListener('click', e => {
				this.handleFilterClick(e.target)
			})
		})
	}

	handleFilterClick(button) {
		// Update active button
		this.filterButtons.forEach(btn => btn.classList.remove('active'))
		button.classList.add('active')

		const filterValue = button.getAttribute('data-filter')

		// First, hide all items
		this.productItems.forEach(item => {
			item.style.display = 'none'
			item.style.opacity = '0'
			item.style.transform = 'scale(0.8)'
		})

		// Then show matching items with animation
		this.productItems.forEach((item, index) => {
			const matchesFilter =
				filterValue === 'all' ||
				item.getAttribute('data-category') === filterValue

			if (matchesFilter) {
				// Small delay for stagger effect
				setTimeout(() => {
					item.style.display = 'block'
					setTimeout(() => {
						item.style.opacity = '1'
						item.style.transform = 'scale(1)'
					}, 50)
				}, index * 100)
			}
		})
	}
}

// Enhanced Mobile Navigation
class MobileNavigation {
	constructor() {
		this.hamburger = document.querySelector('.hamburger')
		this.navMenu = document.querySelector('.nav-menu')
		this.init()
	}

	init() {
		if (!this.hamburger) return

		this.hamburger.addEventListener('click', () => this.toggleMenu())

		// Close menu when clicking on links
		document.querySelectorAll('.nav-menu a').forEach(link => {
			link.addEventListener('click', () => this.closeMenu())
		})

		// Close menu when clicking outside
		document.addEventListener('click', e => {
			if (
				!this.navMenu.contains(e.target) &&
				!this.hamburger.contains(e.target)
			) {
				this.closeMenu()
			}
		})
	}

	toggleMenu() {
		this.hamburger.classList.toggle('active')
		this.navMenu.classList.toggle('active')

		// Prevent body scroll when menu is open
		document.body.style.overflow = this.navMenu.classList.contains('active')
			? 'hidden'
			: ''
	}

	closeMenu() {
		this.hamburger.classList.remove('active')
		this.navMenu.classList.remove('active')
		document.body.style.overflow = ''
	}
}

// Contact Copy System
class ContactCopySystem {
	constructor() {
		this.contactItems = document.querySelectorAll('.contact-item:not(.no-copy)')
		this.init()
	}

	init() {
		if (this.contactItems.length === 0) return

		this.contactItems.forEach(item => {
			item.addEventListener('click', e => {
				this.copyContactInfo(e.currentTarget)
			})
		})
	}

	copyContactInfo(contactItem) {
		const valueElement = contactItem.querySelector('.contact-value')
		const textToCopy = valueElement.textContent.trim()

		// Create temporary textarea for copying
		const textarea = document.createElement('textarea')
		textarea.value = textToCopy
		textarea.style.position = 'fixed'
		textarea.style.opacity = '0'
		document.body.appendChild(textarea)
		textarea.select()
		textarea.setSelectionRange(0, 99999) // For mobile devices

		try {
			const successful = document.execCommand('copy')
			document.body.removeChild(textarea)

			if (successful) {
				this.showCopyFeedback(contactItem)
				this.showNotification(`Скопировано: ${textToCopy}`, 'success')
			} else {
				this.showNotification(
					'Не удалось скопировать. Попробуйте еще раз.',
					'error'
				)
			}
		} catch (err) {
			document.body.removeChild(textarea)
			// Fallback for modern browsers
			if (navigator.clipboard) {
				navigator.clipboard
					.writeText(textToCopy)
					.then(() => {
						this.showCopyFeedback(contactItem)
						this.showNotification(`Скопировано: ${textToCopy}`, 'success')
					})
					.catch(() => {
						this.showNotification(
							'Не удалось скопировать. Попробуйте еще раз.',
							'error'
						)
					})
			} else {
				this.showNotification('Браузер не поддерживает копирование.', 'error')
			}
		}
	}

	showCopyFeedback(contactItem) {
		// Remove copied class from all items
		this.contactItems.forEach(item => item.classList.remove('copied'))

		// Add copied class to current item
		contactItem.classList.add('copied')

		// Remove copied class after 2 seconds
		setTimeout(() => {
			contactItem.classList.remove('copied')
		}, 2000)
	}

	showNotification(message, type = 'info') {
		const notification = document.createElement('div')
		notification.className = `notification notification-${type}`
		notification.textContent = message

		const colors = {
			success: '#28a745',
			error: '#dc3545',
			info: '#87CEEB'
		}

		notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
            background: ${colors[type] || colors.info};
            box-shadow: 0 4px 15px rgba(108, 117, 125, 0.2);
        `

		document.body.appendChild(notification)

		setTimeout(() => {
			notification.style.animation = 'slideOut 0.3s ease'
			setTimeout(() => {
				if (notification.parentNode) {
					notification.parentNode.removeChild(notification)
				}
			}, 300)
		}, 3000)
	}
}

// Enhanced Scroll Animation System for About Page
class AboutPageAnimator {
	constructor() {
		this.sections = []
		this.cards = []
		this.init()
	}

	init() {
		this.cacheElements()
		this.createObserver()
	}

	cacheElements() {
		// Cache main sections
		this.sections = document.querySelectorAll(
			[
				'.about-grid',
				'.about-stats',
				'.values-grid',
				'.team-grid',
				'.timeline',
				'.certificates-grid',
				'.about-content',
				'.section-title',
				'.cta .container'
			].join(',')
		)

		// Cache individual cards
		this.cards = document.querySelectorAll(
			[
				'.stat-card',
				'.value-card',
				'.team-card',
				'.certificate-card',
				'.timeline-item'
			].join(',')
		)
	}

	createObserver() {
		const options = {
			threshold: 0.1,
			rootMargin: '50px'
		}

		this.sectionObserver = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible')
				}
			})
		}, options)

		this.cardObserver = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible')
					}
				})
			},
			{
				threshold: 0.1,
				rootMargin: '30px'
			}
		)

		// Observe sections
		this.sections.forEach(section => {
			this.sectionObserver.observe(section)
		})

		// Observe individual cards
		this.cards.forEach(card => {
			this.cardObserver.observe(card)
		})
	}
}

// Product Details Modal
function showProductDetails(productId) {
	// Здесь можно добавить логику для показа деталей продукта
	// Например, открыть модальное окно или перейти на отдельную страницу
	console.log('Showing details for product:', productId)

	// Временное решение - показать уведомление
	showNotification(
		'Функция "Подробнее" будет доступна в следующем обновлении',
		'info'
	)
}

// Notification system
function showNotification(message, type = 'info') {
	const notification = document.createElement('div')
	notification.className = `notification notification-${type}`
	notification.textContent = message

	const colors = {
		success: '#28a745',
		error: '#dc3545',
		info: '#87CEEB'
	}

	notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
        background: ${colors[type] || colors.info};
        box-shadow: 0 4px 15px rgba(108, 117, 125, 0.2);
    `

	document.body.appendChild(notification)

	setTimeout(() => {
		notification.style.animation = 'slideOut 0.3s ease'
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification)
			}
		}, 300)
	}, 3000)
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault()
			const target = document.querySelector(this.getAttribute('href'))
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			}
		})
	})
}

// Scroll to top button
function initScrollToTop() {
	const scrollToTopBtn = document.createElement('button')
	scrollToTopBtn.innerHTML = '↑'
	scrollToTopBtn.setAttribute('aria-label', 'Вернуться наверх')
	scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        display: none;
        z-index: 9999;
        transition: all 0.3s;
        opacity: 0;
        transform: scale(0);
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    `

	scrollToTopBtn.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	})

	document.body.appendChild(scrollToTopBtn)

	let scrollTimeout
	window.addEventListener('scroll', () => {
		clearTimeout(scrollTimeout)

		if (window.pageYOffset > 300) {
			scrollToTopBtn.style.display = 'block'
			setTimeout(() => {
				scrollToTopBtn.style.opacity = '1'
				scrollToTopBtn.style.transform = 'scale(1)'
			}, 100)
		} else {
			scrollToTopBtn.style.opacity = '0'
			scrollToTopBtn.style.transform = 'scale(0)'
			scrollTimeout = setTimeout(() => {
				scrollToTopBtn.style.display = 'none'
			}, 300)
		}
	})
}

// Add CSS for animations
const style = document.createElement('style')
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`
document.head.appendChild(style)

// Handle page load - show content after transition
window.addEventListener('load', () => {
	document.body.style.opacity = '1'

	// Remove page transition if it exists
	const transitionEl = document.querySelector('.page-transition')
	if (transitionEl) {
		setTimeout(() => {
			transitionEl.classList.remove('active')
		}, 100)
	}
})

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	console.log('DOM loaded - initializing systems')

	// Initialize page transition
	new PageTransition()

	// Initialize scroll animations
	new ScrollAnimator()

	// Initialize product filter
	new ProductFilter()

	// Initialize mobile navigation
	new MobileNavigation()

	// Initialize contact copy system
	new ContactCopySystem()

	// Initialize about page animations if on about page
	if (document.querySelector('.about-hero')) {
		new AboutPageAnimator()
	}

	// Initialize smooth scrolling for anchor links
	initSmoothScrolling()

	// Initialize scroll to top button
	initScrollToTop()
})
