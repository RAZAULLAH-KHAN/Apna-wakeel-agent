import fs from 'fs';
import path from 'path';

export interface EmergencyContact {
  id: string;
  name: string;
  name_ur: string;
  number: string;
  display_number: string;
  category: string;
  description: string;
  description_ur: string;
  urgency: string;
  hours: string;
  website?: string;
}

export function getEmergencyContacts(category?: string): EmergencyContact[] {
  try {
    const contactsPath = path.join(process.cwd(), 'data', 'emergency_contacts.json');
    if (!fs.existsSync(contactsPath)) return [];
    const raw = fs.readFileSync(contactsPath, 'utf-8');
    const all: EmergencyContact[] = JSON.parse(raw);

    if (!category || category === 'general') {
      return all;
    }

    const filtered = all.filter(
      (c) =>
        c.category === category.toLowerCase() ||
        c.category === 'emergency' ||
        (category === 'assault' && (c.category === 'police' || c.category === 'emergency')) ||
        (category === 'theft_robbery' && (c.category === 'police' || c.category === 'emergency'))
    );
    return filtered.length > 0 ? filtered : all;
  } catch (err) {
    console.error('Error loading emergency contacts:', err);
    return [];
  }
}

export function classifySituation(text: string): {
  category: 'police' | 'business' | 'women' | 'cyber' | 'assault' | 'theft_robbery' | 'fraud' | 'general';
  urgency: 'critical' | 'high' | 'medium';
} {
  const lower = text.toLowerCase();

  // 1. Armed Robbery / Mobile Snatching / Street Theft
  if (
    lower.includes('rob') ||
    lower.includes('snatch') ||
    lower.includes('gunpoint') ||
    lower.includes('pistol') ||
    lower.includes('chori') ||
    lower.includes('stolen') ||
    lower.includes('chheen') ||
    lower.includes('dacoit') ||
    lower.includes('mug') ||
    lower.includes('weapon') ||
    lower.includes('dakaiti')
  ) {
    return { category: 'theft_robbery', urgency: 'critical' };
  }

  // 2. Physical Assault / Slap / Hurt / Road Rage
  if (
    lower.includes('slap') ||
    lower.includes('thappar') ||
    lower.includes('beat') ||
    lower.includes('punch') ||
    lower.includes('hit') ||
    lower.includes('attack') ||
    lower.includes('maar peet') ||
    lower.includes('marha') ||
    lower.includes('hurt') ||
    lower.includes('injury') ||
    lower.includes('fight') ||
    lower.includes('wound')
  ) {
    return { category: 'assault', urgency: 'high' };
  }

  // 3. Cyber Blackmail / Leaked photos / Digital Extortion
  if (
    lower.includes('photo') ||
    lower.includes('tasveer') ||
    lower.includes('blackmail') ||
    lower.includes('leak') ||
    lower.includes('video') ||
    lower.includes('fia') ||
    lower.includes('cyber') ||
    lower.includes('whatsapp') ||
    lower.includes('hacked') ||
    lower.includes('instagram') ||
    lower.includes('peca')
  ) {
    return { category: 'cyber', urgency: 'high' };
  }

  // 4. Harassment of Women / Domestic Violence
  if (
    lower.includes('harass') ||
    lower.includes('aurat') ||
    lower.includes('larki') ||
    lower.includes('woman') ||
    lower.includes('women') ||
    lower.includes('stalk') ||
    lower.includes('chher') ||
    lower.includes('tang karna') ||
    lower.includes('taaqub') ||
    lower.includes('domestic') ||
    lower.includes('abuse')
  ) {
    return { category: 'women', urgency: 'high' };
  }

  // 5. Fraud / Scam / Financial Cheating
  if (
    lower.includes('fraud') ||
    lower.includes('scam') ||
    lower.includes('420') ||
    lower.includes('dhoka') ||
    lower.includes('cheated') ||
    lower.includes('fake')
  ) {
    return { category: 'fraud', urgency: 'medium' };
  }

  // 6. Business Bribery / Extortion
  if (
    lower.includes('bribe') ||
    lower.includes('rishwat') ||
    lower.includes('chai pani') ||
    lower.includes('bhatta') ||
    lower.includes('dukaan') ||
    lower.includes('thela') ||
    lower.includes('vendor') ||
    lower.includes('seal') ||
    lower.includes('extortion') ||
    lower.includes('challan')
  ) {
    return { category: 'business', urgency: 'medium' };
  }

  // 7. Police Night Call / Summons / FIR / Unlawful Detention
  if (
    lower.includes('police') ||
    lower.includes('thana') ||
    lower.includes('thaana') ||
    lower.includes('fir') ||
    lower.includes('arrest') ||
    lower.includes('hiraasat') ||
    lower.includes('summons') ||
    lower.includes('call') ||
    lower.includes('hawalat') ||
    lower.includes('remand')
  ) {
    return { category: 'police', urgency: 'high' };
  }

  return { category: 'general', urgency: 'medium' };
}
