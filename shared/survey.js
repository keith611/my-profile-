/**
 * Canonical Vexa survey definition.
 * Question text, options, order, required flags, and branching
 * match the original Google Form. Do not edit wording here
 * unless the source-of-truth form changes.
 */

export const SURVEY_TITLE = 'Vexa Early Access & Applicant Form';

export const SURVEY_INTRO = {
  paragraphs: [
    'We are developing a new way for professionals, entrepreneurs, businesses, and organizations to connect and exchange contact information.',
    'Instead of relying on traditional paper business cards, Vexa uses digital profiles, NFC technology, and smart networking tools to make connections easier to create, manage, and follow up.',
    'We are currently looking for people interested in testing Vexa and helping us shape the product before launch.',
    'Estimated completion time: 3–5 minutes.',
    'Your responses will help us understand how people currently network and what would make a digital networking platform genuinely useful.',
  ],
};

export const COLUMN_ORDER = [
  'response_id',
  'submitted_at',
  'email',
  'full_name',
  'email_address',
  'phone_number',
  'description',
  'industry',
  'job_title',
  'networking_frequency',
  'networking_locations',
  'contact_sharing_methods',
  'physical_business_card_frequency',
  'contact_follow_up_behavior',
  'networking_problems',
  'concept_usefulness',
  'valuable_features',
  'nfc_card_interest',
  'nfc_vs_paper_preference',
  'business_use',
  'team_profiles',
  'concerns',
  'trust_factors',
  'early_access_interest',
  'testing_interests',
  'testing_participation',
  'need_feature',
  'additional_feedback',
];

export const EARLY_ACCESS_QUESTION_ID = 'early_access_interest';
export const CONDITIONAL_QUESTION_IDS = ['testing_interests', 'testing_participation'];
export const EARLY_ACCESS_CONTINUE_VALUES = ['Yes', 'Maybe'];

