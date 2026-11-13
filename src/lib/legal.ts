// TODO: have this reviewed by a lawyer before launch.
// General templates for an Ontario marketing agency. Not legal advice.

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: { id: string; title: string; body: string[] }[];
};

const CONTACT_LINE =
  "Smart Solutions Inc., 3300 Hwy 7, Floor 6, Concord, ON L4K 4M3. Phone: (647) 559-3900.";

export const privacy: LegalDoc = {
  title: "Privacy Policy",
  updated: "November 2026",
  intro:
    "Smart Solutions Inc. (\"Smart Solutions\", \"we\", \"us\") respects your privacy. This policy explains what personal information we collect through vasay.ai, how we use it and the choices you have. We handle personal information in line with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA).",
  sections: [
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: [
        "Information you give us: when you fill in our contact form, call or email us, we collect details such as your name, email address, phone number, company or website, the service you're interested in, your budget range and your message.",
        "Information collected automatically: when you visit our website we may collect technical data such as your IP address, browser type, device, pages viewed and how you arrived at the site. We collect this through cookies and similar technologies, including analytics tools.",
      ],
    },
    {
      id: "how-we-use",
      title: "How we use your information",
      body: [
        "We use your information to reply to your enquiry, provide quotes and services, schedule calls and appointments, send follow-up messages related to your enquiry, improve our website and services, and meet our legal obligations.",
        "We only send marketing messages where we have your consent, as required by Canada's Anti-Spam Legislation (CASL). You can unsubscribe at any time.",
      ],
    },
    {
      id: "consent",
      title: "Consent",
      body: [
        "By submitting a form or contacting us, you consent to us collecting and using your information for the purposes described in this policy. You may withdraw your consent at any time, subject to legal or contractual restrictions, by contacting us.",
      ],
    },
    {
      id: "crm-and-service-providers",
      title: "CRM and service providers",
      body: [
        "We store enquiries and client records in a customer relationship management (CRM) platform, such as GoHighLevel, and use trusted providers for email delivery, website hosting and analytics.",
        "These providers only process your information on our behalf and are required to protect it. Some providers may store data outside Canada, including in the United States, where it may be subject to the laws of that country.",
      ],
    },
    {
      id: "cookies-and-analytics",
      title: "Cookies and analytics",
      body: [
        "We use cookies and analytics tools to understand how visitors use our website and to improve it. Advertising platforms may also use cookies to measure the performance of our ads.",
        "You can block or delete cookies through your browser settings. Some parts of the site may not work as intended if you do.",
      ],
    },
    {
      id: "sharing",
      title: "When we share information",
      body: [
        "We do not sell your personal information. We share it only with service providers acting on our behalf, when required by law, or as part of a business transaction such as a merger, in which case it remains protected under this policy.",
      ],
    },
    {
      id: "retention-and-security",
      title: "Retention and security",
      body: [
        "We keep personal information only as long as needed for the purposes above or as required by law. We use reasonable physical, technical and administrative safeguards to protect it, though no method of transmission or storage is completely secure.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: [
        "Under PIPEDA you may ask to access the personal information we hold about you, ask us to correct it, or withdraw your consent. To make a request, contact us using the details below. We'll respond within 30 days.",
        "If you're not satisfied with our response, you may contact the Office of the Privacy Commissioner of Canada.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: ["We may update this policy from time to time. The latest version will always be posted on this page with its effective date."],
    },
    {
      id: "contact",
      title: "Contact us",
      body: [`Questions about privacy can be sent to our Privacy Officer at: ${CONTACT_LINE}`],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of Service",
  updated: "November 2026",
  intro:
    "These terms govern your use of vasay.ai, operated by Smart Solutions Inc. By using this website you agree to them. Services we provide to clients are also governed by a separate written proposal or agreement, which takes priority if there's any conflict.",
  sections: [
    {
      id: "use-of-website",
      title: "Use of this website",
      body: [
        "You may use this website for lawful purposes only. You agree not to interfere with its operation, attempt unauthorised access, or submit false, harmful or spam content through our forms.",
      ],
    },
    {
      id: "services",
      title: "Our services",
      body: [
        "Information on this website describes our services in general terms. Scope, deliverables, timelines and fees for any project are set out in a written proposal or agreement between you and Smart Solutions.",
        "Any results, figures or examples shown on this site are for illustration and are not a guarantee of future results.",
      ],
    },
    {
      id: "fees-and-ad-spend",
      title: "Fees and advertising spend",
      body: [
        "Fees are as stated in your proposal or agreement. Advertising spend on platforms such as Google, Meta and TikTok is paid directly to those platforms and is separate from our management fees unless agreed otherwise in writing.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: [
        "The content, design, text, graphics and logos on this website belong to Smart Solutions or its licensors and may not be copied or reused without permission.",
        "Ownership of work created for clients is set out in each client agreement. Unless agreed otherwise, final approved deliverables transfer to the client once paid in full.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-party links and platforms",
      body: [
        "This website may link to third-party websites and platforms. We're not responsible for their content, policies or availability, and your use of them is governed by their own terms.",
      ],
    },
    {
      id: "disclaimer",
      title: "Disclaimer",
      body: [
        "This website is provided \"as is\". While we work to keep it accurate and available, we make no warranties that it will be error-free or uninterrupted. Nothing on this site is legal, financial or professional advice.",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of liability",
      body: [
        "To the extent permitted by law, Smart Solutions is not liable for any indirect, incidental or consequential loss arising from your use of this website. Liability for client services is governed by the relevant client agreement.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      body: ["Our collection and use of personal information is described in our Privacy Policy."],
    },
    {
      id: "governing-law",
      title: "Governing law",
      body: [
        "These terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply there. Any dispute will be handled by the courts of Ontario.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: ["We may update these terms from time to time. Continued use of the website after changes are posted means you accept them."],
    },
    {
      id: "contact",
      title: "Contact us",
      body: [`Questions about these terms can be sent to: ${CONTACT_LINE}`],
    },
  ],
};
