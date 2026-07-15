// Suricata encode la severite en entier (1 = high, 2 = medium, 3 = low ; plus
// le chiffre est bas, plus l'alerte est prioritaire). On normalise ici pour
// l'affichage (badges, filtres) plutot que de se fier a une chaine de texte
// que Suricata n'envoie jamais.
export function severityLabel(severity: number | string): 'critical' | 'high' | 'medium' | 'low' {
  const n = typeof severity === 'number' ? severity : parseInt(severity, 10)
  if (!Number.isNaN(n)) {
    if (n <= 1) return 'high'
    if (n === 2) return 'medium'
    return 'low'
  }
  const s = String(severity).toLowerCase()
  if (s.includes('crit')) return 'critical'
  if (s.includes('high')) return 'high'
  if (s.includes('med')) return 'medium'
  return 'low'
}