export const surveySections = [
  {
    id: 'section_about_you',
    title: 'About you',
    description:
      "First, we'd like to understand a little about you and your professional background.",
    questions: [
      {
        id: 'email',
        number: 1,
        type: 'email',
        question: 'Email',
        required: true,
      },
      {
        id: 'full_name',
        number: 2,
        type: 'short_text',
        question: 'Full Name',
        required: true,
      },
      {
        id: 'email_address',
        number: 3,
        type: 'email',
        question: 'Email Address',
        required: true,
      },
      {
        id: 'phone_number',
        number: 4,
        type: 'phone',
        question: 'Phone Number',
        required: true,
      },
      {
        id: 'description',
        number: 5,
        type: 'multiple_choice',
        question: 'What best describes you?',
        required: true,
        options: [
          'Entrepreneur / Business Owner',
          'Employee / Professional',
          'Freelancer',
          'Student',
          'Sales / Business Development',
          'Marketing Professional',
          'Consultant',
          'Event Organizer',
          'Company / Organization Representative',
          'Other',
        ],
      },
      {
        id: 'industry',
        number: 6,
        type: 'short_text',
        question: 'What industry or field are you in?',
        required: true,
      },
      {
        id: 'job_title',
        number: 7,
        type: 'short_text',
        question: 'What is your current job title or role?',
        required: false,
      },
    ],
  },
  {
    id: 'section_networking_habits',
    title: 'Your networking habits',
    description:
      "We'd like to understand how you currently meet and exchange information with professional contacts.",
    questions: [
      {
        id: 'networking_frequency',
        number: 8,
        type: 'multiple_choice',
        question: 'How often do you meet new professional contacts?',
        required: true,
        options: [
          'Daily',
          'Several times a week',
          'Weekly',
          'Several times a month',
          'Occasionally',
          'Rarely',
        ],
      },
      {
        id: 'networking_locations',
        number: 9,
        type: 'checkboxes',
        question: 'Where do you usually meet new professional contacts?',
        required: true,
        options: [
          'Business events',
          'Conferences',
          'Networking events',
          'Trade shows / exhibitions',
          'Workplace',
          'Universities / career events',
          'Social events',
          'Online',
          'Referrals',
          'Other',
        ],
      },
      {
        id: 'contact_sharing_methods',
        number: 10,
        type: 'checkboxes',
        question: 'How do you currently share your contact information?',
        required: true,
        options: [
          'Physical business cards',
          'Phone number',
          'WhatsApp',
          'QR code',
          'LinkedIn',
          'Email',
          'Digital business card',
          'Website / portfolio',
          'Other',
        ],
      },
      {
        id: 'physical_business_card_frequency',
        number: 11,
        type: 'multiple_choice',
        question: 'How often do you use physical business cards?',
        required: true,
        options: [
          'Very frequently',
          'Frequently',
          'Sometimes',
          'Rarely',
          'Never',
        ],
      },
      {
        id: 'contact_follow_up_behavior',
        number: 12,
        type: 'multiple_choice',
        question: 'What usually happens to the contacts you meet at networking events?',
        required: true,
        options: [
          'I save them immediately',
          'I save them later',
          'I connect with them on social media',
          'I keep their business card',
          'I usually forget to save them',
          'I often lose track of them',
          'Other',
        ],
      },
    ],
  },
  {
    id: 'section_networking_problem',
    title: 'The networking problem',
    description:
      'We want to understand the challenges people experience after meeting new contacts.',
    questions: [
      {
        id: 'networking_problems',
        number: 13,
        type: 'checkboxes',
        question: 'What problems do you experience when networking?',
        required: true,
        options: [
          'Carrying physical business cards',
          'Running out of business cards',
          'Losing business cards',
          'Contact information becoming outdated',
          'Manually entering contacts into my phone',
          'Forgetting who I met',
          'Forgetting where I met someone',
          'Difficulty following up',
          'Having too many contacts to manage',
          'Finding the right contact later',
          "I don't experience any major problems",
          'Other',
        ],
      },
    ],
  },
  {
    id: 'section_introducing_vexa',
    title: 'Introducing Vexa',
    description:
      'Imagine this:\n\nInstead of giving someone a traditional paper business card, you have a digital professional profile connected to an NFC card.\n\nWhen you meet someone, they simply tap their phone against your NFC card. Your digital profile opens instantly, allowing them to view your contact information, social links, website and other professional details.\n\nThey can then choose to connect with you. Both people can exchange their contact information, and the connection can be saved digitally.\n\nVexa could also allow you to remember where you met someone, add notes about the connection and receive follow-up reminders.\n\nThe goal is to make professional networking easier before, during and after the initial introduction.',
    questions: [
      {
        id: 'concept_usefulness',
        number: 14,
        type: 'linear_scale',
        question: 'How useful would this concept be to you?',
        required: true,
        scale: {
          min: 1,
          max: 5,
          minLabel: 'Not useful at all',
          maxLabel: 'Extremely useful',
        },
      },
      {
        id: 'valuable_features',
        number: 15,
        type: 'checkboxes',
        question: 'Which parts of Vexa would be most valuable to you?',
        required: true,
        options: [
          'NFC contact sharing',
          'QR code sharing',
          'Digital professional profile',
          'Two-way contact exchange',
          'Automatically saving new connections',
          'Networking history',
          'Remembering where I met someone',
          'Adding notes about connections',
          'Follow-up reminders',
          'AI-generated follow-up messages',
          'Networking analytics',
          'Lead management',
          'Event networking',
          'Company/team management',
          'Other',
        ],
      },
      {
        id: 'nfc_card_interest',
        number: 16,
        type: 'multiple_choice',
        question: 'Would you use an NFC card to share your professional information?',
        required: true,
        options: [
          'Definitely',
          'Probably',
          'Maybe',
          'Probably not',
          'Definitely not',
        ],
      },
      {
        id: 'nfc_vs_paper_preference',
        number: 17,
        type: 'multiple_choice',
        question:
          'Would you prefer this method of sharing your information over a traditional paper business card?',
        required: false,
        options: [
          'Definitely yes',
          'Probably yes',
          'Not sure',
          'Probably no',
          'Definitely no',
        ],
      },
    ],
  },
  {
    id: 'section_business_use',
    title: 'Business & professional use',
    description: '',
    questions: [
      {
        id: 'business_use',
        number: 18,
        type: 'multiple_choice',
        question: 'Would you use this platform for your business or professional work?',
        required: true,
        options: ['Yes', 'No', 'Maybe', 'I would need to learn more'],
      },
      {
        id: 'team_profiles',
        number: 19,
        type: 'multiple_choice',
        question:
          'If you work with a team, would you be interested in giving employees their own digital networking profiles?',
        required: false,
        options: [
          'Yes',
          'No',
          'Maybe',
          "Not applicable — I don't work with a team",
        ],
      },
    ],
  },
  {
    id: 'section_concerns_trust',
    title: 'Concerns & trust',
    description: '',
    questions: [
      {
        id: 'concerns',
        number: 20,
        type: 'checkboxes',
        question: 'What concerns would you have about using an NFC networking platform?',
        required: true,
        options: [
          'Privacy',
          'Security',
          'Cost',
          'Data protection',
          'People not knowing how to use NFC',
          'Phone compatibility',
          'Internet connectivity',
          'Sharing my contact information',
          'Receiving unwanted messages',
          "I don't have any concerns",
          'Other',
        ],
      },
      {
        id: 'trust_factors',
        number: 21,
        type: 'long_text',
        question: 'What would make you trust a platform like this?',
        required: false,
      },
    ],
  },
  {
    id: 'section_early_access',
    title: 'Early access',
    description: '',
    questions: [
      {
        id: 'early_access_interest',
        number: 22,
        type: 'multiple_choice',
        question: 'Would you be interested in testing Vexa before public launch?',
        required: true,
        options: ['Yes', 'No', 'Maybe'],
      },
    ],
  },
  {
    id: 'section_early_tester',
    title: 'Early tester details',
    description: '',
    questions: [
      {
        id: 'testing_interests',
        number: 23,
        type: 'checkboxes',
        question: 'What would you be interested in testing?',
        required: true,
        options: [
          'NFC card',
          'Digital profile',
          'Contact exchange',
          'Networking dashboard',
          'Connection history',
          'Follow-up features',
          'Business features',
          'Event networking',
          'All of the above',
        ],
        visibleWhen: {
          questionId: 'early_access_interest',
          values: ['Yes', 'Maybe'],
        },
      },
      {
        id: 'testing_participation',
        number: 24,
        type: 'multiple_choice',
        question: 'How would you prefer to participate in the testing?',
        required: false,
        options: [
          'Test the NFC card',
          'Test the digital profile',
          'Test the contact exchange',
          'Give product feedback',
          'Participate in interviews',
          'Test Vexa at an event',
          'Report bugs or problems',
          'All of the above',
        ],
        visibleWhen: {
          questionId: 'early_access_interest',
          values: ['Yes', 'Maybe'],
        },
      },
    ],
  },
  {
    id: 'section_final_feedback',
    title: 'Final feedback',
    description: '',
    questions: [
      {
        id: 'need_feature',
        number: 25,
        type: 'long_text',
        question: 'What feature would make you say, "I actually need this"?',
        required: false,
      },
      {
        id: 'additional_feedback',
        number: 26,
        type: 'long_text',
        question: "Is there anything else you'd like us to know about Vexa?",
        required: false,
      },
    ],
  },
];

export const allQuestions = surveySections.flatMap((section) =>
  section.questions.map((question) => ({
    ...question,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionDescription: section.description,
  })),
);

export const questionsById = Object.fromEntries(
  allQuestions.map((question) => [question.id, question]),
);

export function isQuestionVisible(question, answers) {
  if (!question.visibleWhen) return true;
  const value = answers[question.visibleWhen.questionId];
  return question.visibleWhen.values.includes(value);
}

export function getVisibleQuestions(answers = {}) {
  return allQuestions.filter((question) => isQuestionVisible(question, answers));
}

export function shouldCollectEarlyTesterDetails(answers = {}) {
  return EARLY_ACCESS_CONTINUE_VALUES.includes(answers[EARLY_ACCESS_QUESTION_ID]);
}
