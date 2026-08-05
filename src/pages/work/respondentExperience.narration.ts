import type { NarrationSection } from '../../components/case-study/CaseStudyListenPlayer';

/**
 * Curated narration transcript for the respondent-experience case study.
 *
 * This is written by hand rather than scraped from the DOM. It deliberately
 * omits breadcrumbs, badges, navigation labels, button labels, table headers,
 * decorative diagram labels, collapsed supporting evidence and the footer —
 * so the spoken version is a genuine summary, shorter than the visible page.
 *
 * Wording follows the same public-safe rules as the page: approximate and
 * separate figures, no confidential identifiers, and every recommendation
 * described as not yet validated (stated once, in the limitations section).
 */
export const NARRATION_SECTIONS: NarrationSection[] = [
    {
        title: 'Overview',
        body:
            'Three Questions Were Not the Problem. An internal low-participation workplace-survey pilot revealed that respondent experience depends on more than survey length. People also need relevance, manageable effort, practical safety, visible impact and confidence that someone will act. The central question behind this case study is: what prevents people from repeatedly providing honest feedback, even when a survey is short and easy to complete?',
    },
    {
        title: 'The problem',
        body:
            'To investigate, I studied an internal recurring workplace-survey pilot. Approximately 98 employees were invited, the survey contained three short questions, and participation remained around 11 percent during the research period. Participation also declined across repeated iterations. Because the form was only three questions and took under about two minutes, low participation could not be explained by length or complexity. The instinct was to treat this as survey friction. The evidence pointed elsewhere, from a surface symptom to an underlying respondent contract.',
    },
    {
        title: 'Respondent journey',
        body:
            'Following one respondent through a single cycle showed where the experience thinned. The invitation arrived as just another workplace email and was easy to miss. The reminder became the real entry point, but it was written as though the invitation had already been read, so it carried little context. Completion itself was genuinely easy. After submitting, there was silence: no signal about who would see the response or whether anything happened. Then the same request returned the following week. There were two primary breaks: between invitation and reminder, and between submission and any visible impact.',
    },
    {
        title: 'Five conditions',
        body:
            'Five conditions form what I call the respondent contract. Relevance: why does this matter, and why am I being asked again? Effort: what does responding require beyond the time spent filling the form? Safety: can I answer honestly without being personally exposed? Impact: what happens after I submit? Ownership: who is responsible for acting? The pilot was weak on most of these.',
    },
    {
        title: 'Key decisions',
        body:
            'Four findings drove the main decisions. First, the reminder became the actual entry point, so the experience could not depend on the welcome communication being remembered; every reminder should be independently understandable. Second, anonymity was stated but not explained in practice, so an abstract privacy claim did not create felt safety; grouped reporting, open-text handling and minimum-response protection should be explained. Third, respondents saw no visible impact after submitting, so a recurring request had not earned the next response; a visible closure loop is needed. Fourth, governance and manager action ownership were blurred, so no role clearly owned what happens next; governance should be separated from action ownership.',
    },
    {
        title: 'Feedback loop',
        body:
            'A recurring survey is a loop: ask, respond, protect and aggregate, interpret, act, communicate impact, then ask again. In this pilot the communicate-impact step was missing. The consequence follows a clear chain: no visible action leads to lower trust, which leads to weaker future participation. A recurring survey must earn the next response.',
    },
    {
        title: 'Ownership',
        body:
            'The recommended ownership model separates five roles. Respondents provide honest feedback. Managers interpret team-level insight, discuss themes, take action and communicate closure. Governance runs the program, protects anonymity, monitors organisation-level patterns and enables managers. Leadership reviews systemic patterns and supports organisation-level action. The system aggregates responses, protects thresholds and supports communication. The guiding principle: when governance owns the entire activity, it risks becoming an HR survey. When managers own follow-up, it becomes a management practice.',
    },
    {
        title: 'Future direction',
        body:
            'The recommended lifecycle strengthens all five conditions together. Explain purpose. Invite safely. Make completion easy. Protect and aggregate. Interpret at the right level. Act. Communicate what changed. And in doing so, earn the next response. It is worth noting that shorter surveys reduce interaction effort, and conversational formats may improve engagement, but neither creates relevance, safety, impact or ownership on its own.',
    },
    {
        title: 'Limitations',
        body:
            'This was a small, early qualitative study in one internal organisation, drawing on one employee interview, one governance stakeholder interview, management feedback, communication reviews and a respondent journey review. Management input was stakeholder feedback rather than a formal interview. The findings are directional hypotheses, not statistically representative conclusions. Every recommendation described here is exactly that, a recommendation: none has shipped, and none has post-change measurement, so none is yet validated.',
    },
    {
        title: 'Reflection',
        body:
            'Participation was the visible symptom. Underneath it sat a system of purpose, trust, honesty, visible impact and ownership. A three-question form can be effortless to complete and still fail if people do not know why it repeats, whether it is genuinely safe, or whether anything happens afterward. The most useful contribution was diagnostic: reframing a dashboard-value problem as an upstream respondent-experience problem, and staying honest about the line between what the evidence confirmed and what it only suggested.',
    },
];
