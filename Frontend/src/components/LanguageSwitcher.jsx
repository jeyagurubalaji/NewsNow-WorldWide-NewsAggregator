import { useEffect } from 'react'
import { LANGUAGES } from '../data/languages'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  useEffect(() => {
    const cookieVal = `/en/${language}`
    document.cookie = `googtrans=${cookieVal}; path=/;`
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname};`

    if (!window.google || !window.google.translate) {
      if (!document.getElementById('google-translate-script')) {
        window.googleTranslateElementInit = () => {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement(
              { pageLanguage: 'en', autoDisplay: false },
              'google_translate_element'
            )
          }
        }

        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true
        document.body.appendChild(script)
      }
    }
  }, [language])

  const handleChange = (e) => {
    const code = e.target.value
    changeLanguage(code)

    const cookieVal = `/en/${code}`
    document.cookie = `googtrans=${cookieVal}; path=/;`
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname};`

    const googleSelect = document.querySelector('#google_translate_element select')
    if (googleSelect) {
      googleSelect.value = code
      googleSelect.dispatchEvent(new Event('change'))
    }

    window.location.reload()
  }

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} />

      <select
        value={language}
        onChange={handleChange}
        aria-label="Select language"
        className="notranslate newsnow-lang-select"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </>
  )
}