import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const draftSchema = z.object({
  type: z.enum(['police_sho', 'fia_cyber', 'extortion_bribe']),
  fields: z.object({
    applicantName: z.string().min(1, 'Name is required'),
    cnic: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    cityStation: z.string().min(1, 'Location/Police station is required'),
    incidentDate: z.string().min(1, 'Date is required'),
    details: z.string().min(5, 'Details are required'),
    oppositeParty: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = draftSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid fields provided', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { type, fields } = parsed.data;
    let draftText = '';

    if (type === 'police_sho') {
      draftText = `To,
The Station House Officer (SHO),
Police Station: ${fields.cityStation},
Pakistan.

Subject: APPLICATION FOR WRITTEN CLARIFICATION AND FORMAL RECORD REGARDING INFORMAL INQUIRY / SUMMONS (UNDER CRPC SECTION 160)

Respected Sir / Madam,

I, the undersigned applicant, ${fields.applicantName} (Contact: ${fields.phone}${fields.cnic ? `, CNIC: ${fields.cnic}` : ''}), respectfully state as follows:

1. That on ${fields.incidentDate}, I received an informal verbal/telephonic summons from your police station regarding:
"${fields.details}".

2. That as a law-abiding citizen of the Islamic Republic of Pakistan, I am fully committed to cooperating with any lawful inquiry in accordance with Article 4 and Article 10 of the Constitution of Pakistan (1973).

3. That under Section 160 of the Code of Criminal Procedure (CrPC 1898), attendance of any citizen for inquiry requires an official, written order stating the formal FIR number or diary reference number. 

4. I humbly request your office to provide:
   a) Confirmation of whether any FIR is registered against me, along with the FIR number, date, and penal sections.
   b) A formal written notice under Section 160 CrPC indicating the date and daylight time for my appearance.

5. I reiterate that I am ready and willing to present myself before your office during formal daylight working hours accompanied by my legal counsel / family elders upon receipt of due written process.

Yours faithfully,

_______________________
Applicant: ${fields.applicantName}
Phone: ${fields.phone}
Date: ${new Date().toLocaleDateString('en-GB')}
`;
    } else if (type === 'fia_cyber') {
      draftText = `To,
The In-Charge / Additional Director,
Federal Investigation Agency (FIA) Cyber Crime Wing (NR3C),
Reporting Center / Zone: ${fields.cityStation},
Pakistan.

Subject: FORMAL COMPLAINT UNDER SECTIONS 20, 21, AND 24 OF THE PREVENTION OF ELECTRONIC CRIMES ACT (PECA 2016) REGARDING ONLINE BLACKMAIL, CYBER HARASSMENT, AND EXTORTION

Respected Officer,

I, ${fields.applicantName} (Contact: ${fields.phone}${fields.cnic ? `, CNIC: ${fields.cnic}` : ''}), resident of ${fields.cityStation}, solemnly submit this complaint:

1. INCIDENT DETAILS:
On or about ${fields.incidentDate}, the following unlawful cyber harassment / blackmail occurred:
"${fields.details}"

2. ACCUSED / OPPOSING PARTY DETAILS:
${fields.oppositeParty ? `Identified as / Known as: ${fields.oppositeParty}` : 'Account / Phone / Digital Identity as preserved in attached screenshots.'}

3. LEGAL VIOLATIONS:
The alleged actions constitute severe non-bailable offences under:
- Section 21 PECA 2016 (Offences against modesty of a natural person / blackmail with images/videos)
- Section 24 PECA 2016 (Cyberstalking and unlawful coercion)
- Section 383/384 Pakistan Penal Code (PPC) (Extortion)

4. PRAYER:
It is respectfully prayed that the FIA Cyber Crime Wing register a formal enquiry/case, take digital forensic notice of the IP addresses and phone numbers used, block the dissemination of any illicit material, and initiate criminal proceedings against the accused.

All digital evidence (screenshots, chat logs, call recordings, transaction records) is preserved and attached herewith for official forensic verification.

Sincerely,

_______________________
Complainant: ${fields.applicantName}
Phone: ${fields.phone}
Date: ${new Date().toLocaleDateString('en-GB')}
`;
    } else if (type === 'extortion_bribe') {
      draftText = `To,
The Senior Superintendent of Police (SSP) / Director Anti-Corruption Establishment,
Complaints & Inquiries Cell,
District / Division: ${fields.cityStation},
Pakistan.

Subject: COMPLAINT REGARDING UNLAWFUL DEMAND OF ILLEGAL GRATIFICATION (BRIBERY) AND THREATS OF EXTORTION UNDER SECTION 161 PPC READ WITH SECTION 5(2) OF PREVENTION OF CORRUPTION ACT 1947

Respected Authority,

I, ${fields.applicantName} (Contact: ${fields.phone}), operating lawful business / residing at ${fields.cityStation}, respectfully submit:

1. That on ${fields.incidentDate}, an unlawful demand for illegal money / gratification was made:
"${fields.details}"

2. Official / Personnel involved: ${fields.oppositeParty || 'Patrol officer / official on duty as detailed'}.

3. That demanding or accepting illegal gratification ("chai pani / bhatta") by any public servant is a cognizable criminal offence under Section 161 PPC and Section 5(2) of the Prevention of Corruption Act 1947. Furthermore, threatening to harm a lawful business or property without legal process constitutes extortion under Section 383/384 PPC.

4. I have refused to pay illegal cash and have requested an official government challan/treasury voucher, which was refused.

5. It is therefore respectfully prayed that an impartial departmental and criminal inquiry be initiated to protect honest citizens and business owners from harassment and misuse of official authority.

Yours obediently,

_______________________
Complainant: ${fields.applicantName}
Phone: ${fields.phone}
Date: ${new Date().toLocaleDateString('en-GB')}
`;
    }

    return NextResponse.json({ draft: draftText });
  } catch (error: any) {
    console.error('Error generating draft:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
