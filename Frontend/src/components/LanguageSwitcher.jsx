import { useEffect } from 'react'
import { LANGUAGES } from '../data/languages'
import { useLanguage } from '../context/LanguageContext'

function setGoogleTransCookie(langCode) {
  const value = langCode === 'en' ? '' : `/en/${langCode}`
  document.cookie = `googtrans=${value}; path=/;`
}

function applyWidgetLanguage(langCode) {
  const googleSelect = document.querySelector('#google_translate_element select.goog-te-combo')
  if (googleSelect) {
    googleSelect.value = langCode
    googleSelect.dispatchEvent(new Event('change'))
  }
}

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  useEffect(() => {
    setGoogleTransCookie(language)

    if (!window.google?.translate?.TranslateElement) {
      if (!document.getElementById('google-translate-script')) {
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: LANGUAGES.map((l) => l.code).join(','),
              autoDisplay: false,
            },
            'google_translate_element'
          )
          setTimeout(() => applyWidgetLanguage(language), 300)
        }

        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true
        document.body.appendChild(script)
      }
    } else {
      applyWidgetLanguage(language)
    }
  }, [language])

  const handleChange = (e) => {
    const code = e.target.value
    setGoogleTransCookie(code)
    changeLanguage(code)
    applyWidgetLanguage(code)
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