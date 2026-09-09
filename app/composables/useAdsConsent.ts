export function useAdsConsent() {
  const choice = useState<'accepted' | 'denied' | null>('avyro-ads-consent', () => null)
  const editing = useState('avyro-ads-consent-editing', () => false)
  function select(value: 'accepted' | 'denied') {
    choice.value = value; editing.value = false
    try { localStorage.setItem('avyro-ads-consent-v1', value) } catch { /* Consent remains valid for this visit if storage is unavailable. */ }
  }
  return { choice, editing, select }
}
